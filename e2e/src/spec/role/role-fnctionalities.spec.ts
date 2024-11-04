import { PrismaClient, User, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { appEnv } from '../../lib/app-env';
import { PRIVILEGE_LIST } from '../../graphql/privilege-list-query.gql';
import {
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
  UpdateRoleMutation,
  UpdateRoleMutationVariables,
} from '../../gql/graphql';
import { sample } from 'lodash';
import { CREATE_ROLE_MUTATION } from '../../graphql/create-role-mutation.gql';
import { UPDATE_ROLE_MUTATION } from '../../graphql/update-role-mutation.gql';
import { GET_ROLE_QUERY } from '../../graphql/get-role-query.gql';
import { GET_ROLE_LIST_QUERY } from '../../graphql/get-role-list-query.gql';
import { DELETE_ROLE_MUTATION } from '../../graphql/delete-role-muutation.gql';
import { faker } from '@faker-js/faker';

[UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
  describe(`Role functionalities for user : ${type}`, () => {
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
    let roleId: string | undefined;
    const title = faker.lorem.word();
    const titleUpdated = faker.lorem.word();
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

    test(`View list of privileges for user - ${type}`, async () => {
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

      for (
        let i = 0;
        i < privilegeList.data.listBasePrivilege.privilege.length;
        i++
      ) {
        randomPrivilege = sample(
          privilegeList.data.listBasePrivilege.privilege,
        );
        randomPrivilege2 = sample(
          privilegeList.data.listBasePrivilege.privilege,
        );
        if (randomPrivilege?.id !== randomPrivilege2?.id) {
          break;
        }
      }
    });

    test(`Create Role for ${type}`, async () => {
      if (randomPrivilege) {
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
        roleId = createRoleResponse.data?.createRole.id;
        expect(roleId).toBeDefined();
      }
    });

    test(`Get Role for user ${type}`, async () => {
      if (roleId) {
        const getRoleResponse = await api.graphql.query<
          GetRoleQuery,
          GetRoleQueryVariables
        >({
          query: GET_ROLE_QUERY,
          variables: {
            roleGetInput: {
              id: roleId,
            },
          },
        });
        expect(getRoleResponse.data.getRole.id).toBe(roleId);
        expect(getRoleResponse.data.getRole.privilege[0].id).toBe(
          randomPrivilege?.id,
        );
      }
    });

    test(`Update role for user : ${type}`, async () => {
      if (randomPrivilege && randomPrivilege2 && roleId) {
        const updateRole = await api.graphql.mutate<
          UpdateRoleMutation,
          UpdateRoleMutationVariables
        >({
          mutation: UPDATE_ROLE_MUTATION,
          variables: {
            roleUpdateInput: {
              id: roleId,
              title: titleUpdated,
              createPrivileges: [randomPrivilege2.id],
              removePrivileges: [randomPrivilege.id],
            },
          },
        });

        expect(updateRole.data?.updateRole.id).toBe(roleId);
      }
    });

    test(`Role list for user - ${type}`, async () => {
      const roleList = await api.graphql.query<
        RoleListQuery,
        RoleListQueryVariables
      >({
        query: GET_ROLE_LIST_QUERY,
        variables: {},
      });

      roleList.data.roleList.role.forEach((role) => {
        expect(role.id).toBeDefined();
        expect(role.name).toBeDefined();
        expect(role.title).toBeDefined();
      });

      const addedRole = roleList.data.roleList.role.find(
        (role) => role.id === roleId,
      );
      expect(addedRole?.title).toBe(titleUpdated);
    });

    test(`Delete role for user - ${type} not from stash`, async () => {
      if (roleId) {
        const deleteRole = await api.graphql.mutate<
          DeleteRoleMutation,
          DeleteRoleMutationVariables
        >({
          mutation: DELETE_ROLE_MUTATION,
          variables: {
            roleDeleteInput: {
              id: roleId,
              fromStash: false,
            },
          },
        });
        expect(deleteRole.data?.deleteRole).toBe(true);
      }
    });

    test(`Delete role for user - ${type} from stash`, async () => {
      if (roleId) {
        const deleteRole = await api.graphql.mutate<
          DeleteRoleMutation,
          DeleteRoleMutationVariables
        >({
          mutation: DELETE_ROLE_MUTATION,
          variables: {
            roleDeleteInput: {
              id: roleId,
              fromStash: true,
            },
          },
        });
        expect(deleteRole.data?.deleteRole).toBe(true);

        const dbClient = new PrismaClient();
        const roleDeleted = await dbClient.role.findUnique({
          where: {
            id: roleId,
          },
        });
        expect(roleDeleted).toBe(null);
      }
    });
  });

  test(`Assign role check`, async () => {});

  test(`Unassign role check`, async () => {});
});
