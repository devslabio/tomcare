import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from "class-validator";

export class PageQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;

  @ApiPropertyOptional({ description: "Free-text search" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ description: "Column to sort by; each list accepts its own set" })
  @IsOptional()
  @Matches(/^[A-Za-z]{1,40}$/)
  sort?: string;

  @ApiPropertyOptional({ enum: ["asc", "desc"] })
  @IsOptional()
  @IsIn(["asc", "desc"])
  order?: "asc" | "desc";
}

export function pageArgs({ page, pageSize }: PageQueryDto) {
  return { skip: (page - 1) * pageSize, take: pageSize };
}

export function paged<T>(items: T[], total: number, { page, pageSize }: PageQueryDto) {
  return { items, total, page, pageSize };
}

type SortOrder = "asc" | "desc";

/** Prisma orderBy for the requested column, or `fallback` when none (or an unknown one) is asked for. */
export function sortArgs<T>(
  { sort, order }: PageQueryDto,
  columns: Record<string, (order: SortOrder) => T | T[]>,
  fallback: T | T[],
): T[] {
  const column = sort ? columns[sort] : undefined;
  const result = column ? column(order ?? "asc") : fallback;
  return Array.isArray(result) ? result : [result];
}
