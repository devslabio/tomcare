import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

/** Card payments through Stripe Checkout. Disabled (and the Donate form falls back to pledges) until the keys are set. */
@Injectable()
export class StripeService {
  private readonly secretKey = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  readonly publishableKey = process.env.STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
  readonly webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
  readonly siteUrl = (process.env.SITE_URL ?? "http://localhost:3073").replace(/\/$/, "");
  private client: Stripe | null = null;

  get enabled() {
    return Boolean(this.secretKey && this.publishableKey);
  }

  get stripe(): Stripe {
    if (!this.enabled) throw new Error("Stripe is not configured");
    this.client ??= new Stripe(this.secretKey);
    return this.client;
  }
}
