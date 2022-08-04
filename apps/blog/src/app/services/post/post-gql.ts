import { gql } from 'apollo-angular';

export const CREATE_POST = gql`
  mutation createPost($post: PostInput) {
    createPostPipeline(data: $post) {
      id
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query getPostById($id: String!) {
    getPostById(id: $id) {
      id
      title
      status
      content
      author {
        username
      }
    }
  }
`;

export const FIND_POSTS = gql`
  query findPosts($author: String) {
    findPosts(author: $author) {
      id
      title
      status
      content
      author
    }
  }
`;

export const PATCH_POST = gql`
  mutation patchPostPipeline($post: PostPatchInput) {
    patchPostPipeline(data: $post) {
      id
    }
  }
`;

// export const ADD_COMMENT = gql`
//   mutation addCommentPipeline($comment: CommentInput!, $postId: String!) {
//     patchPostPipeline(comment: $comment, postId: $postId) {
//       id
//     }
//   }
// `;
