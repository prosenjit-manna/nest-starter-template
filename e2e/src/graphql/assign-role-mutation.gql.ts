import { graphql } from 'gql';

export const ASSIGN_ROLE_MUTATION = graphql(`
  mutation AssignRole($assignRoleInput: AssignRoleInput!) {
    assignRole(assignRoleInput: $assignRoleInput) {
      success
    }
  }
`);
