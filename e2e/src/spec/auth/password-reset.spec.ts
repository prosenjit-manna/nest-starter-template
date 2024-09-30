import { GraphQlApi } from '../../lib/graphql-api';
import { waitForTime } from '../../lib/wait-for-time';
import { fetchEmailsFromInbox } from '../../lib/fetchEmails';
import { appEnv } from '../../lib/app-env';
import { REQUEST_PASSWORD_RESET_MUTATION } from '../../graphql/request-password-reset-mutation.gql';
import { PASSWORD_RESET_MUTATION } from '../../graphql/password-reset-mutation.gql';
import { PrismaClient } from '@prisma/client';

import {
  PasswordResetInput,
  RequestPasswordResetMutation,
  RequestPasswordResetMutationVariables,
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
} from '../../gql/graphql';
import { faker } from '@faker-js/faker';

describe('Password Reset', () => {
  let invitationLink: string | undefined;
  let onboardingToken: string | undefined;
  const api = new GraphQlApi();
  const dbClient = new PrismaClient();

  test('Should send a password reset email to the user', async () => {
    const user = await dbClient.user.findFirst({
      where: {
        email: {
          contains: `${appEnv.TESTINATOR_TEAM_ID}`,
        },
        isVerified: true,
      },
    });

    if (!user) {
      return;
    }

    const passwordResetResponse = await api.graphql.mutate<
      RequestPasswordResetMutation,
      RequestPasswordResetMutationVariables
    >({
      mutation: REQUEST_PASSWORD_RESET_MUTATION,
      variables: {
        passwordReset: {
          email: user.email,
        },
      },
    });

    expect(passwordResetResponse.data?.requestPasswordReset.message).toBe(
      'Password reset email sent',
    );

    await waitForTime();
  }, 10000);

  test('Should not return an error if the email is not registered', async () => {
    const requestRandomUserPasswordReset = await api.graphql.mutate<
      RequestPasswordResetMutation,
      RequestPasswordResetMutationVariables
    >({
      mutation: REQUEST_PASSWORD_RESET_MUTATION,
      variables: {
        passwordReset: {
          email: `${crypto.randomUUID()}@${appEnv.TESTINATOR_TEAM_ID}`,
        },
      },
    });

    expect(
      requestRandomUserPasswordReset.data?.requestPasswordReset.message,
    ).toBe('Password reset email sent');
  });

  test('Fetch emails from the inbox and extract the invitation link', async () => {
    invitationLink = await fetchEmailsFromInbox('Password Reset Request');
    onboardingToken = invitationLink?.substring(37);
    if (invitationLink) {
      expect(invitationLink).toContain('password-reset');
    }
  });

  test('Should reset the password when provided with a valid token', async () => {
    if (onboardingToken) {
      api.setToken(onboardingToken);
    } else {
      return;
    }

    const resetPasswordMessage = await api.graphql.mutate<
      ResetPasswordMutation,
      ResetPasswordMutationVariables
    >({
      mutation: PASSWORD_RESET_MUTATION,
      variables: {
        resetPassword: {
          password: appEnv.SEED_PASSWORD,
        } as PasswordResetInput,
      },
    });

    expect(resetPasswordMessage.data?.resetPassword.message).toBe(
      'Password reset successful',
    );
  });

  test('Should return an error if the token is invalid or expired', async () => {
    api.setToken(faker.lorem.word());
    const response = await api.graphql.mutate<
      ResetPasswordMutation,
      ResetPasswordMutationVariables
    >({
      mutation: PASSWORD_RESET_MUTATION,
      variables: {
        resetPassword: {
          password: appEnv.SEED_PASSWORD,
        } as PasswordResetInput,
      },
    });
    expect(response.errors?.[0].message).toBe('Invalid token');
  });

  test('Should return an error if the new password does not meet criteria', async () => {
    // Not implemented in backend yet
  });
});
