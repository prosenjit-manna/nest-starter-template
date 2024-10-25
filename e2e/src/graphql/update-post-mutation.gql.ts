import { graphql } from 'gql';

export const UPDATE_POST_MUTATION = graphql(`
  mutation UpdatePost($postId: String!, $updatePostInput: UpdatePostInput!) {
    updatePost(postId: $postId, updatePostInput: $updatePostInput) {
      id
    }
  }
`);
