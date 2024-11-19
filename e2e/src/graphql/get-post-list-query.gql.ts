import { graphql } from 'gql';

export const GET_POST_LIST_QUERY = graphql(`
  query GetPostList($getPostListInput: GetPostListInput) {
    getPostList(getPostListInput: $getPostListInput) {
      posts {
        title
        content
        id
        published
        authorId
        createdAt
        updatedAt
        deletedAt
      }
      pagination {
        totalPage
        currentPage
        perPage
      }
    }
  }
`);
