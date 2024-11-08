import { SIGN_UP_MUTATION } from '../../graphql/sign-up-mutation.gql';
import { GraphQlApi } from '../../lib/graphql-api';
import { appEnv } from '../../lib/app-env';
import { SignupMutation, SignupMutationVariables } from '../../gql/graphql';
import { faker } from '@faker-js/faker/.';
import { PrismaClient, UserType } from '@prisma/client';

describe('User Sign up negative testing - NST-46', () => {
  const api = new GraphQlApi();

  test('Add a new user with only email and blank password', async () => {
    const signup = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: faker.internet.email(),
          password: '',
        },
      },
    });

    if (!signup.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(signup.errors[0].message).toBe('The fields cannot be empty');
  });

  test('Add a new user with only password and blank email', async () => {
    const signup = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: '',
          password: appEnv.SEED_PASSWORD,
        },
      },
    });

    if (!signup.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(signup.errors[0].message).toBe('The fields cannot be empty');
  });

  test('Add a new user with blank values in all fields', async () => {
    const signup = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: '',
          password: '',
        },
      },
    });
    if (!signup.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(signup.errors[0].message).toBe('The fields cannot be empty');
  });

  test('Add a new user with invalid email format', async () => {
    const signup = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: 'abcd',
          password: '',
        },
      },
    });
    if (!signup.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(signup.errors[0].message).toBe('Invalid email format');
  });

  test('Add a new user with invalid password format', async () => {
    const signup = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: faker.internet.email(),
          password: 'abcd',
        },
      },
    });
    if (!signup.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(signup.errors[0].message).toBe('Invalid password format');
  });

  test('Add a new user with excessively long email and password', async () => {
    const signup = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: 'abcd'.repeat(100),
          password: 'abcd'.repeat(50),
        },
      },
    });
    if (!signup.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(signup.errors[0].message).toBe('Excessively long characters');
  });

  test('Add a new user with White space in email and password', async () => {
    const signup = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: '    ',
          password: '    ',
        },
      },
    });
    if (!signup.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(signup.errors[0].message).toBe('Invalid input');
  });

  test('Add a new user with Exiting user', async () => {
    const dbClient = new PrismaClient();
    const user = await dbClient.user.findFirst({
      where: {
        userType: UserType.ADMIN,
      },
    });
    if (!user) return;

    const signup = await api.graphql.mutate<
      SignupMutation,
      SignupMutationVariables
    >({
      mutation: SIGN_UP_MUTATION,
      variables: {
        signupInput: {
          email: user.email,
          password: '    ',
        },
      },
    });
    if (!signup.errors) {
      throw new Error('Expected an error, but none was returned');
    }
    expect(signup.errors[0].message).toBe('User already exists');
  });
});
