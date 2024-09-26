import { graphql } from '../../../gql';

export const REFRESH_TOKEN_MUTATION = graphql(`
  mutation RefreshAccessToken($refreshAccessTokenInput: RefreshAccessTokenInput!) {
  refreshAccessToken(refreshAccessTokenInput: $refreshAccessTokenInput) {
    token
    refreshToken
  }
}
`);
