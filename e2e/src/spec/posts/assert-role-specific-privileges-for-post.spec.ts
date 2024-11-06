import { PrismaClient, User, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { appEnv } from '../../lib/app-env';
import {
  AssignRoleMutation,
  AssignRoleMutationVariables,
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
  RoleListQuery,
  RoleListQueryVariables,
  UnAssignRoleMutation,
  UnAssignRoleMutationVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
  UpdateRoleMutation,
  UpdateRoleMutationVariables,
} from '../../gql/graphql';
import { GET_ROLE_LIST_QUERY } from '../../graphql/get-role-list-query.gql';
import { ASSIGN_ROLE_MUTATION } from '../../graphql/assign-role-mutation.gql';
import { UNASSIGN_ROLE_MUTATION } from '../../graphql/unassign-role-mutation.gql';
import { faker } from '@faker-js/faker';
import { CURRENT_USER_QUERY } from '../../graphql/current-user.gql';
import { UPDATE_ROLE_MUTATION } from '../../graphql/update-role-mutation.gql';
import { CREATE_POST_MUTATION } from '../../graphql/create-post-mutation.gql';
import { GET_POST_QUERY } from '../../graphql/get-post-query.gql';
import { UPDATE_POST_MUTATION } from '../../graphql/update-post-mutation.gql';
import { GET_POST_LIST_QUERY } from '../../graphql/get-post-list-query.gql';
import { DELETE_POST_MUTATION } from '../../graphql/delete-post-mutation.gql';
import { GraphQLError } from 'graphql';

[UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
  describe(`Assertions based on role specific privileges after assigning to the user: ${type}`, () => {
    let loginUser: User | null;
    let user: User | null;
    let userRoleId: string | undefined;
    let roleIdToBeAssigned: string | undefined;
    let userId: string | undefined;
    let postId: string | undefined;
    const content = faker.lorem.paragraph();
    const title = faker.lorem.word();
    const updatedContent = faker.lorem.paragraph();
    const updatedTitle = faker.lorem.word();
    let userPrivilegesArray: string[] | undefined = [];
    const titleUpdated = faker.lorem.word();
    const api = new GraphQlApi();
    const dbClient = new PrismaClient();

    test('Login with the user', async () => {
      user = await dbClient.user.findFirst({
        where: {
          userType: UserType.USER,
          isVerified: true,
        },
      });
      if (user) {
        const response = await api.login({
          email: user.email,
          password: appEnv.SEED_PASSWORD,
        });
        expect(response.data).toBeDefined();
      }
    });

    test(`Fetch current user privileges for user - ${type}`, async () => {
      async function currentUserInfo() {
        const currentUser = await api.graphql.query<
          CurrentUserQuery,
          CurrentUserQueryVariables
        >({
          query: CURRENT_USER_QUERY,
          variables: {},
        });

        userId = currentUser.data.currentUser.id;

        const privileges: string[] = [];
        currentUser.data.currentUser.privilege.forEach((privilege) => {
          if (privilege.group === 'POST') privileges?.push(privilege.id);
        });

        return privileges;
      }

      userPrivilegesArray = await currentUserInfo();
    });

    test(`Login as a ${type} `, async () => {
      loginUser = await dbClient.user.findFirst({
        where: {
          userType: type,
          isVerified: true,
        },
      });
      if (!loginUser) {
        return;
      }
      const response = await api.login({
        email: loginUser.email,
        password: appEnv.SEED_PASSWORD,
      });
      expect(response.data).toBeDefined();
    });

    test(`Fetch the role list and store the role ID - ${type}`, async () => {
      const roleList = await api.graphql.query<
        RoleListQuery,
        RoleListQueryVariables
      >({
        query: GET_ROLE_LIST_QUERY,
        variables: {
          roleListInput: {
            fromStash: false,
          },
        },
      });

      roleList.data.roleList.role.forEach((role) => {
        expect(role.id).toBeDefined();
        expect(role.name).toBeDefined();
        expect(role.title).toBeDefined();
      });

      const userRole = roleList.data.roleList.role.find(
        (role) => role.name === UserType.USER,
      );
      userRoleId = userRole?.id;
    });

    test(`Update role for user : ${type}`, async () => {
      if (userPrivilegesArray && userRoleId) {
        const updateRole = await api.graphql.mutate<
          UpdateRoleMutation,
          UpdateRoleMutationVariables
        >({
          mutation: UPDATE_ROLE_MUTATION,
          variables: {
            roleUpdateInput: {
              id: userRoleId,
              title: titleUpdated,
              createPrivileges: [],
              removePrivileges: userPrivilegesArray,
            },
          },
        });

        expect(updateRole.data?.updateRole.id).toBe(userRoleId);
      } else {
        throw new Error(
          'Random privilege id and created role id not found! The privilege list fetch and role creation might have failed!',
        );
      }
    });

    test('Login with the user', async () => {
      if (user) {
        const response = await api.login({
          email: user.email,
          password: appEnv.SEED_PASSWORD,
        });
        expect(response.data).toBeDefined();
      }
    });

    test(`Create Post as USER`, async () => {
      try {
        if (!user) return;
        await api.graphql.mutate<
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
            },
          },
        });
      } catch (error) {
        if (error instanceof GraphQLError)
          expect(error.message).toBe('Forbidden resource');
      }
    });

    test(`Login as a ${type.toUpperCase()} `, async () => {
      if (loginUser) {
        const response = await api.login({
          email: loginUser.email,
          password: appEnv.SEED_PASSWORD,
        });
        expect(response.data).toBeDefined();
      }
    });

    test(`Fetch the role list and store the role ID - ${type}`, async () => {
      const roleList = await api.graphql.query<
        RoleListQuery,
        RoleListQueryVariables
      >({
        query: GET_ROLE_LIST_QUERY,
        variables: {
          roleListInput: {
            fromStash: false,
          },
        },
      });

      const userRole = roleList.data.roleList.role.find(
        (role) => role.name === type,
      );
      roleIdToBeAssigned = userRole?.id;
    });

    test(`Assign the ${type} role to the user`, async () => {
      if (roleIdToBeAssigned && userId) {
        const assignRole = await api.graphql.mutate<
          AssignRoleMutation,
          AssignRoleMutationVariables
        >({
          mutation: ASSIGN_ROLE_MUTATION,
          variables: {
            assignRoleInput: {
              roleId: roleIdToBeAssigned,
              userId,
            },
          },
        });

        expect(assignRole.data?.assignRole.success).toBe(true);
      } else {
        throw new Error(
          'Role ID and User ID not found! Role list and user list might not have been fetched properly',
        );
      }
    });

    test('Login with the assigned user', async () => {
      if (user) {
        const response = await api.login({
          email: user.email,
          password: appEnv.SEED_PASSWORD,
        });
        expect(response.data).toBeDefined();
      }
    });

    test(`Create Post as USER`, async () => {
      if (!user) return;
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
          },
        },
      });

      const data = createPostResponse.data;
      expect(data?.createPost.id).toBeDefined();

      postId = createPostResponse.data?.createPost.id;
    });

    test(`Get post as USER`, async () => {
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

    test('Update Post as USER', async () => {
      if (!postId) return;

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
    });

    test(`Get post list as USER`, async () => {
      const postList = await api.graphql.query<
        GetPostListQuery,
        GetPostListQueryVariables
      >({
        query: GET_POST_LIST_QUERY,
        variables: {},
      });

      const data = postList.data;
      expect(data.getPostList.posts.length).toBeGreaterThan(0);

      const addedPost = data.getPostList.posts.find(
        (post) => post.id === postId,
      );
      expect(addedPost?.content).toBe(updatedContent);
      expect(addedPost?.title).toBe(updatedTitle);
    });

    test(`Delete post as USER not from stash`, async () => {
      if (!postId) return;

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
    });

    test(`Delete post as USER from stash`, async () => {
      if (!postId) return;

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
    });

    test('Login with the user which can unassign role', async () => {
      if (loginUser) {
        const response = await api.login({
          email: loginUser.email,
          password: appEnv.SEED_PASSWORD,
        });
        expect(response.data).toBeDefined();
      }
    });

    test('Unassign role which has been created', async () => {
      if (roleIdToBeAssigned && userId) {
        const unAssignRole = await api.graphql.mutate<
          UnAssignRoleMutation,
          UnAssignRoleMutationVariables
        >({
          mutation: UNASSIGN_ROLE_MUTATION,
          variables: {
            unAssignRoleInput: {
              roleId: roleIdToBeAssigned,
              userId,
            },
          },
        });
        expect(unAssignRole.data?.unAssignRole.success).toBe(true);
      } else {
        throw new Error(
          'Role ID and User ID not found! Role list and user list might not have been fetched properly',
        );
      }
    });

    test(`Update role for user : ${type}`, async () => {
      if (userPrivilegesArray && userRoleId) {
        const updateRole = await api.graphql.mutate<
          UpdateRoleMutation,
          UpdateRoleMutationVariables
        >({
          mutation: UPDATE_ROLE_MUTATION,
          variables: {
            roleUpdateInput: {
              id: userRoleId,
              title: titleUpdated,
              createPrivileges: userPrivilegesArray,
              removePrivileges: [],
            },
          },
        });

        expect(updateRole.data?.updateRole.id).toBe(userRoleId);
      } else {
        throw new Error(
          'Random privilege id and created role id not found! The privilege list fetch and role creation might have failed!',
        );
      }
    });
  });
});
