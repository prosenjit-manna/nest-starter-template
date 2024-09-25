import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';
import { appEnv } from './app-env';

export const graphQlApi = new ApolloClient({
  uri: `${appEnv.API_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});

// export const graphQlApi = (token: string) => {
//   const baseApiURL = appEnv.API_BASE_URL;

//   const httpLink = new BatchHttpLink({
//     uri: baseApiURL + '/graphql',
//     batchMax: 1,
//     batchInterval: 100,
//     fetch,
//   });

//   const header: any = {};

//   if (token) {
//     header.authorization = `Bearer ${token}`;
//   }

//   const authLink = setContext((_, { headers }) => {
//     return {
//       headers: {
//         ...headers,
//         ...header,
//       },
//     };
//   });

//   return new ApolloClient({
//     link: authLink.concat(httpLink),
//     uri: `${appEnv.API_BASE_URL}/graphql`,
//     cache: new InMemoryCache(),
//     defaultOptions: {
//       query: {
//         fetchPolicy: 'no-cache',
//         errorPolicy: 'all',
//       },
//       mutate: {
//         fetchPolicy: 'no-cache',
//         errorPolicy: 'all',
//       },
//     },
//   });
// };
