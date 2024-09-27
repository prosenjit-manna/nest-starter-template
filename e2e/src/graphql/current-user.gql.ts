import { graphql } from '../gql';

export const CURRENT_USER_QUERY = graphql(`
  query CurrentUser {
    currentUser {
      id
      name
      email
      userType
      sessionCount
    }
  }
`);
