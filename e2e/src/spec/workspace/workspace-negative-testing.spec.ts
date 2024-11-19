import { PrismaClient, User, UserType } from '@prisma/client';
import { appEnv } from '../../lib/app-env';
import { faker } from '@faker-js/faker';
import { GraphQlApi } from '../../lib/graphql-api';
import { CREATE_WORKSPACE_MUTATION } from '../../graphql/create-workspace-mutation.gql';
import {
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables,
  DeleteWorkSpaceMutation,
  DeleteWorkSpaceMutationVariables,
  ListWorkSpaceQuery,
  ListWorkSpaceQueryVariables,
  UpdateWorkspaceMutation,
  UpdateWorkspaceMutationVariables,
} from '../../gql/graphql';
import { UPDATE_WORKSPACE_MUTATION } from '../../graphql/update-workspace-mutation.gql';
import { LIST_WORKSPACE_QUERY } from '../../graphql/list-workspace-query.gql';
import { DELETE_WORKSPACE_MUTATION } from '../../graphql/delete-workspace-mutation.gql';
import { sample } from 'lodash';

describe('Workspace Module Negative testing - NST-36', () => {
  const dbClient = new PrismaClient();
  let user: User | null;
  const api = new GraphQlApi();
  let workspaceId: string | undefined;
  const workspaceName = faker.lorem.word();
  const workspaceNameUpdated = faker.lorem.word();

  afterAll(async () => {
    await dbClient.$disconnect();
  });

  [UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
    test(`Login as a ${type}`, async () => {
      user = await dbClient.user.findFirst({
        where: {
          userType: type,
          isVerified: true,
        },
      });

      if (!user) {
        return;
      }

      const response = await api.login({
        email: user.email,
        password: appEnv.SEED_PASSWORD,
      });

      expect(response.data).toBeDefined();
    });

    test('Create New Workspace with blank name', async () => {
      const createWorkspace = await api.graphql.mutate<
        CreateWorkspaceMutation,
        CreateWorkspaceMutationVariables
      >({
        mutation: CREATE_WORKSPACE_MUTATION,
        variables: {
          createWorkspaceInput: {
            name: '',
          },
        },
      });
      if (!createWorkspace.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      const errorMessage = createWorkspace.errors[0]?.message;
      expect(errorMessage).toContain('Name is required');
    });

    test('List of Workspace and created workspace assertion', async () => {
      const listWorkspace = await api.graphql.query<
        ListWorkSpaceQuery,
        ListWorkSpaceQueryVariables
      >({
        query: LIST_WORKSPACE_QUERY,
      });
      workspaceId = sample(listWorkspace.data.listWorkSpace.workspace)?.id;
    });

    test('Update Workspace with wrong id', async () => {
      const updateWorkspace = await api.graphql.mutate<
        UpdateWorkspaceMutation,
        UpdateWorkspaceMutationVariables
      >({
        mutation: UPDATE_WORKSPACE_MUTATION,
        variables: {
          updateWorkspaceInput: {
            id: crypto.randomUUID(),
            name: workspaceNameUpdated,
          },
        },
      });
      if (!updateWorkspace.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      expect(updateWorkspace.errors[0].message).toContain(
        'You are not a member of this workspace',
      );
    });

    test('Update Workspace with blank name', async () => {
      if (!workspaceId) {
        throw new Error('name should not be empty');
      }
      const updateWorkspace = await api.graphql.mutate<
        UpdateWorkspaceMutation,
        UpdateWorkspaceMutationVariables
      >({
        mutation: UPDATE_WORKSPACE_MUTATION,
        variables: {
          updateWorkspaceInput: {
            id: workspaceId,
            name: '',
          },
        },
      });

      if (!updateWorkspace.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      expect(updateWorkspace.errors[0].message).toContain(
        'name should not be empty',
      );
    });

    test('Delete Workspace which is created not from stash with wrong id', async () => {
      const deleteWorkspace = await api.graphql.mutate<
        DeleteWorkSpaceMutation,
        DeleteWorkSpaceMutationVariables
      >({
        mutation: DELETE_WORKSPACE_MUTATION,
        variables: {
          deleteWorkspaceInput: {
            id: crypto.randomUUID(),
            fromStash: false,
          },
        },
      });
      if (!deleteWorkspace.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      expect(deleteWorkspace.errors[0].message).toContain(
        'You are not a member of this workspace',
      );
    });

    test('Create New Workspace ', async () => {
      const createWorkspace = await api.graphql.mutate<
        CreateWorkspaceMutation,
        CreateWorkspaceMutationVariables
      >({
        mutation: CREATE_WORKSPACE_MUTATION,
        variables: {
          createWorkspaceInput: {
            name: workspaceName,
          },
        },
      });
      workspaceId = createWorkspace.data?.createWorkspace.id;
      expect(workspaceId).toBeDefined();
    });

    test(`Login as a different ${type}`, async () => {
      const response = await api.login({
        email: appEnv.ADMIN_EMAIL,
        password: appEnv.SEED_PASSWORD,
      });

      expect(response.data).toBeDefined();
    });

    test('The created workspace will not be visible to another user', async () => {
      const listWorkspace = await api.graphql.query<
        ListWorkSpaceQuery,
        ListWorkSpaceQueryVariables
      >({
        query: LIST_WORKSPACE_QUERY,
      });

      const addedWorkspace = listWorkspace.data.listWorkSpace.workspace.find(
        (workspace) => workspace.id === workspaceId,
      );

      expect(addedWorkspace).toBe(undefined);
    });
  });
});
