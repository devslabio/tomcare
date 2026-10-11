import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

import { Staff } from "../auth/roles.decorator";
import { pageArgs, paged, PageQueryDto, sortArgs } from "../common/pagination";
import { uniqueSlug } from "../common/slug";
import { PrismaService } from "../prisma/prisma.service";
import { PostDto } from "./content.dto";

const published = (): Prisma.PostWhereInput => ({ status: "PUBLISHED", publishedAt: { lte: new Date() } });

@ApiTags("posts")
@Controller()
export class PostsController {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: PostDto, current?: { publishedAt: Date | null }) {
    return {
      title: dto.title.trim(),
      excerpt: dto.excerpt.trim(),
      body: dto.body?.trim() ?? "",
      coverImage: dto.coverImage || null,
      author: dto.author.trim(),
      category: dto.category.trim(),
      status: dto.status,
      // Publishing stamps the date once; staff can still set it explicitly (e.g. to schedule).
      publishedAt: dto.publishedAt ?? current?.publishedAt ?? (dto.status === "PUBLISHED" ? new Date() : null),
    };
  }

  @Get("public/posts")
  listPublic() {
    return this.prisma.post.findMany({
      where: published(),
      orderBy: { publishedAt: "desc" },
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, author: true, category: true, publishedAt: true },
    });
  }

  @Get("public/posts/:slug")
  async getPublic(@Param("slug") slug: string) {
    const post = await this.prisma.post.findFirst({ where: { slug, ...published() } });
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  @Get("posts")
  @Staff("EDITOR")
  async list(@Query() query: PageQueryDto) {
    const q = query.q?.trim();
    const where: Prisma.PostWhereInput = q
      ? { OR: ["title", "excerpt", "author", "category"].map((field) => ({ [field]: { contains: q, mode: "insensitive" } })) }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        orderBy: sortArgs<Prisma.PostOrderByWithRelationInput>(
          query,
          {
            title: (order) => ({ title: order }),
            category: (order) => ({ category: order }),
            status: (order) => ({ status: order }),
            publishedAt: (order) => ({ publishedAt: { sort: order, nulls: "first" } }),
          },
          [{ publishedAt: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }],
        ),
        omit: { body: true },
        ...pageArgs(query),
      }),
      this.prisma.post.count({ where }),
    ]);
    return paged(items, total, query);
  }

  @Get("posts/:id")
  @Staff("EDITOR")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.prisma.post.findUniqueOrThrow({ where: { id } });
  }

  @Post("posts")
  @Staff("EDITOR")
  async create(@Body() dto: PostDto) {
    const slug = await uniqueSlug(dto.title, async (s) => !!(await this.prisma.post.findUnique({ where: { slug: s } })));
    return this.prisma.post.create({ data: { ...this.data(dto), slug } });
  }

  @Patch("posts/:id")
  @Staff("EDITOR")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: PostDto) {
    const current = await this.prisma.post.findUniqueOrThrow({ where: { id }, select: { publishedAt: true } });
    return this.prisma.post.update({ where: { id }, data: this.data(dto, current) });
  }

  @Delete("posts/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.post.delete({ where: { id } });
    return { ok: true };
  }
}
