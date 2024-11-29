import { graphql } from 'gql';

export const GET_POST_LIST_QUERY = graphql(`
  query GetPostList($getPostListInput: GetPostListInput) {
    getPostList(getPostListInput: $getPostListInput) {
      posts {
        title
        content
        id
        published
        author {
          id
          name
        }
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
