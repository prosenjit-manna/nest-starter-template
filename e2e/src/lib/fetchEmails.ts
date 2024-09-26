import axios from 'axios';
import { appEnv } from './app-env';

export const fetchEmailsFromInbox = async (emailSubject: string) => {
  let messageId;
  const apiUrl = `${appEnv.FETCH_EMAILS_INBOX}${appEnv.API_KEY}`;

  try {
    const mailResponse = await axios.get(apiUrl);
    if (mailResponse.status === 200) {
      if (mailResponse.data.msgs && mailResponse.data.msgs.length > 0) {
        const emails = mailResponse.data.msgs;
        emails.forEach((email: any, index: number) => {
          if (email.subject === emailSubject && index === 0) {
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

  const fetchMessageURL = `${appEnv.FETCH_SPECIFIC_EMAIL}${messageId}?token=${appEnv.API_KEY}`;

  const messageResponse = await axios.get(fetchMessageURL);
  const urlRegex = /href="(http:\/\/[^"]*)"/;
  const match = messageResponse.data.parts[0].body.match(urlRegex);
  if (match) {
    return match[1];
  }
};
