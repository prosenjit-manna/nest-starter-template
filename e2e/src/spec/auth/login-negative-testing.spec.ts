import { GraphQlApi } from '../../lib/graphql-api';
import { faker } from '@faker-js/faker';
import { appEnv } from '../../lib/app-env';
import { PrismaClient, UserType } from '@prisma/client';
import { LOGIN_QUERY } from '../../graphql/login-query.gql';
import { LoginQuery, LoginQueryVariables } from '../../gql/graphql';

describe('Login module negative testing', () => {
  const api = new GraphQlApi();

  test(`Login with verified user`, async () => {
    const loginResponse = await api.graphql.query<
      LoginQuery,
      LoginQueryVariables
    >({
      query: LOGIN_QUERY,
      variables: {
        loginInput: {
          email: 'soumabha+bro@itobuz.com',
          password: appEnv.SEED_PASSWORD,
        },
      },
    });
    if (!loginResponse.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(loginResponse.errors[0].message).toBe('Invalid email or password');
  });

  test(`Login with only email and blank password`, async () => {
    const dbClient = new PrismaClient();
    const user = await dbClient.user.findFirst({
      where: {
        userType: UserType.ADMIN,
      },
    });
    if (!user) {
      return;
    }

    const loginResponse = await api.graphql.query<
      LoginQuery,
      LoginQueryVariables
    >({
      query: LOGIN_QUERY,
      variables: {
        loginInput: { email: 'soumabha+bro@itobuz.com', password: '' },
      },
    });
    if (!loginResponse.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(loginResponse.errors[0].message).toBe('Invalid email or password');
  });

  test(`Login with only password and blank email`, async () => {
    const loginResponse = await api.graphql.query<
      LoginQuery,
      LoginQueryVariables
    >({
      query: LOGIN_QUERY,
      variables: {
        loginInput: { email: '', password: appEnv.SEED_PASSWORD },
      },
    });
    if (!loginResponse.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(loginResponse.errors[0].message).toBe('Invalid email or password');
  });

  test(`Login with blank values in all fields`, async () => {
    const loginResponse = await api.graphql.query<
      LoginQuery,
      LoginQueryVariables
    >({
      query: LOGIN_QUERY,
      variables: {
        loginInput: { email: '', password: '' },
      },
    });
    if (!loginResponse.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(loginResponse.errors[0].message).toBe('Invalid email or password');
  });

  test(`Login with invalid email format`, async () => {
    const loginResponse = await api.graphql.query<
      LoginQuery,
      LoginQueryVariables
    >({
      query: LOGIN_QUERY,
      variables: {
        loginInput: { email: 'abcd', password: appEnv.SEED_PASSWORD },
      },
    });
    if (!loginResponse.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(loginResponse.errors[0].message).toBe('Invalid email or password');
  });

  test(`Login with excessively long email and password`, async () => {
    const loginResponse = await api.graphql.query<
      LoginQuery,
      LoginQueryVariables
    >({
      query: LOGIN_QUERY,
      variables: {
        loginInput: { email: 'abcd'.repeat(100), password: 'abcd'.repeat(50) },
      },
    });
    if (!loginResponse.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(loginResponse.errors[0].message).toBe('Invalid email or password');
  });

  test(`Login with wrong email and password`, async () => {
    const loginResponse = await api.graphql.query<
      LoginQuery,
      LoginQueryVariables
    >({
      query: LOGIN_QUERY,
      variables: {
        loginInput: {
          email: faker.internet.email(),
          password: faker.lorem.word(),
        },
      },
    });
    if (!loginResponse.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(loginResponse.errors[0].message).toBe('Invalid email or password');
  });

  test(`Login with space in email and password field`, async () => {
    const loginResponse = await api.graphql.query<
      LoginQuery,
      LoginQueryVariables
    >({
      query: LOGIN_QUERY,
      variables: {
        loginInput: { email: '   ', password: '   ' },
      },
    });
    if (!loginResponse.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(loginResponse.errors[0].message).toBe('Invalid email or password');
  });

  test(`Login with space + actual password field`, async () => {
    const dbClient = new PrismaClient();
    const user = await dbClient.user.findFirst({
      where: {
        userType: UserType.ADMIN,
      },
    });
    if (!user) {
      return;
    }
    const loginResponse = await api.graphql.query<
      LoginQuery,
      LoginQueryVariables
    >({
      query: LOGIN_QUERY,
      variables: {
        loginInput: { email: user.email, password: ' ' + user.password },
      },
    });
    if (!loginResponse.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(loginResponse.errors[0].message).toBe('Invalid email or password');
  });
});
