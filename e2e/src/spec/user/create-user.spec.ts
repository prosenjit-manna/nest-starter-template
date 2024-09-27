import { PrismaClient, UserType } from "@prisma/client";
import { GraphQlApi } from "../../lib/graphql-api";
import { appEnv } from "../../lib/app-env";
import { CREATE_USER } from "../../graphql/create-user.gql";
import { faker } from "@faker-js/faker";

describe('User List', () => {
  const api = new GraphQlApi();
  const UserEmail = faker.internet.userName() + '@itobuz.com';
    [UserType.ADMIN, UserType.SUPER_ADMIN].forEach((type) => {
        const dbClient = new PrismaClient();
        beforeAll(async () => {
          const user = await dbClient.user.findFirst({
            where: {
              userType: type,
            },
          });
          if (!user) {
            return;
          }
          await api.login({
            email: user.email,
            password: appEnv.SEED_PASSWORD,
          });
        });
    });
    test('Create User', async() => {
        const response = await api.graphql.mutate({
            mutation: CREATE_USER,
            variables: {
              createUserInput: {
                email: UserEmail,
                name: faker.internet.userName()
              },
            } 
          });
          expect(response.data?.createUser.id).toBeDefined();
    });

    test('Search new user in user list and exist', () => {
       
    });
});