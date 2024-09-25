import axios from 'axios';
import { SIGN_UP_MUTATION } from '../../../graphql/auth/sign-up/sign-up-mutation.gql';
import { VERIFY_EMAIL_MUTATION } from '../../../graphql/auth/verify-email/verify-email-mutation.gql';
import { graphQlApi } from '../../../lib/graphql-api';
import { faker } from '@faker-js/faker';

describe('User Sign up', () => {
  let messageId: string;
  let invitationLink: string;
  let onboardingToken: string;

  const sleep = (timeout: number) =>
    new Promise((resolve) => setTimeout(resolve, timeout));

  test('Add a new user', async () => {
    const signUpData = await graphQlApi.mutate({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: `automation-${faker.person.firstName()}@team930312.testinator.com`,
          password: 'Itobuz#1234',
        },
      },
    });

    expect(signUpData.data.signup.id).not.toBe(null);

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
            if (email.subject === 'Welcome' && index === 0) {
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
        onboardingToken = invitationLink.substring(35);
        expect(invitationLink).toContain('verify-email');
      }
    } catch (error: any) {
      console.error('Error setting up the request:', error.message);
    }
  });

  test('Verify the email with onboarding token', async () => {
    const verifyEmailData = await graphQlApi.mutate({
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
