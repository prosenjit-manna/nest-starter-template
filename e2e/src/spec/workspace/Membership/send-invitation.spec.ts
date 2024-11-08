import { SIGN_UP_MUTATION } from '../../../graphql/sign-up-mutation.gql';
import { VERIFY_EMAIL_MUTATION } from '../../../graphql/verify-email-mutation.gql';
import { GraphQlApi } from '../../../lib/graphql-api';
import { waitForTime } from '../../../lib/wait-for-time';
import { fetchEmailsFromInbox } from '../../../lib/fetchEmails';
import { appEnv } from '../../../lib/app-env';
import { PrismaClient, User, UserType } from '@prisma/client';
import {
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
import { LIST_WORKSPACE_QUERY } from '../../../graphql/list-workspace-query.gql';
import { SEND_INVITATION_MUTATION } from '../../../graphql/send-invitation-mutation.gql';

describe('Membership invitation module', () => {
  let workspaceID: string | undefined;
  let invitationLink: string | undefined;
  let onboardingToken: string | undefined;
  let addedUser: User | null;
  let user: User | null;
  let userId: string | undefined;
  const userEmail = `automation-${crypto.randomUUID()}@${appEnv.TESTINATOR_TEAM_ID}`;
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

    const response = await api.login({
      email: user.email,
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

    await waitForTime();
  }, 10000);

  test('Should hash the password correctly', async () => {
    addedUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    expect(addedUser?.password).not.toBe(appEnv.SEED_PASSWORD);
  });

  test('Should create a verification URL', async () => {
    invitationLink = await fetchEmailsFromInbox('Welcome');
    onboardingToken = invitationLink?.substring(35);
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

  test('should return the user ID after successful signup', async () => {
    expect(userId).not.toBe(null);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    expect(user?.isVerified).toBe(true);
  });

  test('List of Workspace and created workspace assertion', async () => {
    const listWorkspace = await api.graphql.query<
      ListWorkSpaceQuery,
      ListWorkSpaceQueryVariables
    >({
      query: LIST_WORKSPACE_QUERY,
    });
     workspaceID = listWorkspace.data.listWorkSpace.workspace[0].id;
     console.log(workspaceID);
  });

  test('Send invitation', async () => {
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
      }
    });
    expect(sendInvitation.data?.sendInvitation.success).toBe(true);
   
  });
});
