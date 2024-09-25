import { PASSWORD_RESET_MUTATION } from '@/graphql/auth/password-reset/password-reset-mutation.gql';
import { REQUEST_PASSWORD_RESET_MUTATION } from '@/graphql/auth/password-reset/request-password-reset-mutation.gql';
import { graphQlApi } from '@/lib/graphql-api';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

describe('Password Reset', () => {
  let messageId: string;
  let invitationLink: string;
  let authToken: string;
  const sleep = (timeout: number) =>
    new Promise((resolve) => setTimeout(resolve, timeout));

  test('Request Password Reset', async () => {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({ where: { userType: 'USER' } });

    if (!user) return;

    const passwordResetResponse = await graphQlApi.mutate({
      mutation: REQUEST_PASSWORD_RESET_MUTATION,
      variables: {
        passwordReset: {
          email: user?.email,
        },
      },
    });

    expect(passwordResetResponse.data.requestPasswordReset.message).toBe(
      'Password reset email sent',
    );

    await sleep(4000);
  });

  test('Fetch emails from the inbox and extract the invitation link', async () => {
    const apiToken = '6fd5ed52adf94184a9b562da180ea4f9';
    const apiUrl = `https://api.mailinator.com/api/v2/domains/private/inboxes?token=${apiToken}`;

    try {
      const mailResponse = await axios.get(apiUrl);
      if (mailResponse.status === 200) {
        if (mailResponse.data.msgs && mailResponse.data.msgs.length > 0) {
          const emails = mailResponse.data.msgs;
          emails.forEach((email: any, index: number) => {
            if (email.subject === 'Password Reset Request' && index === 0) {
              messageId = email.id;
            }
          });
        } else {
          console.error('No messages found in the inbox');
        }
      } else {
        console.error('Unexpected response status:', mailResponse.status);
      }
    } catch (error: any) {
      console.error('Error setting up the request:', error.message);
    }

    const fetchMessageURL = `https://mailinator.com/api/v2/domains/private/messages/${messageId}?token=${apiToken}`;

    try {
      const messageResponse = await axios.get(fetchMessageURL);
      const urlRegex = /href="(http:\/\/[^"]*)"/;
      const match = messageResponse.data.parts[0].body.match(urlRegex);
      if (match) {
        invitationLink = match[1];
        authToken = invitationLink.substring(30);
        expect(invitationLink).toContain('password-reset');
      }
    } catch (error: any) {
      console.error('Error setting up the request:', error.message);
    }
  });

  test('Reset the password', async () => {
    const resetPasswordMessage = await graphQlApi.mutate({
      mutation: PASSWORD_RESET_MUTATION,
      variables: {
        resetPassword: {
          password: 'SamLauncher@123',
        },
      },
    });

    console.log(resetPasswordMessage);
  });
});
