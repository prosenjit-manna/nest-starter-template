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
  RoleListQuery,
  RoleListQueryVariables,
  RoleQuery,
  RoleQueryVariables,
  UnAssignRoleMutation,
  UnAssignRoleMutationVariables,
  UpdateRoleMutation,
  UpdateRoleMutationVariables,
} from '../../gql/graphql';
import { CREATE_ROLE_MUTATION } from '../../graphql/create-role-mutation.gql';
import { UPDATE_ROLE_MUTATION } from '../../graphql/update-role-mutation.gql';
import { GET_ROLE_QUERY } from '../../graphql/get-role-query.gql';
import { GET_ROLE_LIST_QUERY } from '../../graphql/get-role-list-query.gql';
import { DELETE_ROLE_MUTATION } from '../../graphql/delete-role-mutation.gql';
import { faker } from '@faker-js/faker';
import { PRIVILEGE_LIST } from '../../graphql/privilege-list-query.gql';
import { sample } from 'lodash';
import { ASSIGN_ROLE_MUTATION } from '../../graphql/assign-role-mutation.gql';
import { UNASSIGN_ROLE_MUTATION } from '../../graphql/unassign-role-mutation.gql';

[UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
  describe(`Role negative testing functionalities for user : ${type} - NST-37`, () => {
    let user: User | null;
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
    const title = faker.lorem.word();
    let roleId: string | undefined;
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
    });

    test(`Create Role for ${type} with wrong privilege id`, async () => {
      const createRoleResponse = await api.graphql.mutate<
        CreateRoleMutation,
        CreateRoleMutationVariables
      >({
        mutation: CREATE_ROLE_MUTATION,
        variables: {
          roleCreateInput: {
            title,
            privileges: [crypto.randomUUID()],
          },
        },
      });
      if (!createRoleResponse.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      expect(createRoleResponse.errors[0].message).toContain(
        'Foreign key constraint failed on the field: `RolePrivilege_privilegeId_fkey (index)`',
      );
    });

    test(`Create Role for ${type} with blank title`, async () => {
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
              title: '',
              privileges: [randomPrivilege.id],
            },
          },
        });
        if (!createRoleResponse.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(createRoleResponse.errors[0].message).toContain(
          'title should not be empty',
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

      roleList.data.roleList.role.forEach((role) => {
        expect(role.id).toBeDefined();
        expect(role.name).toBeDefined();
        expect(role.title).toBeDefined();
      });
      roleId = sample(roleList.data.roleList.role)?.id;
    });

    test(`Update role for user : ${type} with blank title`, async () => {
      if (randomPrivilege && roleId) {
        const updateRole = await api.graphql.mutate<
          UpdateRoleMutation,
          UpdateRoleMutationVariables
        >({
          mutation: UPDATE_ROLE_MUTATION,
          variables: {
            roleUpdateInput: {
              id: roleId,
              title: '',
              createPrivileges: [],
              removePrivileges: [randomPrivilege.id],
            },
          },
        });

        if (!updateRole.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(updateRole.errors[0].message).toContain(
          'title should not be empty',
        );
      } else {
        throw new Error(
          'Random privilege id and created role id not found! The role list fetch might have failed!',
        );
      }
    });

    test(`Update role for user : ${type} with wrong privilege id`, async () => {
      if (!roleId) return;
      const updateRole = await api.graphql.mutate<
        UpdateRoleMutation,
        UpdateRoleMutationVariables
      >({
        mutation: UPDATE_ROLE_MUTATION,
        variables: {
          roleUpdateInput: {
            id: roleId,
            title: faker.lorem.word(),
            createPrivileges: [crypto.randomUUID()],
            removePrivileges: [],
          },
        },
      });

      if (!updateRole.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      expect(updateRole.errors[0].message).toContain(
        'Foreign key constraint failed on the field: `RolePrivilege_privilegeId_fkey (index)`',
      );
    });

    test(`Update role for user : ${type} with wrong role id`, async () => {
      if (!randomPrivilege) return;
      const updateRole = await api.graphql.mutate<
        UpdateRoleMutation,
        UpdateRoleMutationVariables
      >({
        mutation: UPDATE_ROLE_MUTATION,
        variables: {
          roleUpdateInput: {
            id: crypto.randomUUID(),
            title: faker.lorem.word(),
            createPrivileges: [randomPrivilege?.id],
            removePrivileges: [],
          },
        },
      });

      if (!updateRole.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      expect(updateRole.errors[0].message).toContain(
        'Record to update not found',
      );
    });

    test(`Get Role for user ${type} with wrong role id`, async () => {
      const getRoleResponse = await api.graphql.query<
        GetRoleQuery,
        GetRoleQueryVariables
      >({
        query: GET_ROLE_QUERY,
        variables: {
          roleGetInput: {
            id: crypto.randomUUID(),
          },
        },
      });

      if (!getRoleResponse.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      expect(getRoleResponse.errors[0].message).toContain('Role not found');
    });

    test(`Delete role for user - ${type} not from stash with wrong role id`, async () => {
      const deleteRole = await api.graphql.mutate<
        DeleteRoleMutation,
        DeleteRoleMutationVariables
      >({
        mutation: DELETE_ROLE_MUTATION,
        variables: {
          roleDeleteInput: {
            id: crypto.randomUUID(),
            fromStash: false,
          },
        },
      });

      if (!deleteRole.errors) {
        throw new Error('Expected an error, but none was returned');
      }
      expect(deleteRole.errors[0].message).toContain('Role not found');
    });

    test('Assign the role with a wrong role id', async () => {
      if (user) {
        const assignRole = await api.graphql.mutate<
          AssignRoleMutation,
          AssignRoleMutationVariables
        >({
          mutation: ASSIGN_ROLE_MUTATION,
          variables: {
            assignRoleInput: {
              roleId: crypto.randomUUID(),
              userId: user?.id,
            },
          },
        });

        if (!assignRole.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(assignRole.errors[0].message).toContain(
          'Foreign key constraint failed on the field: `UserRole_roleId_fkey (index)`',
        );
      } else {
        throw new Error(
          'User ID not found! User list might not have been fetched properly',
        );
      }
    });

    test('Assign the role with a wrong user id', async () => {
      if (roleId) {
        const assignRole = await api.graphql.mutate<
          AssignRoleMutation,
          AssignRoleMutationVariables
        >({
          mutation: ASSIGN_ROLE_MUTATION,
          variables: {
            assignRoleInput: {
              roleId,
              userId: crypto.randomUUID(),
            },
          },
        });

        if (!assignRole.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(assignRole.errors[0].message).toContain(
          'Foreign key constraint failed on the field: `UserRole_userId_fkey (index)`',
        );
      } else {
        throw new Error(
          'Role ID not found! Role list might not have been fetched properly',
        );
      }
    });

    test('Unassign role with wrong role id', async () => {
      if (user) {
        const unAssignRole = await api.graphql.mutate<
          UnAssignRoleMutation,
          UnAssignRoleMutationVariables
        >({
          mutation: UNASSIGN_ROLE_MUTATION,
          variables: {
            unAssignRoleInput: {
              roleId: crypto.randomUUID(),
              userId: user?.id,
            },
          },
        });
        if (!unAssignRole.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(unAssignRole.errors[0].message).toContain(
          'Mentioned not assigned to the user',
        );
      } else {
        throw new Error(
          'Role ID and User ID not found! Role list and user list might not have been fetched properly',
        );
      }
    });

    test('Unassign role with wrong user id', async () => {
      if (roleId) {
        const unAssignRole = await api.graphql.mutate<
          UnAssignRoleMutation,
          UnAssignRoleMutationVariables
        >({
          mutation: UNASSIGN_ROLE_MUTATION,
          variables: {
            unAssignRoleInput: {
              roleId,
              userId: crypto.randomUUID(),
            },
          },
        });
        if (!unAssignRole.errors) {
          throw new Error('Expected an error, but none was returned');
        }
        expect(unAssignRole.errors[0].message).toContain(
          'Mentioned not assigned to the user',
        );
      } else {
        throw new Error(
          'Role ID and User ID not found! Role list and user list might not have been fetched properly',
        );
      }
    });
  });
});
