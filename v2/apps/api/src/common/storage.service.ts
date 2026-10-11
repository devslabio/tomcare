import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { BadRequestException, Injectable } from "@nestjs/common";

export type Visibility = "public" | "private";

type Rule = { maxBytes: number; types: Record<string, string> };

/** Allowed uploads by purpose. SVG is excluded: it can carry scripts and is served from our own origin. */
export const UPLOAD_RULES = {
  image: {
    maxBytes: 10 * 1024 * 1024,
    types: { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" },
  },
} satisfies Record<string, Rule>;

const SIGNATURES: Record<string, (b: Buffer) => boolean> = {
  ".jpg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  ".png": (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  ".webp": (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP",
};

@Injectable()
export class StorageService {
  readonly root = path.resolve(process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"));

  dir(visibility: Visibility) {
    return path.join(this.root, visibility);
  }

  /** Validates type, size and file signature, then writes under a random name. */
  async save(file: Express.Multer.File | undefined, rule: Rule, visibility: Visibility, label = "File") {
    if (!file) throw new BadRequestException(`${label} is required`);
    const ext = rule.types[file.mimetype as keyof typeof rule.types];
    if (!ext) throw new BadRequestException(`${label}: unsupported file type`);
    if (file.size > rule.maxBytes) {
      throw new BadRequestException(`${label} must be under ${Math.round(rule.maxBytes / 1024 / 1024)} MB`);
    }
    if (!SIGNATURES[ext]?.(file.buffer))
      throw new BadRequestException(`${label} appears to be corrupted or mislabelled`);

    const storedName = `${randomUUID()}${ext}`;
    await mkdir(this.dir(visibility), { recursive: true });
    await writeFile(path.join(this.dir(visibility), storedName), file.buffer);
    return { storedName, mimeType: file.mimetype, size: file.size, originalName: file.originalname.slice(0, 200) };
  }

  /** Resolves a stored name inside its folder, rejecting anything that could escape it. */
  resolve(visibility: Visibility, storedName: string) {
    if (!/^[0-9a-f-]{36}\.[a-z]{3,4}$/.test(storedName)) return null;
    return path.join(this.dir(visibility), storedName);
  }

  async remove(visibility: Visibility, storedName: string) {
    const file = this.resolve(visibility, storedName);
    if (file) await rm(file, { force: true });
  }
}
