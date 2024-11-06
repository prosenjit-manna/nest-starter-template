import { graphql } from 'gql';

export const CREATE_WORKSPACE_MUTATION = graphql(`
  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {
  createWorkspace(createWorkspaceInput: $createWorkspaceInput) {
    id
  }
}

`);
