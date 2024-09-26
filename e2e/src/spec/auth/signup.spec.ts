import { SIGN_UP_MUTATION } from '../../graphql/auth/sign-up/sign-up-mutation.gql';
import { VERIFY_EMAIL_MUTATION } from '../../graphql/auth/verify-email/verify-email-mutation.gql';
import { GraphQlApi } from '../../lib/graphql-api';
import { waitForTime } from '../../lib/wait-for-time';
import { fetchEmailsFromInbox } from '../../lib/fetchEmails';
import { appEnv } from '../../lib/app-env';
import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';
import { LOGIN_QUERY } from '../../graphql/auth/login/login-query.gql';
import { LoginInput, SignupResponse } from '../../gql/graphql';

describe('User Sign up', () => {
  let invitationLink: string;
  let onboardingToken: string;
  let addedUser: User | null;
  const api = new GraphQlApi();
  const prisma = new PrismaClient();
  const userEmail = `automation-${crypto.randomUUID()}@team930312.testinator.com`;
  let userId: string;

  test('Add a new user', async () => {
    const signUpData = await api.graphql.mutate({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: userEmail,
          password: appEnv.SEED_PASSWORD,
        },
      },
    });

    userId = signUpData.data.signup.id;
    expect(signUpData.data.signup.id).not.toBe(null);

    waitForTime();
  });

  test('Should hash the password correctly', async () => {
    addedUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    expect(addedUser?.password).not.toBe(appEnv.SEED_PASSWORD);
  });

  test('Should create a verification URL', async () => {
    invitationLink = await fetchEmailsFromInbox('Welcome');
    onboardingToken = invitationLink.substring(35);
    expect(invitationLink).toContain('verify-email');
  });

  test('Should check if the user already exists', () => {
    expect(addedUser?.id).not.toBe(null);
  });

  test('Should throw an error if user not verified and tries to login', async () => {
    expect(addedUser?.isVerified).toBe(false);

    const loginInput: LoginInput = {
      email: userEmail,
      password: appEnv.SEED_PASSWORD,
    };

    await expect(
      api.graphql.query({
        query: LOGIN_QUERY,
        variables: {
          loginInput,
        },
      }),
    ).rejects.toThrow('Account not verified');
  });

  test('Verify the email with onboarding token', async () => {
    const verifyEmailData = await api.graphql.mutate({
      mutation: VERIFY_EMAIL_MUTATION,
      variables: {
        verifyEmailInput: {
          token: onboardingToken,
        },
      },
    });
    expect(verifyEmailData.data.verifyEmail.refreshToken).not.toBe(null);
  });

  test('Should not create duplicate user and be case-insensitive ', async () => {
    await expect(
      api.graphql.mutate({
        mutation: SIGN_UP_MUTATION,
        variables: {
          signupInput: {
            email: userEmail.toUpperCase(),
            password: appEnv.SEED_PASSWORD,
          },
        },
      }),
    ).rejects.toThrow('User already exists');
  });

  test('should return the user ID after successful signup', async () => {
    expect(userId).not.toBe(null);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    expect(user?.isVerified).toBe(false);
  });
});
