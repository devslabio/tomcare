import { Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import type { Response } from "express";
import { existsSync } from "node:fs";

import { Staff } from "../auth/roles.decorator";
import { StorageService, UPLOAD_RULES } from "../common/storage.service";

@ApiTags("files")
@Controller()
export class FilesController {
  constructor(private readonly storage: StorageService) {}

  @Post("uploads/image")
  @Staff("EDITOR")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: { type: "object", properties: { file: { type: "string", format: "binary" } } } })
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: UPLOAD_RULES.image.maxBytes } }))
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    const saved = await this.storage.save(file, UPLOAD_RULES.image, "public", "Image");
    return { url: `/v1/files/${saved.storedName}` };
  }

  @Get("files/:name")
  @SkipThrottle()
  serve(@Param("name") name: string, @Res() res: Response) {
    const file = this.storage.resolve("public", name);
    if (!file || !existsSync(file)) throw new NotFoundException();
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.sendFile(file);
  }
}
