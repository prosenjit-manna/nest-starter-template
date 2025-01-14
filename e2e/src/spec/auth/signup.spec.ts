import { SIGN_UP_MUTATION } from '../../graphql/sign-up-mutation.gql';
import { VERIFY_EMAIL_MUTATION } from '../../graphql/verify-email-mutation.gql';
import { LOGIN_QUERY } from '../../graphql/login-query.gql';
import { GraphQlApi } from '../../lib/graphql-api';
import { waitForTime } from '../../lib/wait-for-time';
import { fetchEmailsFromInbox } from '../../lib/fetchEmails';
import { appEnv } from '../../lib/app-env';
import { PrismaClient, User } from '@prisma/client';
import {
  LoginQuery,
  LoginQueryVariables,
  SignupInput,
  SignupMutation,
  SignupMutationVariables,
  VerifyEmailInput,
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from '../../gql/graphql';

describe('User Sign up', () => {
  let invitationLink: string | undefined;
  let onboardingToken: string | undefined;
  let addedUser: User | null;
  let userId: string | undefined;
  const userEmail = `automation-${crypto.randomUUID()}@${appEnv.TESTINATOR_TEAM_ID}`;
  const api = new GraphQlApi();
  const prisma = new PrismaClient();

  afterAll(async () => {
    await prisma.$disconnect();
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
    onboardingToken = invitationLink?.substring(46);
    expect(invitationLink).toContain('verify-email');
  });

  test('Should check if the user already exists', () => {
    expect(addedUser?.id).not.toBe(null);
  });

  test('Should throw an error if user not verified and tries to login', async () => {
    expect(addedUser?.isVerified).toBe(false);

    const response = await api.graphql.query<LoginQuery, LoginQueryVariables>({
      query: LOGIN_QUERY,
      variables: {
        loginInput: {
          email: userEmail,
          password: appEnv.SEED_PASSWORD,
        },
      },
    });
    expect(response.errors?.[0].message).toBe('Account not verified');
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

  test('Should not create duplicate user and be case-insensitive ', async () => {
    const signUpData = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: userEmail.toUpperCase(),
          password: appEnv.SEED_PASSWORD,
        } as SignupInput,
      },
    });

    expect(signUpData.errors?.[0].message).toBe('User already exists');
  });

  test('should return the user ID after successful signup', async () => {
    expect(userId).not.toBe(null);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    expect(user?.isVerified).toBe(true);
  });
});
