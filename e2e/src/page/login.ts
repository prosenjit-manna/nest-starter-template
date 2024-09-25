import { LoginQuery } from '@/gql/graphql';
import { LOGIN_QUERY } from '../graphql/auth/login/login-query.gql';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GraphQlApi } from '@/lib/graphql-api';

const graphQlApi = new ApolloClient({
  cache: new InMemoryCache(),
});
const api = new GraphQlApi();

export async function loginAndGetToken(email: string, password: string): Promise<LoginQuery> {
  const response = await api.api.query({
    query: LOGIN_QUERY,
    variables: {
      loginInput: {
        email,
        password,
      },
    },
  });

  expect(response.data).toBeDefined();
  expect(response.error).toBeUndefined();
  

  expect(typeof response.data.login.token).toBe('string');
  return response.data;
}