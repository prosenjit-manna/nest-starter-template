import { gql } from '@apollo/client';

export const LOGIN_QUERY = gql`
  query Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    id
    token
  }
}
`;
