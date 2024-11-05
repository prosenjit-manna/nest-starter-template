import { Module } from "@nestjs/common";
import { SendInvitationService } from "./send-invitation/send-invitation.service";
import { MailerService } from "src/mailer/mailer.service";
import { AcceptInvitationService } from "./accept-invitation/accept-invitation.service";

@Module({
  providers: [
    MailerService,
    SendInvitationService,
    AcceptInvitationService,
  ]
})
export class MembershipModule {}
