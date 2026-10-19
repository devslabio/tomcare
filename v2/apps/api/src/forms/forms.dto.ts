import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CaseStatus, DonationFrequency, DonationMethod, ItemCategory, ItemHandoff, MessageStatus } from "@prisma/client";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { PageQueryDto } from "../common/pagination";

/** Fields every public form shares, including the honeypot real visitors never see. */
class ContactFields {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(200)
  email!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ description: "Honeypot — must stay empty" })
  @IsOptional()
  @IsString()
  website?: string;
}

export class CreateMessageDto extends ContactFields {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  subject?: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  message!: string;
}

export class CreateVolunteerDto extends ContactFields {
  @ApiPropertyOptional({ description: "Volunteer role they're interested in" })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  availability?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  experience?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  message?: string;
}

export class CreateAssistanceDto extends ContactFields {
  @ApiPropertyOptional({ description: "Preferred language" })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @ApiPropertyOptional({ type: [String], description: "Kinds of help needed" })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(120, { each: true })
  needs?: string[];

  @ApiProperty({ description: "Their situation, in their own words" })
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  story!: string;
}

export class CreateDonationDto extends ContactFields {
  @ApiProperty({ description: "Canadian dollars, up to two decimals", example: 50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(1_000_000)
  amount!: number;

  @ApiProperty({ enum: DonationFrequency })
  @IsEnum(DonationFrequency)
  frequency!: DonationFrequency;

  @ApiProperty({ enum: DonationMethod })
  @IsEnum(DonationMethod)
  method!: DonationMethod;

  @ApiPropertyOptional({ description: "Slug of the program the gift is for; empty means where it's needed most" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  program?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @ApiPropertyOptional({ description: "Don't name the donor publicly" })
  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;
}

export class CreateItemDonationDto extends ContactFields {
  @ApiProperty({ enum: ItemCategory, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsEnum(ItemCategory, { each: true })
  categories!: ItemCategory[];

  @ApiProperty({ description: "What they're giving, quantity and condition" })
  @IsString()
  @MinLength(5)
  @MaxLength(3000)
  description!: string;

  @ApiProperty({ enum: ItemHandoff })
  @IsEnum(ItemHandoff)
  handoff!: ItemHandoff;

  @ApiPropertyOptional({ description: "Required for pick-ups" })
  @ValidateIf((dto: CreateItemDonationDto) => dto.handoff === ItemHandoff.PICK_UP)
  @IsString()
  @MinLength(5)
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  postalCode?: string;

  @ApiPropertyOptional({ description: "Make and model, required when a vehicle is offered" })
  @ValidateIf((dto: CreateItemDonationDto) => dto.categories?.includes(ItemCategory.VEHICLE))
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  vehicle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  vehicleYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  vehicleRuns?: boolean;

  @ApiPropertyOptional({ description: "Has the vehicle registration / ownership papers" })
  @IsOptional()
  @IsBoolean()
  hasOwnership?: boolean;
}

export class SubscribeDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(200)
  email!: string;

  @ApiPropertyOptional({ description: "Honeypot — must stay empty" })
  @IsOptional()
  @IsString()
  website?: string;
}

export class MessageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({ enum: MessageStatus })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;
}

export class UpdateMessageDto {
  @ApiProperty({ enum: MessageStatus })
  @IsEnum(MessageStatus)
  status!: MessageStatus;
}

export class CaseQueryDto extends PageQueryDto {
  @ApiPropertyOptional({ enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;
}

export class UpdateCaseDto {
  @ApiPropertyOptional({ enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @ApiPropertyOptional({ description: "Internal notes, never shown to the applicant" })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string;
}
