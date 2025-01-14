/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation AssignRole($assignRoleInput: AssignRoleInput!) {\n    assignRole(assignRoleInput: $assignRoleInput) {\n      success\n    }\n  }\n": types.AssignRoleDocument,
    "\n  mutation CreatePost($createPostInput: CreatePostInput!) {\n    createPost(createPostInput: $createPostInput) {\n      id\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation CreateRole($roleCreateInput: RoleCreateInput!) {\n    createRole(roleCreateInput: $roleCreateInput) {\n      id\n    }\n  }\n": types.CreateRoleDocument,
    "\n  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {\n  createWorkspace(createWorkspaceInput: $createWorkspaceInput) {\n    id\n  }\n}\n\n": types.CreateWorkspaceDocument,
    "\n  query CurrentUser {\n    currentUser {\n      id\n      name\n      email\n      userType\n      sessionCount\n      roles\n      privilege {\n        group\n        name\n        id\n        type\n      }\n    }\n  }\n": types.CurrentUserDocument,
    "\n  mutation DeletePost($postDeleteInput: PostDeleteInput) {\n    deletePost(postDeleteInput: $postDeleteInput)\n  }\n": types.DeletePostDocument,
    "\n  mutation DeleteRole($roleDeleteInput: RoleDeleteInput) {\n    deleteRole(roleDeleteInput: $roleDeleteInput)\n  }\n": types.DeleteRoleDocument,
    "\n mutation DeleteWorkSpace($deleteWorkspaceInput: WorkspaceDeleteInput) {\n  deleteWorkSpace(deleteWorkspaceInput: $deleteWorkspaceInput)\n}\n": types.DeleteWorkSpaceDocument,
    "\n  query GetPostList($getPostListInput: GetPostListInput) {\n    getPostList(getPostListInput: $getPostListInput) {\n      posts {\n        title\n        content\n        id\n        published\n        author {\n          id\n          name\n        }\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      pagination {\n        totalPage\n        currentPage\n        perPage\n      }\n    }\n  }\n": types.GetPostListDocument,
    "\n  query GetPost($getPostInput: GetPostInput!) {\n    getPost(getPostInput: $getPostInput) {\n      id\n      title\n      content\n      published\n      authorId\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.GetPostDocument,
    "\n  query RoleList($roleListInput: RoleListInput) {\n    roleList(roleListInput: $roleListInput) {\n      role {\n        title\n        name\n        id\n        deletedAt\n      }\n      pagination {\n        totalPage\n        currentPage\n        perPage\n      }\n    }\n  }\n": types.RoleListDocument,
    "\n  query GetRole($roleGetInput: RoleGetInput!) {\n    getRole(roleGetInput: $roleGetInput) {\n      id\n      title\n      name\n      createdAt\n      updatedAt\n      deletedAt\n      privilege {\n        name\n        group\n        id\n        type\n      }\n    }\n  }\n": types.GetRoleDocument,
    "\n  query GetUsers($getUsersInput: GetUsersInput) {\n    getUsers(getUsersInput: $getUsersInput) {\n      email\n      id\n      name\n    }\n  }\n": types.GetUsersDocument,
    "\n  query ListWorkSpace($listWorkspaceInput: ListWorkSpaceInput) {\n    listWorkSpace(listWorkspaceInput: $listWorkspaceInput) {\n      workspace {\n        name\n        id\n      }\n      pagination {\n        totalPage\n        currentPage\n        perPage\n      }\n    }\n  }\n": types.ListWorkSpaceDocument,
    "\n  query Login($loginInput: LoginInput!) {\n    login(loginInput: $loginInput) {\n      id\n      token\n      refreshToken\n    }\n  }\n": types.LoginDocument,
    "\n  mutation ResetPassword($resetPassword: PasswordResetInput!) {\n    resetPassword(resetPassword: $resetPassword) {\n      message\n    }\n  }\n": types.ResetPasswordDocument,
    "\n  query Role {\n    listBasePrivilege {\n      privilege {\n        name\n        group\n        id\n        type\n        createdAt\n        updatedAt\n        deletedAt\n      }\n    }\n  }\n": types.RoleDocument,
    "\n  mutation RefreshAccessToken($refreshAccessTokenInput: RefreshAccessTokenInput!) {\n  refreshAccessToken(refreshAccessTokenInput: $refreshAccessTokenInput) {\n    token\n    refreshToken\n  }\n}\n": types.RefreshAccessTokenDocument,
    "\n  mutation RequestPasswordReset($passwordReset: PasswordResetRequestInput!) {\n    requestPasswordReset(passwordReset: $passwordReset) {\n      message\n    }\n  }\n": types.RequestPasswordResetDocument,
    "\n  mutation SendInvitation($sendInvitationInput: SendInvitationInput!) {\n    sendInvitation(sendInvitationInput: $sendInvitationInput) {\n      success\n    }\n  }\n": types.SendInvitationDocument,
    "\n  mutation Signup($signupInput: SignupInput!) {\n    signup(signupInput: $signupInput) {\n      id\n    }\n  }\n": types.SignupDocument,
    "\n  mutation UnAssignRole($unAssignRoleInput: UnAssignRoleInput!) {\n    unAssignRole(unAssignRoleInput: $unAssignRoleInput) {\n      success\n    }\n  }\n": types.UnAssignRoleDocument,
    "\n  mutation UpdatePost($postId: String!, $updatePostInput: UpdatePostInput!) {\n    updatePost(postId: $postId, updatePostInput: $updatePostInput) {\n      id\n    }\n  }\n": types.UpdatePostDocument,
    "\n  mutation UpdateRole($roleUpdateInput: RoleUpdateInput!) {\n    updateRole(roleUpdateInput: $roleUpdateInput) {\n      id\n    }\n  }\n": types.UpdateRoleDocument,
    "\n  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {\n  updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {\n    id\n  }\n}\n": types.UpdateWorkspaceDocument,
    "\n  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(verifyEmailInput: $verifyEmailInput) {\n      token\n      refreshToken\n    }\n  }\n": types.VerifyEmailDocument,
    "\n  mutation AcceptInvitation($acceptInvitationInput: AcceptInvitationInput!) {\n    acceptInvitation(acceptInvitationInput: $acceptInvitationInput)\n  }\n": types.AcceptInvitationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AssignRole($assignRoleInput: AssignRoleInput!) {\n    assignRole(assignRoleInput: $assignRoleInput) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation AssignRole($assignRoleInput: AssignRoleInput!) {\n    assignRole(assignRoleInput: $assignRoleInput) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePost($createPostInput: CreatePostInput!) {\n    createPost(createPostInput: $createPostInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost($createPostInput: CreatePostInput!) {\n    createPost(createPostInput: $createPostInput) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRole($roleCreateInput: RoleCreateInput!) {\n    createRole(roleCreateInput: $roleCreateInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRole($roleCreateInput: RoleCreateInput!) {\n    createRole(roleCreateInput: $roleCreateInput) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {\n  createWorkspace(createWorkspaceInput: $createWorkspaceInput) {\n    id\n  }\n}\n\n"): (typeof documents)["\n  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {\n  createWorkspace(createWorkspaceInput: $createWorkspaceInput) {\n    id\n  }\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CurrentUser {\n    currentUser {\n      id\n      name\n      email\n      userType\n      sessionCount\n      roles\n      privilege {\n        group\n        name\n        id\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  query CurrentUser {\n    currentUser {\n      id\n      name\n      email\n      userType\n      sessionCount\n      roles\n      privilege {\n        group\n        name\n        id\n        type\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePost($postDeleteInput: PostDeleteInput) {\n    deletePost(postDeleteInput: $postDeleteInput)\n  }\n"): (typeof documents)["\n  mutation DeletePost($postDeleteInput: PostDeleteInput) {\n    deletePost(postDeleteInput: $postDeleteInput)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteRole($roleDeleteInput: RoleDeleteInput) {\n    deleteRole(roleDeleteInput: $roleDeleteInput)\n  }\n"): (typeof documents)["\n  mutation DeleteRole($roleDeleteInput: RoleDeleteInput) {\n    deleteRole(roleDeleteInput: $roleDeleteInput)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n mutation DeleteWorkSpace($deleteWorkspaceInput: WorkspaceDeleteInput) {\n  deleteWorkSpace(deleteWorkspaceInput: $deleteWorkspaceInput)\n}\n"): (typeof documents)["\n mutation DeleteWorkSpace($deleteWorkspaceInput: WorkspaceDeleteInput) {\n  deleteWorkSpace(deleteWorkspaceInput: $deleteWorkspaceInput)\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPostList($getPostListInput: GetPostListInput) {\n    getPostList(getPostListInput: $getPostListInput) {\n      posts {\n        title\n        content\n        id\n        published\n        author {\n          id\n          name\n        }\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      pagination {\n        totalPage\n        currentPage\n        perPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPostList($getPostListInput: GetPostListInput) {\n    getPostList(getPostListInput: $getPostListInput) {\n      posts {\n        title\n        content\n        id\n        published\n        author {\n          id\n          name\n        }\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      pagination {\n        totalPage\n        currentPage\n        perPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPost($getPostInput: GetPostInput!) {\n    getPost(getPostInput: $getPostInput) {\n      id\n      title\n      content\n      published\n      authorId\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  query GetPost($getPostInput: GetPostInput!) {\n    getPost(getPostInput: $getPostInput) {\n      id\n      title\n      content\n      published\n      authorId\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RoleList($roleListInput: RoleListInput) {\n    roleList(roleListInput: $roleListInput) {\n      role {\n        title\n        name\n        id\n        deletedAt\n      }\n      pagination {\n        totalPage\n        currentPage\n        perPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query RoleList($roleListInput: RoleListInput) {\n    roleList(roleListInput: $roleListInput) {\n      role {\n        title\n        name\n        id\n        deletedAt\n      }\n      pagination {\n        totalPage\n        currentPage\n        perPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRole($roleGetInput: RoleGetInput!) {\n    getRole(roleGetInput: $roleGetInput) {\n      id\n      title\n      name\n      createdAt\n      updatedAt\n      deletedAt\n      privilege {\n        name\n        group\n        id\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRole($roleGetInput: RoleGetInput!) {\n    getRole(roleGetInput: $roleGetInput) {\n      id\n      title\n      name\n      createdAt\n      updatedAt\n      deletedAt\n      privilege {\n        name\n        group\n        id\n        type\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers($getUsersInput: GetUsersInput) {\n    getUsers(getUsersInput: $getUsersInput) {\n      email\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetUsers($getUsersInput: GetUsersInput) {\n    getUsers(getUsersInput: $getUsersInput) {\n      email\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListWorkSpace($listWorkspaceInput: ListWorkSpaceInput) {\n    listWorkSpace(listWorkspaceInput: $listWorkspaceInput) {\n      workspace {\n        name\n        id\n      }\n      pagination {\n        totalPage\n        currentPage\n        perPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListWorkSpace($listWorkspaceInput: ListWorkSpaceInput) {\n    listWorkSpace(listWorkspaceInput: $listWorkspaceInput) {\n      workspace {\n        name\n        id\n      }\n      pagination {\n        totalPage\n        currentPage\n        perPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Login($loginInput: LoginInput!) {\n    login(loginInput: $loginInput) {\n      id\n      token\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  query Login($loginInput: LoginInput!) {\n    login(loginInput: $loginInput) {\n      id\n      token\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetPassword($resetPassword: PasswordResetInput!) {\n    resetPassword(resetPassword: $resetPassword) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation ResetPassword($resetPassword: PasswordResetInput!) {\n    resetPassword(resetPassword: $resetPassword) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Role {\n    listBasePrivilege {\n      privilege {\n        name\n        group\n        id\n        type\n        createdAt\n        updatedAt\n        deletedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query Role {\n    listBasePrivilege {\n      privilege {\n        name\n        group\n        id\n        type\n        createdAt\n        updatedAt\n        deletedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefreshAccessToken($refreshAccessTokenInput: RefreshAccessTokenInput!) {\n  refreshAccessToken(refreshAccessTokenInput: $refreshAccessTokenInput) {\n    token\n    refreshToken\n  }\n}\n"): (typeof documents)["\n  mutation RefreshAccessToken($refreshAccessTokenInput: RefreshAccessTokenInput!) {\n  refreshAccessToken(refreshAccessTokenInput: $refreshAccessTokenInput) {\n    token\n    refreshToken\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestPasswordReset($passwordReset: PasswordResetRequestInput!) {\n    requestPasswordReset(passwordReset: $passwordReset) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation RequestPasswordReset($passwordReset: PasswordResetRequestInput!) {\n    requestPasswordReset(passwordReset: $passwordReset) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendInvitation($sendInvitationInput: SendInvitationInput!) {\n    sendInvitation(sendInvitationInput: $sendInvitationInput) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation SendInvitation($sendInvitationInput: SendInvitationInput!) {\n    sendInvitation(sendInvitationInput: $sendInvitationInput) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Signup($signupInput: SignupInput!) {\n    signup(signupInput: $signupInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation Signup($signupInput: SignupInput!) {\n    signup(signupInput: $signupInput) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnAssignRole($unAssignRoleInput: UnAssignRoleInput!) {\n    unAssignRole(unAssignRoleInput: $unAssignRoleInput) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation UnAssignRole($unAssignRoleInput: UnAssignRoleInput!) {\n    unAssignRole(unAssignRoleInput: $unAssignRoleInput) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePost($postId: String!, $updatePostInput: UpdatePostInput!) {\n    updatePost(postId: $postId, updatePostInput: $updatePostInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePost($postId: String!, $updatePostInput: UpdatePostInput!) {\n    updatePost(postId: $postId, updatePostInput: $updatePostInput) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateRole($roleUpdateInput: RoleUpdateInput!) {\n    updateRole(roleUpdateInput: $roleUpdateInput) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateRole($roleUpdateInput: RoleUpdateInput!) {\n    updateRole(roleUpdateInput: $roleUpdateInput) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {\n  updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {\n    id\n  }\n}\n"): (typeof documents)["\n  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {\n  updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(verifyEmailInput: $verifyEmailInput) {\n      token\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(verifyEmailInput: $verifyEmailInput) {\n      token\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcceptInvitation($acceptInvitationInput: AcceptInvitationInput!) {\n    acceptInvitation(acceptInvitationInput: $acceptInvitationInput)\n  }\n"): (typeof documents)["\n  mutation AcceptInvitation($acceptInvitationInput: AcceptInvitationInput!) {\n    acceptInvitation(acceptInvitationInput: $acceptInvitationInput)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;