import { Module } from "@nestjs/common";

import { AssistanceController } from "./assistance.controller";
import { DonationsController } from "./donations.controller";
import { MessagesController } from "./messages.controller";
import { SubscribersController } from "./subscribers.controller";
import { VolunteersController } from "./volunteers.controller";

@Module({ controllers: [MessagesController, VolunteersController, AssistanceController, DonationsController, SubscribersController] })
export class FormsModule {}
