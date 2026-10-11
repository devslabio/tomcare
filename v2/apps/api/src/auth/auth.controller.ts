import { Body, Controller, Get, HttpCode, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

import { ChangePasswordDto, LoginDto, UpdateProfileDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import type { StaffJwtPayload } from "./jwt-payload";
import { Staff } from "./roles.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Get("me")
  @Staff()
  me(@CurrentUser() user: StaffJwtPayload) {
    return this.auth.me(user.sub);
  }

  @Patch("me")
  @Staff()
  updateProfile(@CurrentUser() user: StaffJwtPayload, @Body() dto: UpdateProfileDto) {
    return this.auth.updateProfile(user.sub, dto.name);
  }

  @Post("change-password")
  @HttpCode(200)
  @Staff()
  changePassword(@CurrentUser() user: StaffJwtPayload, @Body() dto: ChangePasswordDto) {
    return this.auth.changePassword(user.sub, dto.currentPassword, dto.newPassword);
  }
}
