import { graphql } from 'gql';

export const UNASSIGN_ROLE_MUTATION = graphql(`
  mutation UnAssignRole($unAssignRoleInput: UnAssignRoleInput!) {
    unAssignRole(unAssignRoleInput: $unAssignRoleInput) {
      success
    }
  }
`);
