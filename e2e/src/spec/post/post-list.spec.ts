import { GET_POST_LIST_QUERY } from '../../graphql/posts/get-post-list-query.gql';
import { PrismaClient, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { appEnv } from '../../lib/app-env';

describe('Get Post List', () => {
  [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.USER].forEach((type) => {
    const api = new GraphQlApi();
    test(`Login as a ${type.toUpperCase()} `, async () => {
      const dbClient = new PrismaClient();
      const user = await dbClient.user.findFirst({
        where: {
          userType: type,
          isVerified: true,
        },
      });
      if (!user) {
        return;
      }
      const response = await api.login({
        email: user.email,
        password: appEnv.SEED_PASSWORD,
      });
      expect(response.data).toBeDefined();
    });

    test(`Get post list as ${type}`, async () => {
      const postList = await api.graphql.query({
        query: GET_POST_LIST_QUERY,
        variables: {},
      });

      expect(postList.data?.getPostList.posts.length).toBeGreaterThan(0);
    });

    test('Search by title post list ', () => {});

    test('Post order by orderby field enum', () => {});

    test('Post filter by author ID', () => {});

    test('Post pagination features', () => {});
  });
});
