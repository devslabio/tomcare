import { Module } from "@nestjs/common";

import { EventsController } from "./events.controller";
import { PagesController } from "./pages.controller";
import { PostsController } from "./posts.controller";
import { ProgramsController } from "./programs.controller";
import {
  HeroSlidesController,
  PartnersController,
  ServicesController,
  TeamController,
  TestimonialsController,
  VolunteerRolesController,
} from "./sortable.controller";

@Module({
  controllers: [
    ProgramsController,
    EventsController,
    PostsController,
    PagesController,
    ServicesController,
    TeamController,
    TestimonialsController,
    PartnersController,
    HeroSlidesController,
    VolunteerRolesController,
  ],
})
export class ContentModule {}
