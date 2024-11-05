import { graphql } from 'gql';

export const DELETE_ROLE_MUTATION = graphql(`
  mutation DeleteRole($roleDeleteInput: RoleDeleteInput) {
    deleteRole(roleDeleteInput: $roleDeleteInput)
  }
`);
