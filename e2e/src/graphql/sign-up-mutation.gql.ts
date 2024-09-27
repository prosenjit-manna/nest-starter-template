import { graphql } from "gql";

export const SIGN_UP_MUTATION = graphql(`
  mutation Signup($signupInput: SignupInput!) {
    signup(signupInput: $signupInput) {
      id
    }
  }
`);
