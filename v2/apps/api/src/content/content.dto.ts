import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PublishStatus, TeamGroup } from "@prisma/client";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";

/** Site-relative paths (/images/..., /v1/files/...) or absolute http(s) URLs. */
export const URL_LIKE = /^(\/[\w\-./]+|https?:\/\/\S+)$/;
const WEBSITE = /^https?:\/\/\S+$/;
/** A link on the site (/volunteer, /programs#donate) or an absolute URL. */
export const HREF = /^(\/[\w\-./#?=&]*|https?:\/\/\S+|mailto:\S+|tel:[\d+\s()-]+)$/;

export const ICONS = [
  "heart-handshake",
  "hand-heart",
  "users",
  "laptop",
  "monitor",
  "graduation-cap",
  "book-open",
  "package",
  "scale",
  "house",
  "briefcase",
  "smile",
  "accessibility",
  "baby",
  "brain",
  "globe",
  "languages",
  "car",
  "camera",
  "printer",
  "file-text",
  "keyboard",
  "credit-card",
  "map",
  "stethoscope",
  "utensils",
  "shirt",
  "bus",
  "sparkles",
  "sun",
] as const;

export class ReorderDto {
  @ApiProperty({ type: [String], description: "IDs in their new order" })
  @IsArray()
  @ArrayMaxSize(1000)
  @IsUUID("all", { each: true })
  ids!: string[];
}

export class ProgramDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  category!: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(400)
  summary!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  body?: string;

  @ApiProperty({ enum: ICONS })
  @IsIn(ICONS)
  icon!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(URL_LIKE, { message: "image must be an uploaded image or a full URL" })
  image?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MaxLength(120, { each: true })
  highlights?: string[];

  @ApiProperty()
  @IsBoolean()
  featured!: boolean;

  @ApiProperty()
  @IsBoolean()
  visible!: boolean;
}

export class ServiceDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  description!: string;

  @ApiProperty({ enum: ICONS })
  @IsIn(ICONS)
  icon!: string;

  @ApiProperty()
  @IsBoolean()
  visible!: boolean;
}

export class EventDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(400)
  summary!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(URL_LIKE, { message: "image must be an uploaded image or a full URL" })
  image?: string;

  @ApiProperty({ type: String, format: "date-time" })
  @Type(() => Date)
  @IsDate()
  startsAt!: Date;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endsAt?: Date;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  location!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(WEBSITE, { message: "registerUrl must start with http:// or https://" })
  registerUrl?: string;

  @ApiProperty()
  @IsBoolean()
  visible!: boolean;
}

export class PostDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(400)
  excerpt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50000)
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(URL_LIKE, { message: "coverImage must be an uploaded image or a full URL" })
  coverImage?: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  author!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  category!: string;

  @ApiProperty({ enum: PublishStatus })
  @IsEnum(PublishStatus)
  status!: PublishStatus;

  @ApiPropertyOptional({ type: String, format: "date-time", description: "Defaults to now when first published" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedAt?: Date;
}

export class PageDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @ApiPropertyOptional({ description: "Web address; created from the title when empty" })
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "slug may contain lowercase letters, numbers and hyphens" })
  @MaxLength(80)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(URL_LIKE, { message: "heroImage must be an uploaded image or a full URL" })
  heroImage?: string;

  @ApiProperty({ type: [Object], description: "Content blocks; see the page builder" })
  @IsArray()
  @ArrayMaxSize(60)
  @IsObject({ each: true })
  blocks!: Record<string, unknown>[];

  @ApiProperty({ enum: PublishStatus })
  @IsEnum(PublishStatus)
  status!: PublishStatus;

  @ApiProperty()
  @IsBoolean()
  showInNav!: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  navLabel?: string;
}

export class TeamMemberDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  role!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1500)
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(URL_LIKE, { message: "photo must be an uploaded image or a full URL" })
  photo?: string;

  @ApiProperty({ enum: TeamGroup })
  @IsEnum(TeamGroup)
  group!: TeamGroup;

  @ApiProperty()
  @IsBoolean()
  visible!: boolean;
}

export class TestimonialDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  quote!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  role!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(URL_LIKE, { message: "photo must be an uploaded image or a full URL" })
  photo?: string;

  @ApiProperty()
  @IsBoolean()
  visible!: boolean;
}

export class PartnerDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(URL_LIKE, { message: "logoUrl must be an uploaded image or a full URL" })
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(WEBSITE, { message: "website must start with http:// or https://" })
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @ApiProperty()
  @IsBoolean()
  visible!: boolean;
}

export class HeroSlideDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  eyebrow?: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(400)
  subtitle?: string;

  @ApiProperty()
  @Matches(URL_LIKE, { message: "image must be an uploaded image or a full URL" })
  image!: string;

  @ApiPropertyOptional({ description: "Describes the photo for people using screen readers" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  imageAlt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  ctaLabel?: string;

  @ApiPropertyOptional({ description: "Required with a button label: a page on the site (/donate) or a full URL" })
  @ValidateIf((dto: HeroSlideDto) => Boolean(dto.ctaLabel?.trim()))
  @Matches(HREF, { message: "button link must be a page on the site (e.g. /donate) or a full URL" })
  ctaHref?: string;

  @ApiProperty()
  @IsBoolean()
  visible!: boolean;
}

export class VolunteerRoleDto {
  @ApiPropertyOptional({ type: Object, description: "French version of the text fields; empty fields fall back to English" })
  @IsOptional()
  @IsObject()
  fr?: Record<string, unknown>;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  description!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  commitment!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  location!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  skills?: string[];

  @ApiProperty()
  @IsBoolean()
  visible!: boolean;
}