import { graphql } from 'gql';

export const UPDATE_ROLE_MUTATION = graphql(`
  mutation UpdateRole($roleUpdateInput: RoleUpdateInput!) {
    updateRole(roleUpdateInput: $roleUpdateInput) {
      id
    }
  }
`);
