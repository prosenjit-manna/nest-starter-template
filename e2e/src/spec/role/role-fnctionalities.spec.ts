import { PrismaClient, User, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { appEnv } from '../../lib/app-env';
import {
  CreateRoleMutation,
  CreateRoleMutationVariables,
  CurrentUserQuery,
  CurrentUserQueryVariables,
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
import { CREATE_ROLE_MUTATION } from '../../graphql/create-role-mutation.gql';
import { UPDATE_ROLE_MUTATION } from '../../graphql/update-role-mutation.gql';
import { GET_ROLE_QUERY } from '../../graphql/get-role-query.gql';
import { GET_ROLE_LIST_QUERY } from '../../graphql/get-role-list-query.gql';
import { DELETE_ROLE_MUTATION } from '../../graphql/delete-role-mutation.gql';
import { faker } from '@faker-js/faker';
import { CURRENT_USER_QUERY } from '../../graphql/current-user.gql';
import { PRIVILEGE_LIST } from '../../graphql/privilege-list-query.gql';
import { sample } from 'lodash';

[UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
  describe(`Role functionalities for user : ${type}`, () => {
    let user: User | null;
    let rolesForCurrentUser: string[];
    const privilegesForTheRolesOfCurrentUser: string[] = [];
    const privilegesArrayCurrentUser: string[] = [];

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
    let createFlag = false;
    let deleteFlag = false;
    let readFlag = false;
    let updateFlag = false;
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

    test(`Fetch current user roles for user - ${type}`, async () => {
      const currentUser = await api.graphql.query<
        CurrentUserQuery,
        CurrentUserQueryVariables
      >({
        query: CURRENT_USER_QUERY,
        variables: {},
      });

      expect(currentUser.data.currentUser.userType).toBe(type);
      rolesForCurrentUser = currentUser.data.currentUser.roles;

      const dbClient = new PrismaClient();
      async function fetchPrivileges() {
        for (const role of rolesForCurrentUser) {
          const privilegesForTheUser = await dbClient.rolePrivilege.findMany({
            where: { roleId: role },
          });

          privilegesForTheUser.forEach((specificPrivilege) => {
            privilegesForTheRolesOfCurrentUser.push(specificPrivilege.id);
          });
        }
      }
      await fetchPrivileges();
      console.log(privilegesForTheRolesOfCurrentUser);

      currentUser.data.currentUser.privilege.forEach((privilege) => {
        privilegesArrayCurrentUser.push(privilege.id);
        if (privilege.group === 'ROLE') {
          if (privilege.name === 'READ') {
            readFlag = true;
          } else if (privilege.name === 'UPDATE') {
            updateFlag = true;
          } else if (privilege.name === 'CREATE') {
            createFlag = true;
          } else if (privilege.name === 'DELETE') {
            deleteFlag = true;
          }
        }
      });

      privilegesArrayCurrentUser.sort();
      privilegesForTheRolesOfCurrentUser.sort();
      expect(privilegesForTheRolesOfCurrentUser).toContain(
        privilegesArrayCurrentUser,
      );
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

      for (
        let i = 0;
        i < privilegeList.data.listBasePrivilege.privilege.length;
        i++
      ) {
        if (randomPrivilege?.id !== randomPrivilege2?.id) break;
        else
          randomPrivilege2 = privilegeList.data.listBasePrivilege.privilege[i];
      }

      console.log(randomPrivilege, randomPrivilege2);
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
        if (createFlag) {
          roleId = createRoleResponse.data?.createRole.id;
          expect(roleId).toBeDefined();
        } else {
          console.log('DENIED');
          expect(createRoleResponse).toThrow('Forbidden Resource');
        }
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
      if (readFlag) {
        const addedRole = roleList.data.roleList.role.find(
          (role) => role.id === roleId,
        );
        expect(roleId).toBe(addedRole?.id);
      } else {
        expect(roleList).toThrow('Forbidden Resource');
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
              createPrivileges: [randomPrivilege.id],
              removePrivileges: [randomPrivilege2.id],
            },
          },
        });
        if (updateFlag) {
          expect(updateRole.data?.updateRole.id).toBe(roleId);
          if (randomPrivilege2.group === 'ROLE') {
            if (randomPrivilege2.name === 'READ') {
              readFlag = false;
            } else if (randomPrivilege2.name === 'UPDATE') {
              updateFlag = false;
            } else if (randomPrivilege2.name === 'CREATE') {
              createFlag = false;
            } else if (randomPrivilege2.name === 'DELETE') {
              deleteFlag = false;
            }
          }
        } else {
          expect(updateRole).toThrow('Forbidden Resource');
        }
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

        if (readFlag) {
          expect(getRoleResponse.data.getRole.id).toBe(roleId);
          expect(getRoleResponse.data.getRole.privilege[0].id).toBe(
            randomPrivilege?.id,
          );
        } else {
          expect(getRoleResponse).toThrow('Forbidden Resource');
        }
      }
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
        if (deleteFlag) {
          expect(deleteRole.data?.deleteRole).toBe(true);
        } else {
          console.log('DENIED');
          expect(deleteRole).toThrow('Forbidden Resource');
        }
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
        if (deleteFlag) {
          expect(deleteRole.data?.deleteRole).toBe(true);
        } else {
          console.log('DENIED');
          expect(deleteRole).toThrow('Forbidden Resource');
        }

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
});
