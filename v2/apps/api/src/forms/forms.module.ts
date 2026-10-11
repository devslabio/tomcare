import { Module } from "@nestjs/common";

import { AssistanceController } from "./assistance.controller";
import { MessagesController } from "./messages.controller";
import { SubscribersController } from "./subscribers.controller";
import { VolunteersController } from "./volunteers.controller";

@Module({ controllers: [MessagesController, VolunteersController, AssistanceController, SubscribersController] })
export class FormsModule {}
