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
    let createdRoleId: string | undefined;
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

      roleId = currentUser.data.currentUser.roles[0];

      const dbClient = new PrismaClient();
      async function fetchPrivileges() {
        for (const role of rolesForCurrentUser) {
          const privilegesForTheUser = await dbClient.rolePrivilege.findMany({
            where: { roleId: role },
          });

          privilegesForTheUser.forEach((specificPrivilege) => {
            privilegesForTheRolesOfCurrentUser.push(
              specificPrivilege.privilegeId,
            );
          });
        }
      }
      await fetchPrivileges();

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

      expect(privilegesForTheRolesOfCurrentUser).toEqual(
        expect.arrayContaining(privilegesArrayCurrentUser),
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

      if (readFlag) {
        expect(
          privilegeList.data.listBasePrivilege.privilege.length,
        ).toBeGreaterThan(0);

        privilegeList.data.listBasePrivilege.privilege.forEach((privilege) => {
          expect(privilege.id).toBeDefined();
          expect(privilege.group).toBeDefined();
          expect(privilege.name).toBeDefined();
        });

        randomPrivilege = sample(
          privilegeList.data.listBasePrivilege.privilege,
        );
        randomPrivilege2 = sample(
          privilegeList.data.listBasePrivilege.privilege,
        );

        for (const privilege of privilegeList.data.listBasePrivilege
          .privilege) {
          if (randomPrivilege?.id !== randomPrivilege2?.id) break;
          else randomPrivilege2 = privilege;
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

        if (createFlag) {
          createdRoleId = createRoleResponse.data?.createRole.id;
          expect(createRoleResponse.data?.createRole.id).toBeDefined();
        } else if (createRoleResponse.errors) {
          expect(createRoleResponse.errors[0].message).toBe(
            'Forbidden resource',
          );
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

      if (readFlag) {
        roleList.data.roleList.role.forEach((role) => {
          expect(role.id).toBeDefined();
          expect(role.name).toBeDefined();
          expect(role.title).toBeDefined();
        });
        const addedRole = roleList.data.roleList.role.find(
          (role) => role.id === roleId,
        );
        expect(roleId).toBe(addedRole?.id);
      } else if (roleList.errors) {
        expect(roleList.errors[0].message).toBe('Forbidden resource');
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
        } else if (updateRole.errors) {
          expect(updateRole.errors[0].message).toBe('Forbidden resource');
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

          let flag = false;
          getRoleResponse.data.getRole.privilege.forEach((eachPrivilege) => {
            if (eachPrivilege.id === randomPrivilege?.id) flag = true;
          });
          expect(flag).toBe(true);
        } else if (getRoleResponse.errors) {
          expect(getRoleResponse.errors[0].message).toBe('Forbidden resource');
        }
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
        if (deleteFlag) {
          expect(deleteRole.data?.deleteRole).toBe(true);
        } else if (deleteRole.errors) {
          expect(deleteRole.errors[0].message).toBe('Forbidden resource');
        }
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
        if (deleteFlag) {
          expect(deleteRole.data?.deleteRole).toBe(true);
        } else if (deleteRole.errors) {
          expect(deleteRole.errors[0].message).toBe('Forbidden resource');
        }

        const dbClient = new PrismaClient();
        const roleDeleted = await dbClient.role.findUnique({
          where: {
            id: createdRoleId,
          },
        });
        expect(roleDeleted).toBe(null);
      }
    });

    test(`Update the role back to the original state for user : ${type}`, async () => {
      if (updateFlag) {
        if (randomPrivilege && randomPrivilege2 && roleId) {
          await api.graphql.mutate<
            UpdateRoleMutation,
            UpdateRoleMutationVariables
          >({
            mutation: UPDATE_ROLE_MUTATION,
            variables: {
              roleUpdateInput: {
                id: roleId,
                title: titleUpdated,
                createPrivileges: [randomPrivilege2.id],
                removePrivileges: [],
              },
            },
          });
        }
      }
    });
  });
});
