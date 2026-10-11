import { BadRequestException, Body, Controller, Get, OnModuleInit, Put } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { Staff } from "../auth/roles.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { DEFAULT_SETTINGS, SETTING_KEYS, type SiteSettings } from "./settings.defaults";

@ApiTags("settings")
@Controller()
export class SettingsController implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    for (const key of SETTING_KEYS) {
      await this.prisma.setting.upsert({ where: { key }, create: { key, value: DEFAULT_SETTINGS[key] }, update: {} });
    }
  }

  private async load(): Promise<SiteSettings> {
    const rows = await this.prisma.setting.findMany({ where: { key: { in: [...SETTING_KEYS] } } });
    const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    return Object.fromEntries(
      SETTING_KEYS.map((key) => [key, { ...DEFAULT_SETTINGS[key], ...(stored[key] as object | undefined) }]),
    ) as SiteSettings;
  }

  @Get("public/settings")
  getPublic() {
    return this.load();
  }

  @Get("settings")
  @Staff()
  get() {
    return this.load();
  }

  @Put("settings")
  @Staff("ADMIN")
  @ApiBody({ description: "Any subset of sections (contact, links, hero, about, stats, donate) with string fields" })
  async update(@Body() body: Record<string, unknown>) {
    const current = await this.load();
    for (const key of SETTING_KEYS) {
      const incoming = body?.[key];
      if (incoming === undefined) continue;
      if (typeof incoming !== "object" || incoming === null) throw new BadRequestException(`${key} must be an object`);
      const next = { ...current[key] } as Record<string, string>;
      for (const field of Object.keys(DEFAULT_SETTINGS[key])) {
        const value = (incoming as Record<string, unknown>)[field];
        if (value === undefined) continue;
        if (typeof value !== "string" || value.length > 2000) {
          throw new BadRequestException(`${key}.${field} must be text under 2000 characters`);
        }
        next[field] = value.trim();
      }
      await this.prisma.setting.update({ where: { key }, data: { value: next } });
    }
    return this.load();
  }
}
