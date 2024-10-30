import { graphql } from 'gql';

export const PRIVILEGE_LIST = graphql(`
  query Role {
    listBasePrivilege {
      privilege {
        name
        group
        id
        type
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`);
