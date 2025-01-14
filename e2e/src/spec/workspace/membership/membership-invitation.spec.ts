import { SIGN_UP_MUTATION } from '../../../graphql/sign-up-mutation.gql';
import { VERIFY_EMAIL_MUTATION } from '../../../graphql/verify-email-mutation.gql';
import { GraphQlApi } from '../../../lib/graphql-api';
import { waitForTime } from '../../../lib/wait-for-time';
import { fetchEmailsFromInbox } from '../../../lib/fetchEmails';
import { appEnv } from '../../../lib/app-env';
import { PrismaClient, User, UserType } from '@prisma/client';
import {
  AcceptInvitationMutation,
  AcceptInvitationMutationVariables,
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables,
  ListWorkSpaceQuery,
  ListWorkSpaceQueryVariables,
  SendInvitationMutation,
  SendInvitationMutationVariables,
  SignupMutation,
  SignupMutationVariables,
  VerifyEmailInput,
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from '../../../gql/graphql';
import { SEND_INVITATION_MUTATION } from '../../../graphql/send-invitation-mutation.gql';
import { VERIFY_INVITATION_MUTATION } from '../../../graphql/verify-invitation-mutation.gql';
import { CREATE_WORKSPACE_MUTATION } from '../../../graphql/create-workspace-mutation.gql';
import { faker } from '@faker-js/faker';
import { LIST_WORKSPACE_QUERY } from '../../../graphql/list-workspace-query.gql';

describe('Membership invitation module', () => {
  let workspaceID: string | undefined;
  const workspaceName = faker.lorem.word();
  let invitationLink: string | undefined;
  let onboardingToken: string | undefined;
  let user: User | null;
  let userId: string | undefined;
  const userEmail = `automation-${crypto.randomUUID()}@${appEnv.TESTINATOR_TEAM_ID}`;
  let adminEmail: string | undefined;
  const api = new GraphQlApi();
  const prisma = new PrismaClient();
  const dbClient = new PrismaClient();

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test(`Login as a ${UserType.ADMIN}`, async () => {
    user = await dbClient.user.findFirst({
      where: {
        userType: UserType.ADMIN,
        isVerified: true,
      },
    });

    if (!user) {
      return;
    }

    adminEmail = user.email;

    const response = await api.login({
      email: adminEmail,
      password: appEnv.SEED_PASSWORD,
    });

    expect(response.data).toBeDefined();
  });

  test('Add a new user', async () => {
    const signUpData = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: userEmail,
          password: appEnv.SEED_PASSWORD,
        },
      },
    });

    const data = signUpData.data?.signup;
    userId = data?.id;
    expect(data?.id).not.toBe(null);
    await waitForTime(6000);
  }, 10000);

  test('Should create a verification URL', async () => {
    invitationLink = await fetchEmailsFromInbox('Welcome');
    onboardingToken = invitationLink?.substring(46);
    expect(invitationLink).toContain('verify-email');
  });

  test('Verify the email with onboarding token', async () => {
    const verifyEmailData = await api.graphql.mutate<
      VerifyEmailMutation,
      VerifyEmailMutationVariables
    >({
      mutation: VERIFY_EMAIL_MUTATION,
      variables: {
        verifyEmailInput: {
          token: onboardingToken,
        } as VerifyEmailInput,
      },
    });

    const data = verifyEmailData.data?.verifyEmail;
    expect(data?.refreshToken).not.toBe(null);
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

    workspaceID = createWorkspace.data?.createWorkspace.id;
    expect(createWorkspace.data?.createWorkspace.id).not.toBeNull();
  });

  test('Send invitation to the user', async () => {
    if (userId && workspaceID) {
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
    await waitForTime(6000);
  }, 15000);

  test('Get the invitation link', async () => {
    invitationLink = await fetchEmailsFromInbox('Membership Invitation');
    onboardingToken = invitationLink?.substring(60);
    expect(invitationLink).toContain('membership-verify');
  });

  test('Verify and deny the invitation', async () => {
    if (userId && workspaceID) {
      const verifyInvitation = await api.graphql.mutate<
        AcceptInvitationMutation,
        AcceptInvitationMutationVariables
      >({
        mutation: VERIFY_INVITATION_MUTATION,
        variables: {
          acceptInvitationInput: {
            token: onboardingToken as string,
            accept: false,
          },
        },
      });
      expect(verifyInvitation.data?.acceptInvitation).toBe(true);
    }
  });

  test(`Login as a ${UserType.ADMIN}`, async () => {
    const response = await api.login({
      email: userEmail,
      password: appEnv.SEED_PASSWORD,
    });

    expect(response.data).toBeDefined();
  });

  test(' View the List of Workspace and the user should not be able to view the workspace', async () => {
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
  });

  test(`Login as a ${UserType.ADMIN}`, async () => {
    if (adminEmail) {
      const response = await api.login({
        email: adminEmail,
        password: appEnv.SEED_PASSWORD,
      });

      expect(response.data).toBeDefined();
    }
  });

  test('Send invitation again', async () => {
    if (userId && workspaceID) {
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
    await waitForTime(6000);
  }, 15000);

  test('Get the invitation link', async () => {
    invitationLink = await fetchEmailsFromInbox('Membership Invitation');
    onboardingToken = invitationLink?.substring(60);
    expect(invitationLink).toContain('membership-verify');
  });

  test('Verify and accept invitation', async () => {
    if (userId && workspaceID) {
      const verifyInvitation = await api.graphql.mutate<
        AcceptInvitationMutation,
        AcceptInvitationMutationVariables
      >({
        mutation: VERIFY_INVITATION_MUTATION,
        variables: {
          acceptInvitationInput: {
            token: onboardingToken as string,
            accept: true,
          },
        },
      });
      expect(verifyInvitation.data?.acceptInvitation).toBe(true);
    }
  });

  test(`Login as a ${UserType.ADMIN}`, async () => {
    const response = await api.login({
      email: userEmail,
      password: appEnv.SEED_PASSWORD,
    });

    expect(response.data).toBeDefined();
  });

  //This test has an issue - NST-77
  test(' View the List of Workspace and the user should not be able to view the workspace', async () => {
    const listWorkspace = await api.graphql.query<
      ListWorkSpaceQuery,
      ListWorkSpaceQueryVariables
    >({
      query: LIST_WORKSPACE_QUERY,
    });

    const addedWorkspace = listWorkspace.data.listWorkSpace.workspace.find(
      (workspace) => workspace.id === workspaceID,
    );

    expect(addedWorkspace?.name).toBe(workspaceName);
  });
});
