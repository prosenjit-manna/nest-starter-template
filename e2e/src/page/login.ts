import { LoginQuery } from '@/gql/graphql';
import { LOGIN_QUERY } from '../graphql/auth/login/login-query.gql';
import { graphQlApi } from '../lib/graphql-api';

export async function loginAndGetToken(email: string, password: string): Promise<LoginQuery> {
  const response = await graphQlApi.query({
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