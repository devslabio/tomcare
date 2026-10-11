import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { PrismaExceptionFilter } from "./common/prisma-exception.filter";
import { ContentModule } from "./content/content.module";
import { DashboardController } from "./dashboard/dashboard.controller";
import { FilesModule } from "./files/files.module";
import { FormsModule } from "./forms/forms.module";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { SettingsModule } from "./settings/settings.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    PrismaModule,
    CommonModule,
    AuthModule,
    UsersModule,
    FormsModule,
    ContentModule,
    SettingsModule,
    FilesModule,
  ],
  controllers: [HealthController, DashboardController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}
