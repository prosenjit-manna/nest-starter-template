import { PrismaClient, UserType } from '@prisma/client';
import { appEnv } from '../../lib/app-env';
import { GraphQlApi } from '../../lib/graphql-api';
import { USER_LIST } from '../../graphql/get-user-list.gql';
import { GetUsersQuery, GetUsersQueryVariables } from '../../gql/graphql';

describe('User List', () => {
  [UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
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

    test('Get  user list ', async () => {
      const response = await api.graphql.query<
        GetUsersQuery,
        GetUsersQueryVariables
      >({
        query: USER_LIST,
      });
      expect(response.data.getUsers.length).not.toBe(0);
    });
    test('Search by user name and email user list ', () => {});

    test('Filter by  user ID ', () => {});

    test('User pagination features', () => {});
  });
});
