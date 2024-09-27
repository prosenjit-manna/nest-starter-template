import { graphql } from 'gql';

export const PASSWORD_RESET_MUTATION = graphql(`
  mutation ResetPassword($resetPassword: PasswordResetInput!) {
    resetPassword(resetPassword: $resetPassword) {
      message
    }
  }
`);
