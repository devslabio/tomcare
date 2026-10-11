import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CaseStatus, MessageStatus } from "@prisma/client";
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
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
