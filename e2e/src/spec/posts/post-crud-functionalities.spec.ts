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
import { DELETE_POST_MUTATION } from '../../graphql/delete-post-mutation.gql';
import { GET_POST_QUERY } from '../../graphql/get-post-query.gql';
import { CREATE_POST_MUTATION } from '../../graphql/create-post-mutation.gql';
import { GET_POST_LIST_QUERY } from '../../graphql/get-post-list-query.gql';
import { UPDATE_POST_MUTATION } from '../../graphql/update-post-mutation.gql';
import { CURRENT_USER_QUERY } from '../../graphql/current-user.gql';
import { faker } from '@faker-js/faker';

const userArrays = [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.USER];
userArrays.forEach((userTypeRole) => {
  describe(`Post CRUD functionalities for ${userTypeRole}`, () => {
    let user: User | null;
    let postId: string | undefined;
    const content = faker.lorem.paragraph();
    const title = faker.lorem.word();
    const updatedContent = faker.lorem.paragraph();
    const updatedTitle = faker.lorem.word();
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
          } else if (privilege.name === 'DELETE') {
            deleteFlag = true;
          } else if (privilege.name === 'UPDATE') {
            updateFlag = true;
          }
        }
      }
    });

    test(`Create Post as ${userTypeRole}`, async () => {
      const dbClient = new PrismaClient()
      if (!user) return;
      if (createFlag) {
        const createPostResponse = await api.graphql.mutate<
          CreatePostMutation,
          CreatePostMutationVariables
        >({
          mutation: CREATE_POST_MUTATION,
          variables: {
            createPostInput: {
              authorId: user?.id,
              content: content,
              published: faker.datatype.boolean(),
              title: title,
              workspaceId: ''
            },
          },
        });

        const data = createPostResponse.data;
        expect(data?.createPost.id).toBeDefined();

        postId = createPostResponse.data?.createPost.id;
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
              id: postId,
            },
          },
        });

        const data = getPost.data;
        expect(data.getPost?.id).toBe(postId);
        expect(data.getPost?.content).toBe(content);
        expect(data.getPost?.title).toBe(title);
      }
    });

    test('Update Post', async () => {
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
              authorId: user?.id,
              content: updatedContent,
              published: faker.datatype.boolean(),
              title: updatedTitle,
            },
          },
        });

        const data = updatePostResponse.data;
        expect(data?.updatePost.id).toBeDefined();
      }
    });

    test(`Get post list as ${userTypeRole}`, async () => {
      if (updateFlag) {
        const postList = await api.graphql.query<
          GetPostListQuery,
          GetPostListQueryVariables
        >({
          query: GET_POST_LIST_QUERY,
          variables: {
            getPostListInput: {
              fromStash: false,
            },
          },
        });

        const data = postList.data;
        expect(data.getPostList.posts.length).toBeGreaterThan(0);

        const addedPost = data.getPostList.posts.find(
          (post) => post.id === postId,
        );
        expect(addedPost?.content).toBe(updatedContent);
        expect(addedPost?.title).toBe(updatedTitle);
      }
    });

    test(`Delete post as ${userTypeRole} not from stash`, async () => {
      if (!postId) return;

      if (deleteFlag) {
        const deletePostResponse = await api.graphql.mutate<
          DeletePostMutation,
          DeletePostMutationVariables
        >({
          mutation: DELETE_POST_MUTATION,
          variables: {
            postDeleteInput: {
              id: postId,
              fromStash: false,
            },
          },
        });
        expect(deletePostResponse.data?.deletePost).toBe(true);
      }
    });

    test(`Delete post as ${userTypeRole} from stash`, async () => {
      if (!postId) return;

      if (deleteFlag) {
        const deletePostResponse = await api.graphql.mutate<
          DeletePostMutation,
          DeletePostMutationVariables
        >({
          mutation: DELETE_POST_MUTATION,
          variables: {
            postDeleteInput: {
              id: postId,
              fromStash: true,
            },
          },
        });
        expect(deletePostResponse.data?.deletePost).toBe(true);

        const dbClient = new PrismaClient();
        const post = await dbClient.post.findUnique({
          where: {
            id: postId,
          },
        });
        expect(post).toBe(null);
      }
    });
  });
});
