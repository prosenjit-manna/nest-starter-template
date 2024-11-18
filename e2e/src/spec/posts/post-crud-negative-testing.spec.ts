import { PrismaClient, User, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { appEnv } from '../../lib/app-env';
import {
  CreatePostMutation,
  CreatePostMutationVariables,
  CurrentUserQuery,
  CurrentUserQueryVariables,
  DeletePostMutation,
  DeletePostMutationVariables,
  GetPostListQuery,
  GetPostListQueryVariables,
  GetPostQuery,
  GetPostQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../gql/graphql';
import { GET_POST_QUERY } from '../../graphql/get-post-query.gql';
import { CREATE_POST_MUTATION } from '../../graphql/create-post-mutation.gql';
import { GET_POST_LIST_QUERY } from '../../graphql/get-post-list-query.gql';
import { UPDATE_POST_MUTATION } from '../../graphql/update-post-mutation.gql';
import { CURRENT_USER_QUERY } from '../../graphql/current-user.gql';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { DELETE_POST_MUTATION } from '../../graphql/delete-post-mutation.gql';

const userArrays = [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.USER];
userArrays.forEach((userTypeRole) => {
  describe(`Post CRUD functionalities negative testing for ${userTypeRole} - NST-42`, () => {
    let user: User | null;
    let postId: string | undefined;
    const content = faker.lorem.paragraph();
    const title = faker.lorem.word();
    let createFlag = false;
    let updateFlag = false;
    let deleteFlag = false;
    const api = new GraphQlApi();

    test(`Login as a ${userTypeRole.toUpperCase()}`, async () => {
      const dbClient = new PrismaClient();
      user = await dbClient.user.findFirst({
        where: {
          userType: UserType[userTypeRole],
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

    test('Get current user privileges', async () => {
      const currentUserResponse = await api.graphql.query<
        CurrentUserQuery,
        CurrentUserQueryVariables
      >({
        query: CURRENT_USER_QUERY,
        variables: {},
      });

      for (const privilege of currentUserResponse.data.currentUser.privilege) {
        if (privilege.group === 'POST') {
          if (privilege.name === 'CREATE') {
            createFlag = true;
          } else if (privilege.name === 'UPDATE') {
            updateFlag = true;
          } else if (privilege.name === 'DELETE') {
            deleteFlag = true;
          }
        }
      }
    });

    test(`Create Post as ${userTypeRole} with wrong authorId`, async () => {
      if (!user) return;
      if (createFlag) {
        const createPostResponse = await api.graphql.mutate<
          CreatePostMutation,
          CreatePostMutationVariables
        >({
          mutation: CREATE_POST_MUTATION,
          variables: {
            createPostInput: {
              authorId: crypto.randomUUID(),
              content: content,
              published: faker.datatype.boolean(),
              title: title,
            },
          },
        });

        if (!createPostResponse.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(createPostResponse.errors[0].message).toContain(
          'Foreign key constraint failed on the field: `Post_authorId_fkey (index)`',
        );
      }
    });

    test(`Create Post as ${userTypeRole} with blank title`, async () => {
      if (!user) return;
      if (createFlag) {
        const createPostResponse = await api.graphql.mutate<
          CreatePostMutation,
          CreatePostMutationVariables
        >({
          mutation: CREATE_POST_MUTATION,
          variables: {
            createPostInput: {
              authorId: user.id,
              content: '',
              published: faker.datatype.boolean(),
              title: '',
            },
          },
        });

        if (!createPostResponse.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(createPostResponse.errors[0].message).toBe(
          'Title cannot be blank',
        );
      }
    });

    test(`Get post as ${userTypeRole}`, async () => {
      if (postId) {
        const getPost = await api.graphql.query<
          GetPostQuery,
          GetPostQueryVariables
        >({
          query: GET_POST_QUERY,
          variables: {
            getPostInput: {
              id: crypto.randomUUID(),
            },
          },
        });
        if (!getPost.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(getPost.errors[0].message).toBe('Post not found');
      }
    });

    test(`Get post list as ${userTypeRole}`, async () => {
      if (updateFlag) {
        const postList = await api.graphql.query<
          GetPostListQuery,
          GetPostListQueryVariables
        >({
          query: GET_POST_LIST_QUERY,
          variables: {},
        });

        postId = sample(postList.data.getPostList.posts)?.id;
      }
    });

    test('Update Post with wrong post id', async () => {
      if (!postId) return;

      if (updateFlag) {
        const updatePostResponse = await api.graphql.mutate<
          UpdatePostMutation,
          UpdatePostMutationVariables
        >({
          mutation: UPDATE_POST_MUTATION,
          variables: {
            postId: crypto.randomUUID(),
            updatePostInput: {
              content: '',
              published: faker.datatype.boolean(),
              title: title,
            },
          },
        });

        if (!updatePostResponse.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(updatePostResponse.errors[0].message).toContain(
          'An operation failed because it depends on one or more records that were required but not found',
        );
      }
    });

    test('Update Post with blank title', async () => {
      if (!postId) return;

      if (updateFlag) {
        const updatePostResponse = await api.graphql.mutate<
          UpdatePostMutation,
          UpdatePostMutationVariables
        >({
          mutation: UPDATE_POST_MUTATION,
          variables: {
            postId: postId,
            updatePostInput: {
              content: '',
              published: faker.datatype.boolean(),
              title: '',
            },
          },
        });

        if (!updatePostResponse.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(updatePostResponse.errors[0].message).toContain(
          'Title cannot be blank',
        );
      }
    });

    test(`Delete post as ${userTypeRole} with wrong id`, async () => {
      if (!postId) return;

      if (deleteFlag) {
        const deletePostResponse = await api.graphql.mutate<
          DeletePostMutation,
          DeletePostMutationVariables
        >({
          mutation: DELETE_POST_MUTATION,
          variables: {
            postDeleteInput: {
              id: crypto.randomUUID(),
              fromStash: false,
            },
          },
        });

        if (!deletePostResponse.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(deletePostResponse.errors[0].message).toContain(
          'Post not found',
        );
      }
    });
  });
});
