describe('signup', () => {
  test('should hash the password correctly', () => {});
  test('should create a verification URL', () => {});
  test('should check if the user already exists', () => {});
  test('should throw an error if user not verified and tries to login', () => {});
  test('should create a new user if the user does not exist', () => {});
  test('should send a welcome email with the verification URL', () => {});
  test('should return the user ID after successful signup', () => {});
});

import { SIGN_UP_MUTATION } from '../../graphql/auth/sign-up/sign-up-mutation.gql';
import { VERIFY_EMAIL_MUTATION } from '../../graphql/auth/verify-email/verify-email-mutation.gql';
import { GraphQlApi } from '../../lib/graphql-api';
import { waitForTime } from '../../lib/wait-for-time';
import { fetchEmailsFromInbox } from '../../lib/fetchEmails';
import { appEnv } from '../../lib/app-env';

describe('User Sign up', () => {
  let invitationLink: string;
  let onboardingToken: string;
  const api = new GraphQlApi();

  test('Add a new user', async () => {
    const signUpData = await api.graphql.mutate({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: `automation-${crypto.randomUUID()}@team930312.testinator.com`,
          password: appEnv.SEED_PASSWORD,
        },
      },
    });

    expect(signUpData.data.signup.id).not.toBe(null);

    waitForTime();
  });

  test('Fetch emails from the inbox and extract the invitation link', async () => {
    invitationLink = await fetchEmailsFromInbox('Welcome');
    onboardingToken = invitationLink.substring(35);
    console.log(invitationLink, onboardingToken);
    expect(invitationLink).toContain('verify-email');
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
});
