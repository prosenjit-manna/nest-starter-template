import { ApolloClient, InMemoryCache } from '@apollo/client';
import { appEnv } from './app-env';

export const graphQlApi = new ApolloClient({
  uri: `${appEnv.API_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});
