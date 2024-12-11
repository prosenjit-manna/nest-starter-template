import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AcceptInvitationInput } from './accept-invitation-input.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';

@Resolver()
export class AcceptInvitationService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => Boolean)
  async acceptInvitation(
    @Args('acceptInvitationInput') acceptInvitationInput: AcceptInvitationInput,
  ) {
    const memberShip = await this.prisma.workspaceMembership.findFirst({
      where: {
        invitationToken: acceptInvitationInput.token,
      },
    });
    if (acceptInvitationInput.token === memberShip?.invitationToken && acceptInvitationInput?.accept) {
      await this.prisma.workspaceMembership.update({
        where: {
          id: memberShip.id,
        },
        data: {
          invitationToken: null,
          isAccepted: true,
        },
      });

      return true;
    } else if (acceptInvitationInput.token === memberShip?.invitationToken && !acceptInvitationInput?.accept) {
      await this.prisma.workspaceMembership.delete({
        where: {
          id: memberShip.id,
        },
      });

      return true;
    } else {
      throw new CreateAppError({ message: 'Invalid invitation token!' });
    }
  }
}
