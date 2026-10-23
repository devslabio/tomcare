import path from "node:path";
import { config } from "dotenv";

config({ path: path.join(__dirname, "..", ".env") });

import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  // rawBody: Stripe signs the exact bytes it sends, so the webhook needs them unparsed.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  // Requests arrive via nginx and then the web app's /v1 rewrite. Trusting exactly those hops keeps
  // per-client rate limits working without letting callers spoof their IP through X-Forwarded-For.
  app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS ?? 2));
  app.enableCors({ origin: true });
  app.setGlobalPrefix("v1");

  const swaggerConfig = new DocumentBuilder()
    .setTitle("TOMCARE Foundation API")
    .setDescription("Website CMS — public content, forms inbox, and staff administration.")
    .setVersion("0.1.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "access-token")
    .build();
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, swaggerConfig));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT ?? 3072);
  await app.listen(port);
  console.info(`TOMCARE API listening on http://127.0.0.1:${port}/v1`);
  console.info(`OpenAPI docs: http://127.0.0.1:${port}/docs`);
}

bootstrap();
