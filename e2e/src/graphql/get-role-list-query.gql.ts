import { graphql } from 'gql';

export const GET_ROLE_LIST_QUERY = graphql(`
  query RoleList {
    roleList {
      role {
        title
        name
        id
        deletedAt
      }
      pagination {
        totalPage
        currentPage
        perPage
      }
    }
  }
`);
