import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Staff } from "../auth/roles.decorator";
import { slugify, uniqueSlug } from "../common/slug";
import { PrismaService } from "../prisma/prisma.service";
import { cleanBlocks } from "./blocks";
import { PageDto, ReorderDto } from "./content.dto";
import { nextSortOrder, reorder } from "./reorder";

/** Addresses the website already uses; a custom page can't take them over. */
const RESERVED = new Set([
  "about",
  "programs",
  "services",
  "events",
  "news",
  "team",
  "volunteer",
  "donate",
  "get-help",
  "contact",
  "admin",
  "v1",
  "docs",
  "api",
  "sitemap.xml",
  "robots.txt",
]);

const data = (dto: PageDto) => ({
  title: dto.title.trim(),
  description: dto.description?.trim() ?? "",
  heroImage: dto.heroImage || null,
  blocks: cleanBlocks(dto.blocks),
  status: dto.status,
  showInNav: dto.showInNav,
  navLabel: dto.navLabel?.trim() || null,
});

@ApiTags("pages")
@Controller()
export class PagesController {
  constructor(private readonly prisma: PrismaService) {}

  private async checkSlug(slug: string, id?: string) {
    if (RESERVED.has(slug)) throw new BadRequestException(`“/${slug}” is already used by the website`);
    const existing = await this.prisma.page.findUnique({ where: { slug }, select: { id: true } });
    if (existing && existing.id !== id) throw new ConflictException(`Another page already uses “/${slug}”`);
  }

  @Get("public/pages")
  listPublic() {
    return this.prisma.page.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true, navLabel: true, showInNav: true, updatedAt: true },
    });
  }

  @Get("public/pages/:slug")
  async getPublic(@Param("slug") slug: string) {
    const page = await this.prisma.page.findFirst({ where: { slug, status: "PUBLISHED" } });
    if (!page) throw new NotFoundException("Page not found");
    return page;
  }

  @Get("pages")
  @Staff("EDITOR")
  list() {
    return this.prisma.page.findMany({ orderBy: { sortOrder: "asc" }, omit: { blocks: true } });
  }

  @Get("pages/:id")
  @Staff("EDITOR")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.prisma.page.findUniqueOrThrow({ where: { id } });
  }

  @Post("pages")
  @Staff("EDITOR")
  async create(@Body() dto: PageDto) {
    let slug: string;
    if (dto.slug) {
      slug = dto.slug;
      await this.checkSlug(slug);
    } else {
      slug = await uniqueSlug(
        dto.title,
        async (s) => RESERVED.has(s) || !!(await this.prisma.page.findUnique({ where: { slug: s } })),
      );
    }
    return this.prisma.page.create({
      data: { ...data(dto), slug, sortOrder: await nextSortOrder(this.prisma, "page") },
    });
  }

  @Put("pages/order")
  @Staff("EDITOR")
  async order(@Body() dto: ReorderDto) {
    await reorder(this.prisma, "page", dto.ids);
    return { ok: true };
  }

  @Patch("pages/:id")
  @Staff("EDITOR")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: PageDto) {
    const slug = dto.slug ? slugify(dto.slug) : undefined;
    if (slug) await this.checkSlug(slug, id);
    return this.prisma.page.update({ where: { id }, data: { ...data(dto), ...(slug && { slug }) } });
  }

  @Delete("pages/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.page.delete({ where: { id } });
    return { ok: true };
  }
}
