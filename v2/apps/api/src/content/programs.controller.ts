import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Staff } from "../auth/roles.decorator";
import { uniqueSlug } from "../common/slug";
import { PrismaService } from "../prisma/prisma.service";
import { ProgramDto, ReorderDto } from "./content.dto";
import { nextSortOrder, reorder } from "./reorder";
import { TRANSLATIONS, withTranslation } from "./translation";

const data = (dto: ProgramDto) => ({
  title: dto.title.trim(),
  category: dto.category.trim(),
  summary: dto.summary.trim(),
  body: dto.body?.trim() ?? "",
  icon: dto.icon,
  image: dto.image || null,
  highlights: (dto.highlights ?? []).map((line) => line.trim()).filter(Boolean),
  featured: dto.featured,
  visible: dto.visible,
  ...withTranslation(dto.fr, TRANSLATIONS.program),
});

@ApiTags("programs")
@Controller()
export class ProgramsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("public/programs")
  listPublic() {
    return this.prisma.program.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } });
  }

  @Get("public/programs/:slug")
  async getPublic(@Param("slug") slug: string) {
    const program = await this.prisma.program.findFirst({ where: { slug, visible: true } });
    if (!program) throw new NotFoundException("Program not found");
    return program;
  }

  @Get("programs")
  @Staff("EDITOR")
  list() {
    return this.prisma.program.findMany({ orderBy: { sortOrder: "asc" } });
  }

  @Get("programs/:id")
  @Staff("EDITOR")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.prisma.program.findUniqueOrThrow({ where: { id } });
  }

  @Post("programs")
  @Staff("EDITOR")
  async create(@Body() dto: ProgramDto) {
    const slug = await uniqueSlug(dto.title, async (s) => !!(await this.prisma.program.findUnique({ where: { slug: s } })));
    return this.prisma.program.create({
      data: { ...data(dto), slug, sortOrder: await nextSortOrder(this.prisma, "program") },
    });
  }

  @Put("programs/order")
  @Staff("EDITOR")
  async order(@Body() dto: ReorderDto) {
    await reorder(this.prisma, "program", dto.ids);
    return { ok: true };
  }

  @Patch("programs/:id")
  @Staff("EDITOR")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: ProgramDto) {
    return this.prisma.program.update({ where: { id }, data: data(dto) });
  }

  @Delete("programs/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.program.delete({ where: { id } });
    return { ok: true };
  }
}
