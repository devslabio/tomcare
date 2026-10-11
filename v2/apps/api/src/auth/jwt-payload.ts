import type { StaffRole } from "@prisma/client";

export type StaffJwtPayload = {
  sub: string;
  email: string;
  role: StaffRole;
};

export type AuthedRequest = {
  headers: { authorization?: string };
  user?: StaffJwtPayload;
};
