import Imap, { Config } from 'node-imap';
import { appEnv } from './app-env';

const imapConfig: Config = {
  user: appEnv.IMAP_USER,
  password: appEnv.IMAP_PASSWORD,
  host: appEnv.IMAP_HOST,
  port: appEnv.IMAP_PORT,
  tls: appEnv.IMAP_TLS,
};

interface Message {
  seqno: number;
  attributes: any;
  body: string;
}

export const readEmails = ({ searchDate }: { searchDate: string }): Promise<Message[]> => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);
    const messages: Message[] = [];

    imap.once('ready', () => {
      // console.log('imap ready');

      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          imap.end();
          return reject(err);
        }
        // console.log('total', box.messages.total);

        imap.search(['ALL', ['SINCE', searchDate]], (err, results) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          const fetch = imap.fetch(results, { bodies: '' });

          fetch.on('message', (msg: any, seqno: number) => {
            // console.log('Message #%d', seqno);
            const prefix = '(#' + seqno + ') ';
            let messageBody = '';

            msg.on('body', (stream: any) => {
              let buffer = '';
              stream.on('data', (chunk: any) => {
                buffer += chunk.toString('utf8');
              });
              stream.on('end', () => {
                messageBody = buffer;
                // console.log(prefix + 'Body [%s]', buffer);
              });
            });

            msg.once('attributes', (attrs: any) => {
              messages.push({
                seqno,
                attributes: attrs,
                body: messageBody,
              });
            });

            msg.once('end', () => {
              // console.log(prefix + 'Finished');
            });
          });

          fetch.once('error', (err) => {
            console.error('Fetch error:', err);
            imap.end();
            reject(err);
          });

          fetch.once('end', () => {
            // console.log('Done fetching all messages!');
            // console.log('Fetched messages:', messages);
            imap.end();
            resolve(messages);
          });
        });
      });
    });

    imap.once('error', (err: Error) => {
      console.error('IMAP error:', err.message);
      reject(err);
    });

    imap.once('end', () => {
      // console.log('Connection ended');
    });

    imap.connect();
  });
};

// Usage example
// readEmails({ searchDate: 'Nov 24, 2024'})
//   .then((messages) => {
//     console.log('Done fetching all messages!', messages.length);
//     console.log('Fetched messages:', messages);
//   })
//   .catch((err) => {
//     console.error('Error fetching messages:', err);
//   });