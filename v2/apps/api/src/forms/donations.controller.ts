import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  ServiceUnavailableException,
  type RawBodyRequest,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DonationFrequency, Prisma } from "@prisma/client";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import type Stripe from "stripe";

import { Staff } from "../auth/roles.decorator";
import { pageArgs, paged, sortArgs } from "../common/pagination";
import { PrismaService } from "../prisma/prisma.service";
import { CaseQueryDto, ConfirmDonationDto, CreateDonationDto, UpdateCaseDto } from "./forms.dto";
import { StripeService } from "./stripe.service";

const billing: Record<Exclude<DonationFrequency, "ONCE">, { interval: "month" | "year"; interval_count: number }> = {
  MONTHLY: { interval: "month", interval_count: 1 },
  QUARTERLY: { interval: "month", interval_count: 3 },
  YEARLY: { interval: "year", interval_count: 1 },
};

@ApiTags("donations")
@Controller()
export class DonationsController {
  private readonly logger = new Logger(DonationsController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly payments: StripeService,
  ) {}

  @Get("public/donations/options")
  options() {
    return { card: this.payments.enabled };
  }

  @Post("public/donations")
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  async submit(@Body() dto: CreateDonationDto) {
    if (dto.website) return { ok: true };
    if (dto.method === "CARD" && !this.payments.enabled) throw new BadRequestException("Card payments aren’t available yet.");
    const program = dto.program?.trim()
      ? await this.prisma.program.findUnique({ where: { slug: dto.program.trim() }, select: { title: true } })
      : null;
    const pledge = await this.prisma.donationPledge.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        amountCents: Math.round(dto.amount * 100),
        frequency: dto.frequency,
        method: dto.method,
        cause: program?.title ?? null,
        message: dto.message?.trim() || null,
        anonymous: dto.anonymous ?? false,
      },
    });
    if (dto.method !== "CARD") return { ok: true };

    const recurring = dto.frequency !== "ONCE";
    const metadata = { pledgeId: pledge.id };
    const params: Stripe.Checkout.SessionCreateParams = {
      ui_mode: "embedded_page",
      mode: recurring ? "subscription" : "payment",
      locale: dto.locale === "fr" ? "fr-CA" : "en",
      customer_email: pledge.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: pledge.amountCents,
            product_data: { name: program ? `Donation to TOMCARE Foundation — ${program.title}` : "Donation to TOMCARE Foundation" },
            ...(recurring && { recurring: billing[dto.frequency as keyof typeof billing] }),
          },
        },
      ],
      metadata,
      ...(recurring ? { subscription_data: { metadata } } : { submit_type: "donate" as const, payment_intent_data: { metadata } }),
      redirect_on_completion: "if_required",
      return_url: `${this.payments.siteUrl}/donate?paid={CHECKOUT_SESSION_ID}#donation-form`,
    };
    const session = await this.payments.stripe.checkout.sessions.create(params).catch(async (error: Error) => {
      this.logger.error(`Stripe checkout failed for donation ${pledge.id}: ${error.message}`);
      await this.prisma.donationPledge.delete({ where: { id: pledge.id } });
      throw new ServiceUnavailableException("Card payment isn’t available right now. Please try again in a few minutes, or call us.");
    });
    await this.prisma.donationPledge.update({ where: { id: pledge.id }, data: { stripeSessionId: session.id } });
    return { ok: true, sessionId: session.id, clientSecret: session.client_secret, publishableKey: this.payments.publishableKey };
  }

  /** Called by the Donate page when checkout finishes; Stripe, not the browser, decides whether the gift is paid. */
  @Post("public/donations/confirm")
  @HttpCode(200)
  @Throttle({ default: { limit: 20, ttl: 10 * 60_000 } })
  async confirm(@Body() dto: ConfirmDonationDto) {
    if (!this.payments.enabled) throw new NotFoundException();
    const session = await this.payments.stripe.checkout.sessions.retrieve(dto.sessionId).catch(() => null);
    if (!session) throw new NotFoundException();
    const pledge = await this.recordPayment(session);
    return {
      paid: Boolean(pledge?.paidAt),
      amount: pledge ? pledge.amountCents / 100 : null,
      frequency: pledge?.frequency ?? null,
      firstName: pledge?.name.split(" ")[0] ?? null,
    };
  }

  @Post("public/donations/stripe-webhook")
  @HttpCode(200)
  @SkipThrottle()
  async webhook(@Req() request: RawBodyRequest<Request>, @Headers("stripe-signature") signature?: string) {
    if (!this.payments.enabled || !this.payments.webhookSecret) throw new NotFoundException();
    if (!request.rawBody || !signature) throw new BadRequestException("Missing signature");
    let event: Stripe.Event;
    try {
      event = this.payments.stripe.webhooks.constructEvent(request.rawBody, signature, this.payments.webhookSecret);
    } catch {
      throw new BadRequestException("Invalid signature");
    }
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await this.recordPayment(event.data.object);
    }
    return { received: true };
  }

  private async recordPayment(session: Stripe.Checkout.Session) {
    const pledge = await this.prisma.donationPledge.findFirst({ where: { stripeSessionId: session.id } });
    if (!pledge) return null;
    const paid = session.status === "complete" && (session.payment_status === "paid" || session.payment_status === "no_payment_required");
    if (!paid || pledge.paidAt) return pledge;
    const subscription = typeof session.subscription === "string" ? session.subscription : (session.subscription?.id ?? null);
    this.logger.log(`Donation ${pledge.id} paid by card (${session.id})`);
    return this.prisma.donationPledge.update({ where: { id: pledge.id }, data: { paidAt: new Date(), stripeSubscriptionId: subscription } });
  }

  @Get("donations")
  @Staff("EDITOR")
  async list(@Query() query: CaseQueryDto) {
    const q = query.q?.trim();
    const where: Prisma.DonationPledgeWhereInput = {
      status: query.status ?? { not: "ARCHIVED" },
      ...(q && {
        OR: ["name", "email", "cause", "message"].map((field) => ({
          [field]: { contains: q, mode: "insensitive" },
        })),
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.donationPledge.findMany({
        where,
        orderBy: sortArgs<Prisma.DonationPledgeOrderByWithRelationInput>(
          query,
          {
            name: (order) => ({ name: order }),
            amount: (order) => ({ amountCents: order }),
            status: (order) => ({ status: order }),
            createdAt: (order) => ({ createdAt: order }),
          },
          { createdAt: "desc" },
        ),
        ...pageArgs(query),
      }),
      this.prisma.donationPledge.count({ where }),
    ]);
    return paged(items, total, query);
  }

  @Get("donations/:id")
  @Staff("EDITOR")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.prisma.donationPledge.findUniqueOrThrow({ where: { id } });
  }

  @Patch("donations/:id")
  @Staff("EDITOR")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateCaseDto) {
    return this.prisma.donationPledge.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes?.trim() },
    });
  }

  @Delete("donations/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.donationPledge.delete({ where: { id } });
    return { ok: true };
  }
}
