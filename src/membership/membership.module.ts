import { Module } from "@nestjs/common";
import { SendInvitationService } from "./send-invitation/send-invitation.service";

@Module({
  providers: [
    SendInvitationService
  ]
})
export class MembershipModule {}
