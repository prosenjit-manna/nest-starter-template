import { PrismaClient, UserType } from '@prisma/client';
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

describe('Workspace Module', () => {
  let dbClient = new PrismaClient();
  let user;
  const api = new GraphQlApi();
  let workspaceId : string | undefined;

  beforeAll(() => {
    dbClient = new PrismaClient();
  });

  afterAll(async () => {
    await dbClient.$disconnect();
  });

  [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.USER].forEach((type) => {
  test(`Login as a ${UserType.ADMIN.toUpperCase()}`, async () => {
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
    const response = await api.graphql.mutate<
      CreateWorkspaceMutation,
      CreateWorkspaceMutationVariables
    >({
      mutation: CREATE_WORKSPACE_MUTATION,
      variables: {
        createWorkspaceInput: {
          name: faker.lorem.word(),
        },
      },
    });

    workspaceId = response.data?.createWorkspace.id;
    expect(response.data?.createWorkspace.id).not.toBeNull();
  });

  test('Update Workspace already created', async () => {
    if (!workspaceId) {
      throw new Error('Workspace ID is undefined; creation test might have failed');
    }
    const response = await api.graphql.mutate<
    UpdateWorkspaceMutation,
    UpdateWorkspaceMutationVariables
      
    >({
      mutation: UPDATE_WORKSPACE_MUTATION,
      variables: {
        updateWorkspaceInput: {
          id: workspaceId,
          name: faker.lorem.word()
        },
      },
    });

    expect(response.data?.updateWorkspace.id).toBe(workspaceId);
  });


  test('List of Workspace', async () => {
    const response = await api.graphql.query<
    ListWorkSpaceQuery,
    ListWorkSpaceQueryVariables>({
      query: LIST_WORKSPACE_QUERY
      });
    expect(response.data.listWorkSpace.workspace.length).not.toBe(null);
  });
});

test('Delete Workspace which is created not from stash', async () => {
  if (!workspaceId) {
    throw new Error('Workspace ID is undefined; creation test might have failed');
  }
  const response = await api.graphql.mutate<
  DeleteWorkSpaceMutation,
  DeleteWorkSpaceMutationVariables
    
  >({
    mutation: DELETE_WORKSPACE_MUTATION,
    variables: {
      deleteWorkspaceInput: {
        id: workspaceId,
        fromStash: false
      }
    },
  });

  expect(response.data?.deleteWorkSpace).toBe(true);
});

test('Delete Workspace which is created from stash', async () => {
  if (!workspaceId) {
    throw new Error('Workspace ID is undefined; creation test might have failed');
  }
  const response = await api.graphql.mutate<
  DeleteWorkSpaceMutation,
  DeleteWorkSpaceMutationVariables
    
  >({
    mutation: DELETE_WORKSPACE_MUTATION,
    variables: {
      deleteWorkspaceInput: {
        id: workspaceId,
        fromStash: true
      }
    },
  });

  expect(response.data?.deleteWorkSpace).toBe(true);
});
});
