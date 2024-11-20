import { graphql } from 'gql';

export const SEND_INVITATION_MUTATION = graphql(`
  mutation SendInvitation($sendInvitationInput: SendInvitationInput!) {
    sendInvitation(sendInvitationInput: $sendInvitationInput) {
      success
    }
  }
`);
