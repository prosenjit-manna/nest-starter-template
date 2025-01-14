import { PrismaClient, User, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { appEnv } from '../../lib/app-env';
import {
  AssignRoleMutation,
  AssignRoleMutationVariables,
  CurrentUserQuery,
  CurrentUserQueryVariables,
  GetRoleQuery,
  GetRoleQueryVariables,
  GetUsersQuery,
  GetUsersQueryVariables,
  RoleListQuery,
  RoleListQueryVariables,
  UnAssignRoleMutation,
  UnAssignRoleMutationVariables,
} from '../../gql/graphql';
import { USER_LIST } from '../../graphql/get-user-list.gql';
import { GET_ROLE_LIST_QUERY } from '../../graphql/get-role-list-query.gql';
import { CURRENT_USER_QUERY } from '../../graphql/current-user.gql';
import { ASSIGN_ROLE_MUTATION } from '../../graphql/assign-role-mutation.gql';
import { UNASSIGN_ROLE_MUTATION } from '../../graphql/unassign-role-mutation.gql';
import { sample } from 'lodash';
import { GET_ROLE_QUERY } from '../../graphql/get-role-query.gql';

[UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
  describe(`Assign Role functionalities for user : ${type}`, () => {
    let dbUser: User | null;
    let user: User | null;
    let roleId: string | undefined;
    let userId: string | undefined;
    let privilegeArrayForCurrentUser: string[] | undefined;
    let privilegeArrayForAllRoles: string[] | undefined;
    let rolesArray: string[] | undefined;
    const api = new GraphQlApi();
    const dbClient = new PrismaClient();

    test(`Login as a ${type.toUpperCase()} `, async () => {
      dbUser = await dbClient.user.findFirst({
        where: {
          userType: type,
          isVerified: true,
        },
      });
      if (!dbUser) {
        return;
      }
      const response = await api.login({
        email: dbUser.email,
        password: appEnv.SEED_PASSWORD,
      });
      expect(response.data).toBeDefined();
    });

    //This test NST-60 has issue
    test('Fetch user list and store the user ID ', async () => {
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
        variables: {
          getUsersInput: {
            search: '',
          },
        },
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

      roleId = sample(roleList.data.roleList.role)?.id;
    });

    test('Assign the random role to the user', async () => {
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

    test(`Fetch current user roles for user - ${type}`, async () => {
      async function currentUserInfo() {
        const currentUser = await api.graphql.query<
          CurrentUserQuery,
          CurrentUserQueryVariables
        >({
          query: CURRENT_USER_QUERY,
          variables: {},
        });
        const roles: string[] = [];
        currentUser.data.currentUser.roles.forEach((role) => {
          roles?.push(role);
        });
        const privileges: string[] = [];
        currentUser.data.currentUser.privilege.forEach((privilege) => {
          privileges?.push(privilege.id);
        });
        expect(currentUser.data.currentUser.userType).toBe(UserType.USER);
        expect(currentUser.data.currentUser.roles).toContain(roleId);

        return { roles, privileges };
      }

      const response = await currentUserInfo();
      rolesArray = response.roles;
      privilegeArrayForCurrentUser = response.privileges;
    });

    test('Login with the user which can unassign role', async () => {
      if (dbUser) {
        const response = await api.login({
          email: dbUser.email,
          password: appEnv.SEED_PASSWORD,
        });
        expect(response.data).toBeDefined();
      }
    });

    test('Assert the multiple role privileges', async () => {
      async function fetchPrivilege() {
        const privileges: string[] = [];
        if (rolesArray) {
          for (const role of rolesArray) {
            const getRoleResponse = await api.graphql.query<
              GetRoleQuery,
              GetRoleQueryVariables
            >({
              query: GET_ROLE_QUERY,
              variables: {
                roleGetInput: {
                  id: role,
                },
              },
            });

            getRoleResponse.data.getRole.privilege.forEach((privilege) => {
              privileges?.push(privilege.id);
            });
          }
          return privileges;
        }
      }
      privilegeArrayForAllRoles = await fetchPrivilege();

      privilegeArrayForAllRoles?.sort();
      privilegeArrayForCurrentUser?.sort();
      expect(privilegeArrayForAllRoles).toStrictEqual(
        privilegeArrayForCurrentUser,
      );
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

    test('Login with the assigned user again', async () => {
      if (user) {
        const response = await api.login({
          email: user.email,
          password: appEnv.SEED_PASSWORD,
        });
        expect(response.data).toBeDefined();
      }
    });

    test(`Fetch current user roles for user - ${type}`, async () => {
      const currentUser = await api.graphql.query<
        CurrentUserQuery,
        CurrentUserQueryVariables
      >({
        query: CURRENT_USER_QUERY,
        variables: {},
      });

      expect(currentUser.data.currentUser.userType).toBe(UserType.USER);
      expect(currentUser.data.currentUser.roles).not.toContain(roleId);
    });
  });
});
