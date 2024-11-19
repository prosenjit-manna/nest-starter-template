import { graphql } from 'gql';

export const USER_LIST = graphql(`
  query GetUsers($getUsersInput: GetUsersInput) {
    getUsers(getUsersInput: $getUsersInput) {
      email
      id
      name
    }
  }
`);
