import { graphql } from 'gql';

export const DELETE_WORKSPACE_MUTATION = graphql(`
 mutation DeleteWorkSpace($deleteWorkspaceInput: WorkspaceDeleteInput) {
  deleteWorkSpace(deleteWorkspaceInput: $deleteWorkspaceInput)
}
`);
