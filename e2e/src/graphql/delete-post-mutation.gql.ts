import { graphql } from 'gql';

export const DELETE_POST_MUTATION = graphql(`
  mutation DeletePost($postDeleteInput: PostDeleteInput) {
    deletePost(postDeleteInput: $postDeleteInput)
  }
`);
