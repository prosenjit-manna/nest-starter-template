import { LOGIN_QUERY } from '../graphql/login-query.gql';
import { graphQlApi } from '../lib/graphql-api';

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
  });
});
