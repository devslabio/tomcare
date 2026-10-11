import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import type { StaffRole } from "@prisma/client";

import { JwtAuthGuard } from "./jwt-auth.guard";
import { ROLES_KEY } from "./roles.constants";
import { RolesGuard } from "./roles.guard";

/** Signed-in staff only; pass roles to restrict further. ADMIN always passes. */
export const Staff = (...roles: StaffRole[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(JwtAuthGuard, RolesGuard), ApiBearerAuth("access-token"));
