import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";

@ApiTags("health")
@SkipThrottle()
@Controller("health")
export class HealthController {
  @Get()
  check() {
    return { ok: true, service: "tomcare-api" };
  }
}
