import { Post, PrismaClient, User, UserType } from '@prisma/client';
import { appEnv } from '../../lib/app-env';
import { GraphQlApi } from '../../lib/graphql-api';
import { UPDATE_POST_MUTATION } from '../../graphql/update-post-mutation.gql';
import {
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../gql/graphql';
import { faker } from '@faker-js/faker';
describe('Update Post', () => {
  let user: User | null;
  let post: Post | null;

  [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.USER].forEach((type) => {
    const api = new GraphQlApi();

    test(`Login as a ${type.toUpperCase()} `, async () => {
      const dbClient = new PrismaClient();
      user = await dbClient.user.findFirst({
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

    test('Update Post', async () => {
      const prisma = new PrismaClient();
      post = await prisma.post.findFirst({
        where: {
          authorId: user?.id,
        },
      });

      if (!post) return;

      const updatePostResponse = await api.graphql.mutate<
        UpdatePostMutation,
        UpdatePostMutationVariables
      >({
        mutation: UPDATE_POST_MUTATION,
        variables: {
          postId: post?.id,
          updatePostInput: {
            authorId: user?.id,
            content: faker.lorem.paragraph(),
            published: faker.datatype.boolean(),
            title: faker.lorem.word(),
          },
        },
      });

      const data = updatePostResponse.data;
      expect(data?.updatePost.id).toBeDefined();
    });
  });

  test('Search  post has been updated in post list', () => {});
});
