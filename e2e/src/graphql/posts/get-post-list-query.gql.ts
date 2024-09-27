import { graphql } from '@/gql';

export const GET_POST_LIST_QUERY = graphql(`
  query GetPostList($getPostListInput: GetPostListInput) {
    getPostList(getPostListInput: $getPostListInput) {
      pagination {
        currentPage
        perPage
        totalPage
      }
      posts {
        title
        content
        id
        published
        authorId
      }
    }
  }
`);
