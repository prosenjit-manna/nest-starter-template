import { CREATE_POST_MUTATION } from '../../graphql/create-post-mutation.gql';
import { PrismaClient, User, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { appEnv } from '../../lib/app-env';
import { faker } from '@faker-js/faker';
import {
  CreatePostMutation,
  CreatePostMutationVariables,
} from '../../gql/graphql';

describe('Create a new post', () => {
  let user: User | null;

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

    test(`Create Post as ${type}`, async () => {
      if (!user) return;

      const createPostResponse = await api.graphql.mutate<
        CreatePostMutation,
        CreatePostMutationVariables
      >({
        mutation: CREATE_POST_MUTATION,
        variables: {
          createPostInput: {
            authorId: user?.id,
            content: faker.lorem.paragraph(),
            published: faker.datatype.boolean(),
            title: faker.lorem.word(),
          },
        },
      });

      const data = createPostResponse.data;
      expect(data?.createPost.id).toBeDefined();
    });

    test('Search new post in post list and exist', () => {});
  });
});