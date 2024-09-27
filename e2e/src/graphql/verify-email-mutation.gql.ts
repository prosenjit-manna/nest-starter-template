import { graphql } from "gql";

export const VERIFY_EMAIL_MUTATION = graphql(`
  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(verifyEmailInput: $verifyEmailInput) {
      token
      refreshToken
    }
  }
`);
