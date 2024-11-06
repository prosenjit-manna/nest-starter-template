import { Module } from '@nestjs/common';
import { SendInvitationService } from './send-invitation/send-invitation.service';
import { MailerService } from 'src/mailer/mailer.service';
import { AcceptInvitationService } from './accept-invitation/accept-invitation.service';
import { ListMembershipService } from './list-membership/list-membership.service';

@Module({
  providers: [
    MailerService,
    SendInvitationService,
    AcceptInvitationService,
    ListMembershipService,
  ],
})
export class MembershipModule {}
