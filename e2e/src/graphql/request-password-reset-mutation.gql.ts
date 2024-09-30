import { graphql } from 'gql';

export const REQUEST_PASSWORD_RESET_MUTATION = graphql(`
  mutation RequestPasswordReset($passwordReset: PasswordResetRequestInput!) {
    requestPasswordReset(passwordReset: $passwordReset) {
      message
    }
  }
`);
