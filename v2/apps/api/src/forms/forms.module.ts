import { Module } from "@nestjs/common";

import { AssistanceController } from "./assistance.controller";
import { DonationsController } from "./donations.controller";
import { ItemDonationsController } from "./item-donations.controller";
import { MessagesController } from "./messages.controller";
import { SubscribersController } from "./subscribers.controller";
import { StripeService } from "./stripe.service";
import { VolunteersController } from "./volunteers.controller";

@Module({
  providers: [StripeService],
  controllers: [
    MessagesController,
    VolunteersController,
    AssistanceController,
    DonationsController,
    ItemDonationsController,
    SubscribersController,
  ],
})
export class FormsModule {}
