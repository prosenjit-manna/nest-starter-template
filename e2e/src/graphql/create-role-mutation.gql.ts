import { graphql } from 'gql';

export const CREATE_ROLE_MUTATION = graphql(`
  mutation CreateRole($roleCreateInput: RoleCreateInput!) {
    createRole(roleCreateInput: $roleCreateInput) {
      id
    }
  }
`);
