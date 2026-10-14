import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Type,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { Staff } from "../auth/roles.decorator";
import { PrismaService } from "../prisma/prisma.service";
import {
  PartnerDto,
  ReorderDto,
  ServiceDto,
  TeamMemberDto,
  TestimonialDto,
  VolunteerRoleDto,
} from "./content.dto";
import { nextSortOrder, reorder, type Sortable } from "./reorder";
import { TRANSLATIONS, withTranslation } from "./translation";

type Delegate = {
  findMany: (args: object) => Promise<unknown[]>;
  create: (args: object) => Promise<unknown>;
  update: (args: object) => Promise<unknown>;
  delete: (args: object) => Promise<unknown>;
};

/**
 * Plain ordered lists (services, team, testimonials...) share one shape: public list of visible rows,
 * staff CRUD, and drag-and-drop ordering. Each call produces a controller for one model.
 */
function sortableController<D extends object>(options: {
  model: Sortable;
  path: string;
  dto: Type<D>;
  data: (dto: D) => object;
}) {
  const body = new ValidationPipe({ expectedType: options.dto, whitelist: true, transform: true, forbidNonWhitelisted: true });

  @ApiTags(options.path)
  @Controller()
  class SortableController {
    constructor(readonly prisma: PrismaService) {}

    get delegate() {
      return this.prisma[options.model] as unknown as Delegate;
    }

    @Get(`public/${options.path}`)
    listPublic() {
      return this.delegate.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } });
    }

    @Get(options.path)
    @Staff("EDITOR")
    list() {
      return this.delegate.findMany({ orderBy: { sortOrder: "asc" } });
    }

    @Post(options.path)
    @Staff("EDITOR")
    @ApiBody({ type: options.dto })
    async create(@Body(body) dto: D) {
      return this.delegate.create({
        data: { ...options.data(dto), sortOrder: await nextSortOrder(this.prisma, options.model) },
      });
    }

    @Put(`${options.path}/order`)
    @Staff("EDITOR")
    async order(@Body() dto: ReorderDto) {
      await reorder(this.prisma, options.model, dto.ids);
      return { ok: true };
    }

    @Patch(`${options.path}/:id`)
    @Staff("EDITOR")
    @ApiBody({ type: options.dto })
    update(@Param("id", ParseUUIDPipe) id: string, @Body(body) dto: D) {
      return this.delegate.update({ where: { id }, data: options.data(dto) });
    }

    @Delete(`${options.path}/:id`)
    @Staff("EDITOR")
    async remove(@Param("id", ParseUUIDPipe) id: string) {
      await this.delegate.delete({ where: { id } });
      return { ok: true };
    }
  }

  return SortableController;
}

const optional = (value?: string) => value?.trim() || null;

export const ServicesController = sortableController({
  model: "service",
  path: "services",
  dto: ServiceDto,
  data: (dto) => ({ title: dto.title.trim(), description: dto.description.trim(), icon: dto.icon, visible: dto.visible, ...withTranslation(dto.fr, TRANSLATIONS.service) }),
});

export const TeamController = sortableController({
  model: "teamMember",
  path: "team",
  dto: TeamMemberDto,
  data: (dto) => ({
    name: dto.name.trim(),
    role: dto.role.trim(),
    bio: dto.bio?.trim() ?? "",
    photo: optional(dto.photo),
    group: dto.group,
    visible: dto.visible,
    ...withTranslation(dto.fr, TRANSLATIONS.teamMember),
  }),
});

export const TestimonialsController = sortableController({
  model: "testimonial",
  path: "testimonials",
  dto: TestimonialDto,
  data: (dto) => ({
    quote: dto.quote.trim(),
    name: dto.name.trim(),
    role: dto.role.trim(),
    photo: optional(dto.photo),
    visible: dto.visible,
    ...withTranslation(dto.fr, TRANSLATIONS.testimonial),
  }),
});

export const PartnersController = sortableController({
  model: "partner",
  path: "partners",
  dto: PartnerDto,
  data: (dto) => ({
    name: dto.name.trim(),
    logoUrl: optional(dto.logoUrl),
    website: optional(dto.website),
    description: optional(dto.description),
    visible: dto.visible,
    ...withTranslation(dto.fr, TRANSLATIONS.partner),
  }),
});

export const VolunteerRolesController = sortableController({
  model: "volunteerRole",
  path: "volunteer-roles",
  dto: VolunteerRoleDto,
  data: (dto) => ({
    title: dto.title.trim(),
    description: dto.description.trim(),
    commitment: dto.commitment.trim(),
    location: dto.location.trim(),
    skills: (dto.skills ?? []).map((skill) => skill.trim()).filter(Boolean),
    visible: dto.visible,
    ...withTranslation(dto.fr, TRANSLATIONS.volunteerRole),
  }),
});
