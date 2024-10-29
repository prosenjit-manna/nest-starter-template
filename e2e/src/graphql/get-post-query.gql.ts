import { graphql } from 'gql';

export const GET_POST_QUERY = graphql(`
  query GetPost($getPostInput: GetPostInput!) {
    getPost(getPostInput: $getPostInput) {
      id
      title
      content
      published
      authorId
      createdAt
      updatedAt
      deletedAt
    }
  }
`);
