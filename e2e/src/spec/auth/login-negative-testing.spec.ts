import { GraphQlApi } from '../../lib/graphql-api';
import { GraphQLError } from 'graphql';
import { faker } from '@faker-js/faker/.';
import { appEnv } from '../../lib/app-env';
import { PrismaClient, UserType } from '@prisma/client';

describe('Login module negative testing', () => {
  const api = new GraphQlApi();

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
    try {
      await api.login({
        email: user.email,
        password: '',
      });
    } catch (error) {
      if (error instanceof GraphQLError)
        expect(error.message).toBe('Invalid email or password');
    }
  });

  test(`Login with only password and blank email`, async () => {
    try {
      await api.login({
        email: '',
        password: appEnv.SEED_PASSWORD,
      });
    } catch (error) {
      if (error instanceof GraphQLError)
        expect(error.message).toBe('Invalid email or password');
    }
  });

  test(`Login with blank values in all fields`, async () => {
    try {
      await api.login({
        email: '',
        password: '',
      });
    } catch (error) {
      if (error instanceof GraphQLError)
        expect(error.message).toBe('Invalid email or password');
    }
  });

  test(`Login with invalid email format`, async () => {
    try {
      await api.login({
        email: 'abcd',
        password: appEnv.SEED_PASSWORD,
      });
    } catch (error) {
      if (error instanceof GraphQLError)
        expect(error.message).toBe('Invalid email or password');
    }
  });

  test(`Login with excessively long email and password`, async () => {
    try {
      await api.login({
        email: 'abcd'.repeat(100),
        password: 'abcd'.repeat(50),
      });
    } catch (error) {
      if (error instanceof GraphQLError)
        expect(error.message).toBe('Invalid email or password');
    }
  });

  test(`Login with wrong email and password`, async () => {
    try {
      await api.login({
        email: faker.internet.email(),
        password: faker.lorem.word(),
      });
    } catch (error) {
      if (error instanceof GraphQLError)
        expect(error.message).toBe('Invalid email or password');
    }
  });
  
  test(`Login with space in email and password field`, async () => {
    try {
      await api.login({
        email: '   ',
        password: '  ',
      });
    } catch (error) {
      if (error instanceof GraphQLError)
        expect(error.message).toBe('Invalid email or password');
    }
  });
  
});
