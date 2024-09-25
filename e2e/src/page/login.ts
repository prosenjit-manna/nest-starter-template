import { error } from 'console';
import { LOGIN_QUERY } from '../graphql/auth/login/login-query.gql';
import { graphQlApi } from '../lib/graphql-api';

export async function loginAndGetToken(email: string, password: string): Promise<string> {
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
  
  const token = response.data.login.token;

  expect(typeof token).toBe('string');
  expect(token).toBeDefined();
  return token;
}