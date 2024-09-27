import { graphql } from '@/gql';

export const CREATE_POST_MUTATION = graphql(`
  mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      id
    }
  }
`);
