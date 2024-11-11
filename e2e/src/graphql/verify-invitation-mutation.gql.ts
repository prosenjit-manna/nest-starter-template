import { graphql } from 'gql';

export const VERIFY_INVITATION_MUTATION = graphql(`
 mutation AcceptInvitation($acceptInvitationInput: AcceptInvitationInput!) {
  acceptInvitation(acceptInvitationInput: $acceptInvitationInput)
}
`);
