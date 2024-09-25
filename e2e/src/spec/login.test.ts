import { LOGIN_QUERY } from '@/graphql/auth/login/login-query.gql';
import { appEnv } from '@/lib/app-env';
import { graphQlApi } from '@/lib/graphql-api';
import { PrismaClient } from '@prisma/client';
describe('Login Spec', () => {
  
  test('Super Admin Login', async () => {
    const dbClient = new PrismaClient();
    const superAdmin = await dbClient.user.findFirst({ where: { userType: 'SUPER_ADMIN' } });
    if (!superAdmin) {
      return;
    }

    const response = await graphQlApi.query({
      query: LOGIN_QUERY,
      variables: {
        loginInput: {
          email: superAdmin?.email,
          password: appEnv.SEED_PASSWORD,
        },
      },
    });
    expect(response.data.login.token).not.toBeNull();
  });


});
