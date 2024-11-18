import { graphql } from 'gql';

export const LIST_WORKSPACE_QUERY = graphql(`
  query ListWorkSpace($listWorkspaceInput: ListWorkSpaceInput) {
    listWorkSpace(listWorkspaceInput: $listWorkspaceInput) {
      workspace {
        name
        id
      }
      pagination {
        totalPage
        currentPage
        perPage
      }
    }
  }
`);
