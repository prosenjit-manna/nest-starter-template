import { LOGIN_QUERY } from '../graphql/auth/login/login-query.gql';
import { graphQlApi } from '../lib/graphql-api';

let authToken: string | null = null;
describe('sum module', () => {
  test('get users', async () => {
    const response = await graphQlApi.query({
      query: LOGIN_QUERY,
      variables: {
        loginInput: {
          email: "example+super-admin@exanple.com",
          password: "SamLauncher@123",
        },
      },
    });
    console.log(response.data);
    expect(response.data.login.status).toBe('200');

    authToken = response.data?.login?.token;

    console.log('Auth Token:', authToken);
    expect(authToken).toBeDefined();
  });
});
