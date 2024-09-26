import { appEnv } from '../../lib/app-env';
import { PrismaClient, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { CURRENT_USER_QUERY } from '../../graphql/auth/current-user.gql';

describe('Current user login module', () => {
  [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.USER].forEach((type) => {
    const dbClient = new PrismaClient();
    const api = new GraphQlApi();
    beforeAll(async () => {
      const user = await dbClient.user.findFirst({
        where: {
          userType: type,
        },
      });
      if (!user) {
        return;
      }
       await api.login({
        email: user.email,
        password: appEnv.SEED_PASSWORD,
      });
    });

    test('Current user login ', async () => {
      const response = await api.graphql.query({
        query: CURRENT_USER_QUERY,
       
      });
      expect(response.data.currentUser.id).not.toBeNull();
      
    });

  });
});
