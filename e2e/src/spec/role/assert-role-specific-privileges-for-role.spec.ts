import { PrismaClient, User, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { appEnv } from '../../lib/app-env';
import {
  AssignRoleMutation,
  AssignRoleMutationVariables,
  CreateRoleMutation,
  CreateRoleMutationVariables,
  DeleteRoleMutation,
  DeleteRoleMutationVariables,
  GetRoleQuery,
  GetRoleQueryVariables,
  GetUsersQuery,
  GetUsersQueryVariables,
  RoleListQuery,
  RoleListQueryVariables,
  RoleQuery,
  RoleQueryVariables,
  UnAssignRoleMutation,
  UnAssignRoleMutationVariables,
  UpdateRoleMutation,
  UpdateRoleMutationVariables,
} from '../../gql/graphql';
import { USER_LIST } from '../../graphql/get-user-list.gql';
import { GET_ROLE_LIST_QUERY } from '../../graphql/get-role-list-query.gql';
import { ASSIGN_ROLE_MUTATION } from '../../graphql/assign-role-mutation.gql';
import { UNASSIGN_ROLE_MUTATION } from '../../graphql/unassign-role-mutation.gql';
import { sample } from 'lodash';
import { GET_ROLE_QUERY } from '../../graphql/get-role-query.gql';
import { PRIVILEGE_LIST } from '../../graphql/privilege-list-query.gql';
import { CREATE_ROLE_MUTATION } from '../../graphql/create-role-mutation.gql';
import { faker } from '@faker-js/faker';
import { UPDATE_ROLE_MUTATION } from '../../graphql/update-role-mutation.gql';
import { DELETE_ROLE_MUTATION } from '../../graphql/delete-role-mutation.gql';
import { GraphQLError } from 'graphql';

[UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
  describe(`Assertions based on role specific privileges after assigning to the user: ${type}`, () => {
    let loginUser: User | null;
    let user: User | null;
    let roleId: string | undefined;
    let userId: string | undefined;
    let randomPrivilege:
      | {
          name: string;
          group: string;
          id: string;
          type: string;
          createdAt: string;
          updatedAt: string;
          deletedAt?: any;
        }
      | undefined;
    let randomPrivilege2:
      | {
          name: string;
          group: string;
          id: string;
          type: string;
          createdAt: string;
          updatedAt: string;
          deletedAt?: any;
        }
      | undefined;
    const title = faker.lorem.word();
    const titleUpdated = faker.lorem.word();
    let createdRoleId: string | undefined;
    const api = new GraphQlApi();
    const dbClient = new PrismaClient();

    test(`Login as a ${type.toUpperCase()} `, async () => {
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

    test('Fetch user list and store the user ID', async () => {
      user = await dbClient.user.findFirst({
        where: {
          userType: UserType.USER,
          isVerified: true,
        },
      });

      const userList = await api.graphql.query<
        GetUsersQuery,
        GetUsersQueryVariables
      >({
        query: USER_LIST,
      });

      expect(userList.data.getUsers.length).toBeGreaterThan(0);

      const userToBeAssigned = userList.data.getUsers.find(
        (getUser) => getUser.email === user?.email,
      );
      userId = userToBeAssigned?.id;
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

      const roleToBeAssigned = roleList.data.roleList.role.find(
        (role) => role.name === type,
      );
      roleId = roleToBeAssigned?.id;
    });

    test(`Assign the ${type} role to the user`, async () => {
      if (roleId && userId) {
        const assignRole = await api.graphql.mutate<
          AssignRoleMutation,
          AssignRoleMutationVariables
        >({
          mutation: ASSIGN_ROLE_MUTATION,
          variables: {
            assignRoleInput: {
              roleId,
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

    test(`View the list of privileges for user - ${type}`, async () => {
      const privilegeList = await api.graphql.query<
        RoleQuery,
        RoleQueryVariables
      >({
        query: PRIVILEGE_LIST,
        variables: {},
      });

      expect(
        privilegeList.data.listBasePrivilege.privilege.length,
      ).toBeGreaterThan(0);

      privilegeList.data.listBasePrivilege.privilege.forEach((privilege) => {
        expect(privilege.id).toBeDefined();
        expect(privilege.group).toBeDefined();
        expect(privilege.name).toBeDefined();
      });

      randomPrivilege = sample(privilegeList.data.listBasePrivilege.privilege);
      randomPrivilege2 = sample(privilegeList.data.listBasePrivilege.privilege);

      for (const privilege of privilegeList.data.listBasePrivilege.privilege) {
        if (
          randomPrivilege?.id === randomPrivilege2?.id &&
          randomPrivilege2?.name === 'UPDATE'
        )
          randomPrivilege2 = privilege;
        else break;
      }
    });

    test(`Create Role for ${type}`, async () => {
      if (!randomPrivilege) {
        throw new Error(
          'Random privilege id not found! The privilege list fetch might have failed!',
        );
      } else {
        const createRoleResponse = await api.graphql.mutate<
          CreateRoleMutation,
          CreateRoleMutationVariables
        >({
          mutation: CREATE_ROLE_MUTATION,
          variables: {
            roleCreateInput: {
              title,
              privileges: [randomPrivilege.id],
            },
          },
        });

        createdRoleId = createRoleResponse.data?.createRole.id;
        expect(createRoleResponse.data?.createRole.id).toBeDefined();
      }
    });

    test(`Role list for user - ${type}`, async () => {
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

      const addedRole = roleList.data.roleList.role.find(
        (role) => role.id === createdRoleId,
      );

      expect(createdRoleId).toBe(addedRole?.id);
      expect(title).toBe(addedRole?.title);
    });

    test(`Update role for user : ${type}`, async () => {
      if (randomPrivilege && randomPrivilege2 && createdRoleId) {
        const updateRole = await api.graphql.mutate<
          UpdateRoleMutation,
          UpdateRoleMutationVariables
        >({
          mutation: UPDATE_ROLE_MUTATION,
          variables: {
            roleUpdateInput: {
              id: createdRoleId,
              title: titleUpdated,
              createPrivileges: [randomPrivilege2.id],
              removePrivileges: [randomPrivilege.id],
            },
          },
        });

        expect(updateRole.data?.updateRole.id).toBe(createdRoleId);
      } else {
        throw new Error(
          'Random privilege id and created role id not found! The privilege list fetch and role creation might have failed!',
        );
      }
    });

    test(`Get Role for user ${type}`, async () => {
      if (createdRoleId) {
        const getRoleResponse = await api.graphql.query<
          GetRoleQuery,
          GetRoleQueryVariables
        >({
          query: GET_ROLE_QUERY,
          variables: {
            roleGetInput: {
              id: createdRoleId,
            },
          },
        });

        expect(getRoleResponse.data.getRole.id).toBe(createdRoleId);

        let flag = false;
        getRoleResponse.data.getRole.privilege.forEach((eachPrivilege) => {
          if (eachPrivilege.id === randomPrivilege2?.id) flag = true;
        });

        expect(flag).toBe(true);
      } else {
        throw new Error(
          'Created role id not found! Role creation test might have failed',
        );
      }
    });

    test(`Delete role for user - ${type} not from stash`, async () => {
      if (createdRoleId) {
        const deleteRole = await api.graphql.mutate<
          DeleteRoleMutation,
          DeleteRoleMutationVariables
        >({
          mutation: DELETE_ROLE_MUTATION,
          variables: {
            roleDeleteInput: {
              id: createdRoleId,
              fromStash: false,
            },
          },
        });

        expect(deleteRole.data?.deleteRole).toBe(true);
      } else {
        throw new Error(
          'Created role id not found! Role creation test might have failed',
        );
      }
    });

    test(`Role list for user - ${type}`, async () => {
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

      const addedRole = roleList.data.roleList.role.find(
        (role) => role.id === createdRoleId,
      );

      expect(addedRole).toBe(undefined);
    });

    test(`Delete role for user - ${type} again for assertion`, async () => {
      try {
        if (createdRoleId) {
          await api.graphql.mutate<
            DeleteRoleMutation,
            DeleteRoleMutationVariables
          >({
            mutation: DELETE_ROLE_MUTATION,
            variables: {
              roleDeleteInput: {
                id: createdRoleId,
                fromStash: false,
              },
            },
          });
        } else {
          throw new Error(
            'Created role id not found! Role creation test might have failed',
          );
        }
      } catch (error) {
        if (error instanceof GraphQLError)
          expect(error.message).toBe('Role not found');
      }
    });

    test(`Delete role for user - ${type} from stash`, async () => {
      if (createdRoleId) {
        const deleteRole = await api.graphql.mutate<
          DeleteRoleMutation,
          DeleteRoleMutationVariables
        >({
          mutation: DELETE_ROLE_MUTATION,
          variables: {
            roleDeleteInput: {
              id: createdRoleId,
              fromStash: true,
            },
          },
        });

        expect(deleteRole.data?.deleteRole).toBe(true);

        const dbClient = new PrismaClient();
        const roleDeleted = await dbClient.role.findUnique({
          where: {
            id: createdRoleId,
          },
        });
        expect(roleDeleted).toBe(null);
      } else {
        throw new Error(
          'Created role id not found! Role creation test might have failed',
        );
      }
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
      if (roleId && userId) {
        const unAssignRole = await api.graphql.mutate<
          UnAssignRoleMutation,
          UnAssignRoleMutationVariables
        >({
          mutation: UNASSIGN_ROLE_MUTATION,
          variables: {
            unAssignRoleInput: {
              roleId,
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
  });
});
