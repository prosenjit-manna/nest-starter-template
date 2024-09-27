import { graphql } from '../../gql';

export const CREATE_USER = graphql(`
 mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    id
  }
}
`);
