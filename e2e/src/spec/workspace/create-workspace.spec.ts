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
import { UPDATE_WORKSPACE_MUTATION } from '../../graphql/update-workspace-mution.gql';
import { LIST_WORKSPACE_QUERY } from '../../graphql/list-workspace-query.gql';
import { DELETE_WORKSPACE_MUTATION } from '../../graphql/delete-workspace-mutation.gql';
import { GraphQLError } from 'graphql';

describe('Workspace Module', () => {
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

    test('New Workspace created', async () => {
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
      expect(createWorkspace.data?.createWorkspace.id).not.toBeNull();
    });

    test('List of Workspace and created workspace assertion', async () => {
      const listWorkspace = await api.graphql.query<
        ListWorkSpaceQuery,
        ListWorkSpaceQueryVariables
      >({
        query: LIST_WORKSPACE_QUERY,
      });

      const addedWorkspace = listWorkspace.data.listWorkSpace.workspace.find(
        (workspace) => workspace.id === workspaceId,
      );

      expect(addedWorkspace?.name).toBe(workspaceName);
      expect(listWorkspace.data.listWorkSpace.workspace.length).toBeGreaterThan(
        0,
      );
    });

    test('Update Workspace already created', async () => {
      if (!workspaceId) {
        throw new Error(
          'Workspace ID is undefined; creation test might have failed',
        );
      }
      const updateWorkspace = await api.graphql.mutate<
        UpdateWorkspaceMutation,
        UpdateWorkspaceMutationVariables
      >({
        mutation: UPDATE_WORKSPACE_MUTATION,
        variables: {
          updateWorkspaceInput: {
            id: workspaceId,
            name: workspaceNameUpdated,
          },
        },
      });

      expect(updateWorkspace.data?.updateWorkspace.id).toBe(workspaceId);
    });

    test('List of Workspace and updated workspace assertion', async () => {
      const listWorkspace = await api.graphql.query<
        ListWorkSpaceQuery,
        ListWorkSpaceQueryVariables
      >({
        query: LIST_WORKSPACE_QUERY,
      });

      const addedWorkspace = listWorkspace.data.listWorkSpace.workspace.find(
        (workspace) => workspace.id === workspaceId,
      );

      expect(addedWorkspace?.name).toBe(workspaceNameUpdated);
      expect(listWorkspace.data.listWorkSpace.workspace.length).toBeGreaterThan(
        0,
      );
    });

    test('Delete Workspace which is created not from stash', async () => {
      if (!workspaceId) {
        throw new Error(
          'Workspace ID is undefined; creation test might have failed',
        );
      }
      const response = await api.graphql.mutate<
        DeleteWorkSpaceMutation,
        DeleteWorkSpaceMutationVariables
      >({
        mutation: DELETE_WORKSPACE_MUTATION,
        variables: {
          deleteWorkspaceInput: {
            id: workspaceId,
            fromStash: false,
          },
        },
      });

      expect(response.data?.deleteWorkSpace).toBe(true);
    });

    test('List of Workspace and created workspace assertion', async () => {
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

    test('Delete Workspace which is created not from stash again', async () => {
      try {
        if (!workspaceId) {
          throw new Error(
            'Workspace ID is undefined; creation test might have failed',
          );
        }
        const response = await api.graphql.mutate<
          DeleteWorkSpaceMutation,
          DeleteWorkSpaceMutationVariables
        >({
          mutation: DELETE_WORKSPACE_MUTATION,
          variables: {
            deleteWorkspaceInput: {
              id: workspaceId,
              fromStash: false,
            },
          },
        });

        expect(response.data?.deleteWorkSpace).toBe(true);
      } catch (error) {
        if (error instanceof GraphQLError)
          expect(error.message).toBe('Workspace not found');
      }
    });

    test('Delete Workspace which is created from stash', async () => {
      if (!workspaceId) {
        throw new Error(
          'Workspace ID is undefined; creation test might have failed',
        );
      }
      const response = await api.graphql.mutate<
        DeleteWorkSpaceMutation,
        DeleteWorkSpaceMutationVariables
      >({
        mutation: DELETE_WORKSPACE_MUTATION,
        variables: {
          deleteWorkspaceInput: {
            id: workspaceId,
            fromStash: true,
          },
        },
      });

      const addedWorkspace = await dbClient.workspace.findFirst({
        where: {
          id: workspaceId,
        },
      });

      expect(addedWorkspace).toBe(null);
      expect(response.data?.deleteWorkSpace).toBe(true);
    });
  });
});
