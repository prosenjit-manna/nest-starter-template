import { graphql } from 'gql';

export const USER_LIST = graphql(`
 query GetUsers {
  getUsers {
    email
    id
  }
}

`);
