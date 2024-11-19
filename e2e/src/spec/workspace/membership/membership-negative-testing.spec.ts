import { GraphQlApi } from '../../../lib/graphql-api';
import { appEnv } from '../../../lib/app-env';
import { PrismaClient, User, UserType } from '@prisma/client';
import {
  AcceptInvitationMutation,
  AcceptInvitationMutationVariables,
  GetUsersQuery,
  GetUsersQueryVariables,
  ListWorkSpaceQuery,
  ListWorkSpaceQueryVariables,
  SendInvitationMutation,
  SendInvitationMutationVariables,
} from '../../../gql/graphql';
import { LIST_WORKSPACE_QUERY } from '../../../graphql/list-workspace-query.gql';
import { SEND_INVITATION_MUTATION } from '../../../graphql/send-invitation-mutation.gql';
import { VERIFY_INVITATION_MUTATION } from '../../../graphql/verify-invitation-mutation.gql';
import { USER_LIST } from '../../../graphql/get-user-list.gql';
import { sample } from 'lodash';

describe('Membership invitation module', () => {
  let workspaceID: string | undefined;
  const onboardingToken: string =
    '$2b$10$u0wMXxOHe1mJEy2S18zgU.z73msGf9FVaep46wG2vZYFy3WJLWiKu';
  let user: User | null;
  let userId: string | undefined;
  let userEmail: string | undefined;
  const api = new GraphQlApi();
  const prisma = new PrismaClient();
  const dbClient = new PrismaClient();

  afterAll(async () => {
    await prisma.$disconnect();
  });

  [UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
    test(`Login as a ${type}`, async () => {
      user = await dbClient.user.findFirst({
        where: {
          userType: UserType.ADMIN,
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

    test(`Get user list and fetch a random user id ${type}`, async () => {
      const userList = await api.graphql.query<
        GetUsersQuery,
        GetUsersQueryVariables
      >({
        query: USER_LIST,
      });
      userId = sample(userList.data.getUsers)?.id;
      userEmail = sample(userList.data.getUsers)?.email;
      expect(userList.data.getUsers.length).not.toBe(0);
    });

    test(`Send invitation with a user Id who is already in the workspace ${type}`, async () => {
      const workspace = await dbClient.workspaceMembership.findFirst({
        where: {
          userId: userId,
        },
      });
      workspaceID = workspace?.workspaceId;
      if (workspaceID && userId) {
        const sendInvitation = await api.graphql.mutate<
          SendInvitationMutation,
          SendInvitationMutationVariables
        >({
          mutation: SEND_INVITATION_MUTATION,
          variables: {
            sendInvitationInput: {
              userId: userId,
              workspaceId: workspaceID,
            },
          },
        });
        if (!sendInvitation.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        console.log(sendInvitation.errors[0]);
        // expect(sendInvitation.errors[0].message).toContain(
        //   'Foreign key constraint failed on the field: `WorkspaceMembership_userId_fkey (index)',
        // );
      }
    });

    test(`Send invitation with a wrong workspace Id ${type}`, async () => {
      const workspace = await dbClient.workspaceMembership.findFirst({
        where: {
          userId: { not: user?.id },
        },
      });
      if (userId && workspace) {
        const sendInvitation = await api.graphql.mutate<
          SendInvitationMutation,
          SendInvitationMutationVariables
        >({
          mutation: SEND_INVITATION_MUTATION,
          variables: {
            sendInvitationInput: {
              userId: userId,
              workspaceId: workspace?.workspaceId,
            },
          },
        });
        if (!sendInvitation.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        console.log(sendInvitation.errors[0]);
        // expect(sendInvitation.errors[0].message).toContain(
        //   'Foreign key constraint failed on the field: `WorkspaceMembership_workspaceId_fkey (index)',
        // );
      }
    });

    test(`Verify invitation ${type}`, async () => {
      const verifyInvitation = await api.graphql.mutate<
        AcceptInvitationMutation,
        AcceptInvitationMutationVariables
      >({
        mutation: VERIFY_INVITATION_MUTATION,
        variables: {
          acceptInvitationInput: {
            token: onboardingToken as string,
          },
        },
      });
      if (!verifyInvitation.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      expect(verifyInvitation.errors[0].message).toContain(
        'Invalid invitation token!',
      );
    });

    test(`Send invitation to a user `, async () => {
      const workspace = await dbClient.workspaceMembership.findFirst({
        where: {
          userId: user?.id,
        },
      });
      workspaceID = workspace?.workspaceId;
      if (workspaceID && userId) {
        const sendInvitation = await api.graphql.mutate<
          SendInvitationMutation,
          SendInvitationMutationVariables
        >({
          mutation: SEND_INVITATION_MUTATION,
          variables: {
            sendInvitationInput: {
              userId: userId,
              workspaceId: workspaceID,
            },
          },
        });
        expect(sendInvitation.data?.sendInvitation.success).toBe(true);
      }
    });

    test(`Login as the user who has been invited`, async () => {
      if (userEmail) {
        const response = await api.login({
          email: userEmail,
          password: appEnv.SEED_PASSWORD,
        });
        expect(response.data).toBeDefined();
      }
    });

    test('Check whether the user can access the workspace', async () => {
      if (workspaceID) {
        const listWorkspace = await api.graphql.query<
          ListWorkSpaceQuery,
          ListWorkSpaceQueryVariables
        >({
          query: LIST_WORKSPACE_QUERY,
        });

        const addedWorkspace = listWorkspace.data.listWorkSpace.workspace.find(
          (workspace) => workspace.id === workspaceID,
        );

        expect(addedWorkspace).toBe(undefined);
      }
    });
  });
});
