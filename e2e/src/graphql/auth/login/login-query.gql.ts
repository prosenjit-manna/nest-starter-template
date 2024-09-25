import { graphql } from '@/gql';

export const LOGIN_QUERY = graphql(`
  query Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      id
      token
    }
  }
`);
