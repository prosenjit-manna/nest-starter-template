import { graphql } from 'gql';

export const UPDATE_WORKSPACE_MUTATION = graphql(`
  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {
  updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {
    id
  }
}
`);

