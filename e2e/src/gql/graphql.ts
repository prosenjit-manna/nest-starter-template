/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AcceptInvitationInput = {
  token: Scalars['String']['input'];
};

export type AssignRoleInput = {
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type AssignRoleResponse = {
  __typename?: 'AssignRoleResponse';
  success: Scalars['Boolean']['output'];
};

export type BaseListResponse = {
  __typename?: 'BaseListResponse';
  currentPage: Scalars['Float']['output'];
  perPage: Scalars['Float']['output'];
  totalPage: Scalars['Float']['output'];
};

export type CreatePostInput = {
  authorId: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  published?: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type CreatePostResponse = {
  __typename?: 'CreatePostResponse';
  id: Scalars['String']['output'];
};

export type CreateWorkspaceInput = {
  name: Scalars['String']['input'];
};

export type CreateWorkspaceResponse = {
  __typename?: 'CreateWorkspaceResponse';
  id: Scalars['String']['output'];
};

export type CurrentUserResponse = {
  __typename?: 'CurrentUserResponse';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  privilege: Array<RolePrivilegeResponse>;
  roles: Array<Scalars['String']['output']>;
  sessionCount: Scalars['Float']['output'];
  userType: Scalars['String']['output'];
};

export type GetPostInput = {
  id: Scalars['String']['input'];
};

export type GetPostListInput = {
  authorId?: InputMaybe<Scalars['Int']['input']>;
  fromStash?: InputMaybe<Scalars['Boolean']['input']>;
  orderBy?: InputMaybe<Order>;
  orderByField?: InputMaybe<OrderByField>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GetPostResponse = {
  __typename?: 'GetPostResponse';
  authorId?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  published?: Maybe<Scalars['Boolean']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GetUserResponse = {
  __typename?: 'GetUserResponse';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type GetUsersInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ListMembershipInput = {
  fromStash?: InputMaybe<Scalars['Boolean']['input']>;
  orderBy?: InputMaybe<Order>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  workspaceId: Scalars['String']['input'];
};

export type ListMembershipResponse = {
  __typename?: 'ListMembershipResponse';
  memberships: Array<MembershipResponse>;
  pagination: BaseListResponse;
};

export type ListWorkSpaceInput = {
  authorId?: InputMaybe<Scalars['Int']['input']>;
  fromStash?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Order>;
  orderByField?: InputMaybe<WorkspaceOrderByField>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type ListWorkSpaceResponse = {
  __typename?: 'ListWorkSpaceResponse';
  pagination: BaseListResponse;
  workspace: Array<WorkSpaceResponse>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  id: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type MembershipResponse = {
  __typename?: 'MembershipResponse';
  isAccepted: Scalars['Boolean']['output'];
  isOwner: Scalars['Boolean']['output'];
  user: User;
  workspaceId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: Scalars['Boolean']['output'];
  assignRole: AssignRoleResponse;
  createPost: CreatePostResponse;
  createRole: RoleCreateResponse;
  createWorkspace: CreateWorkspaceResponse;
  deletePost: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteWorkSpace: Scalars['Boolean']['output'];
  refreshAccessToken: VerifyEmailResponse;
  requestPasswordReset: PassWordResetRequestResponse;
  resetPassword: PassWordResetResponse;
  sendInvitation: SendInvitationResponse;
  signup: SignupResponse;
  unAssignRole: UnAssignRoleResponse;
  updatePost: UpdatePostResponse;
  updateRole: RoleUpdateResponse;
  updateWorkspace: UpdateWorkspaceResponse;
  verifyEmail: VerifyEmailResponse;
};


export type MutationAcceptInvitationArgs = {
  acceptInvitationInput: AcceptInvitationInput;
};


export type MutationAssignRoleArgs = {
  assignRoleInput: AssignRoleInput;
};


export type MutationCreatePostArgs = {
  createPostInput: CreatePostInput;
};


export type MutationCreateRoleArgs = {
  roleCreateInput: RoleCreateInput;
};


export type MutationCreateWorkspaceArgs = {
  createWorkspaceInput: CreateWorkspaceInput;
};


export type MutationDeletePostArgs = {
  postDeleteInput?: InputMaybe<PostDeleteInput>;
};


export type MutationDeleteRoleArgs = {
  roleDeleteInput?: InputMaybe<RoleDeleteInput>;
};


export type MutationDeleteWorkSpaceArgs = {
  deleteWorkspaceInput?: InputMaybe<WorkspaceDeleteInput>;
};


export type MutationRefreshAccessTokenArgs = {
  refreshAccessTokenInput: RefreshAccessTokenInput;
};


export type MutationRequestPasswordResetArgs = {
  passwordReset: PasswordResetRequestInput;
};


export type MutationResetPasswordArgs = {
  resetPassword: PasswordResetInput;
};


export type MutationSendInvitationArgs = {
  sendInvitationInput: SendInvitationInput;
};


export type MutationSignupArgs = {
  signupInput: SignupInput;
};


export type MutationUnAssignRoleArgs = {
  unAssignRoleInput: UnAssignRoleInput;
};


export type MutationUpdatePostArgs = {
  postId: Scalars['String']['input'];
  updatePostInput: UpdatePostInput;
};


export type MutationUpdateRoleArgs = {
  roleUpdateInput: RoleUpdateInput;
};


export type MutationUpdateWorkspaceArgs = {
  updateWorkspaceInput: UpdateWorkspaceInput;
};


export type MutationVerifyEmailArgs = {
  verifyEmailInput: VerifyEmailInput;
};

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PassWordResetRequestResponse = {
  __typename?: 'PassWordResetRequestResponse';
  message: Scalars['String']['output'];
};

export type PassWordResetResponse = {
  __typename?: 'PassWordResetResponse';
  message: Scalars['String']['output'];
};

export type PasswordResetInput = {
  password: Scalars['String']['input'];
};

export type PasswordResetRequestInput = {
  email: Scalars['String']['input'];
};

export type PostDeleteInput = {
  fromStash?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
};

export type PostListResponse = {
  __typename?: 'PostListResponse';
  pagination: BaseListResponse;
  posts: Array<PostResponse>;
};

export type PostResponse = {
  __typename?: 'PostResponse';
  authorId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  published: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PrivilegeListResponse = {
  __typename?: 'PrivilegeListResponse';
  privilege: Array<PrivilegeResponse>;
};

export type PrivilegeResponse = {
  __typename?: 'PrivilegeResponse';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  group: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Type;
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  currentUser: CurrentUserResponse;
  getPost?: Maybe<GetPostResponse>;
  getPostList: PostListResponse;
  getRole: RoleGetResponse;
  getUsers: Array<GetUserResponse>;
  listBasePrivilege: PrivilegeListResponse;
  listMemberships: ListMembershipResponse;
  listWorkSpace: ListWorkSpaceResponse;
  login: LoginResponse;
  roleList: RoleListResponse;
};


export type QueryGetPostArgs = {
  getPostInput: GetPostInput;
};


export type QueryGetPostListArgs = {
  getPostListInput?: InputMaybe<GetPostListInput>;
};


export type QueryGetRoleArgs = {
  roleGetInput: RoleGetInput;
};


export type QueryGetUsersArgs = {
  getUsersInput?: InputMaybe<GetUsersInput>;
};


export type QueryListMembershipsArgs = {
  listMembershipsInput: ListMembershipInput;
};


export type QueryListWorkSpaceArgs = {
  listWorkspaceInput?: InputMaybe<ListWorkSpaceInput>;
};


export type QueryLoginArgs = {
  loginInput: LoginInput;
};


export type QueryRoleListArgs = {
  roleListInput?: InputMaybe<RoleListInput>;
};

export type RefreshAccessTokenInput = {
  refreshToken: Scalars['String']['input'];
};

export type RoleCreateInput = {
  name?: RoleName;
  privileges: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type RoleCreateResponse = {
  __typename?: 'RoleCreateResponse';
  id: Scalars['String']['output'];
};

export type RoleDeleteInput = {
  fromStash?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
};

export type RoleGetInput = {
  id: Scalars['String']['input'];
};

export type RoleGetResponse = {
  __typename?: 'RoleGetResponse';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  privilege: Array<RolePrivilegeResponse>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RoleListInput = {
  fromStash?: InputMaybe<Scalars['Boolean']['input']>;
  orderBy?: InputMaybe<Order>;
  orderByField?: InputMaybe<RoleOrderByField>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RoleListResponse = {
  __typename?: 'RoleListResponse';
  pagination: BaseListResponse;
  role: Array<RoleResponse>;
};

export enum RoleName {
  Admin = 'ADMIN',
  Custom = 'CUSTOM',
  SuperAdmin = 'SUPER_ADMIN',
  User = 'USER'
}

export type RolePrivilegeResponse = {
  __typename?: 'RolePrivilegeResponse';
  group: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type RoleResponse = {
  __typename?: 'RoleResponse';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RoleUpdateInput = {
  createPrivileges: Array<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: RoleName;
  removePrivileges: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type RoleUpdateResponse = {
  __typename?: 'RoleUpdateResponse';
  id: Scalars['String']['output'];
};

export type SendInvitationInput = {
  userId: Scalars['String']['input'];
  workspaceId: Scalars['String']['input'];
};

export type SendInvitationResponse = {
  __typename?: 'SendInvitationResponse';
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type SignupInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignupResponse = {
  __typename?: 'SignupResponse';
  id: Scalars['String']['output'];
};

export type UnAssignRoleInput = {
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type UnAssignRoleResponse = {
  __typename?: 'UnAssignRoleResponse';
  success: Scalars['Boolean']['output'];
};

export type UpdatePostInput = {
  authorId?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  published?: Scalars['Boolean']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostResponse = {
  __typename?: 'UpdatePostResponse';
  id: Scalars['String']['output'];
};

export type UpdateWorkspaceInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UpdateWorkspaceResponse = {
  __typename?: 'UpdateWorkspaceResponse';
  id: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type VerifyEmailInput = {
  token: Scalars['String']['input'];
};

export type VerifyEmailResponse = {
  __typename?: 'VerifyEmailResponse';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type WorkSpaceResponse = {
  __typename?: 'WorkSpaceResponse';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type WorkspaceDeleteInput = {
  fromStash?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
};

export enum OrderByField {
  AuthorId = 'authorId',
  Id = 'id',
  Published = 'published',
  Title = 'title'
}

export enum RoleOrderByField {
  CreatedAt = 'createdAt',
  Title = 'title'
}

export enum Type {
  Base = 'BASE'
}

export enum WorkspaceOrderByField {
  CreatedAt = 'createdAt',
  Name = 'name'
}

export type AssignRoleMutationVariables = Exact<{
  assignRoleInput: AssignRoleInput;
}>;


export type AssignRoleMutation = { __typename?: 'Mutation', assignRole: { __typename?: 'AssignRoleResponse', success: boolean } };

export type CreatePostMutationVariables = Exact<{
  createPostInput: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'CreatePostResponse', id: string } };

export type CreateRoleMutationVariables = Exact<{
  roleCreateInput: RoleCreateInput;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'RoleCreateResponse', id: string } };

export type CreateWorkspaceMutationVariables = Exact<{
  createWorkspaceInput: CreateWorkspaceInput;
}>;


export type CreateWorkspaceMutation = { __typename?: 'Mutation', createWorkspace: { __typename?: 'CreateWorkspaceResponse', id: string } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUserResponse', id: string, name?: string | null, email: string, userType: string, sessionCount: number, roles: Array<string>, privilege: Array<{ __typename?: 'RolePrivilegeResponse', group: string, name: string, id: string, type: string }> } };

export type DeletePostMutationVariables = Exact<{
  postDeleteInput?: InputMaybe<PostDeleteInput>;
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type DeleteRoleMutationVariables = Exact<{
  roleDeleteInput?: InputMaybe<RoleDeleteInput>;
}>;


export type DeleteRoleMutation = { __typename?: 'Mutation', deleteRole: boolean };

export type DeleteWorkSpaceMutationVariables = Exact<{
  deleteWorkspaceInput?: InputMaybe<WorkspaceDeleteInput>;
}>;


export type DeleteWorkSpaceMutation = { __typename?: 'Mutation', deleteWorkSpace: boolean };

export type GetPostListQueryVariables = Exact<{
  getPostListInput?: InputMaybe<GetPostListInput>;
}>;


export type GetPostListQuery = { __typename?: 'Query', getPostList: { __typename?: 'PostListResponse', posts: Array<{ __typename?: 'PostResponse', title: string, content: string, id: string, published: boolean, authorId: string, createdAt: any, updatedAt: any, deletedAt?: any | null }>, pagination: { __typename?: 'BaseListResponse', totalPage: number, currentPage: number, perPage: number } } };

export type GetPostQueryVariables = Exact<{
  getPostInput: GetPostInput;
}>;


export type GetPostQuery = { __typename?: 'Query', getPost?: { __typename?: 'GetPostResponse', id: string, title: string, content?: string | null, published?: boolean | null, authorId?: string | null, createdAt: any, updatedAt: any, deletedAt?: any | null } | null };

export type RoleListQueryVariables = Exact<{
  roleListInput?: InputMaybe<RoleListInput>;
}>;


export type RoleListQuery = { __typename?: 'Query', roleList: { __typename?: 'RoleListResponse', role: Array<{ __typename?: 'RoleResponse', title: string, name: string, id: string, deletedAt?: any | null }>, pagination: { __typename?: 'BaseListResponse', totalPage: number, currentPage: number, perPage: number } } };

export type GetRoleQueryVariables = Exact<{
  roleGetInput: RoleGetInput;
}>;


export type GetRoleQuery = { __typename?: 'Query', getRole: { __typename?: 'RoleGetResponse', id: string, title: string, name: string, createdAt: any, updatedAt: any, deletedAt?: any | null, privilege: Array<{ __typename?: 'RolePrivilegeResponse', name: string, group: string, id: string, type: string }> } };

export type GetUsersQueryVariables = Exact<{
  getUsersInput?: InputMaybe<GetUsersInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'GetUserResponse', email: string, id: string, name?: string | null }> };

export type ListWorkSpaceQueryVariables = Exact<{
  listWorkspaceInput?: InputMaybe<ListWorkSpaceInput>;
}>;


export type ListWorkSpaceQuery = { __typename?: 'Query', listWorkSpace: { __typename?: 'ListWorkSpaceResponse', workspace: Array<{ __typename?: 'WorkSpaceResponse', name: string, id: string }>, pagination: { __typename?: 'BaseListResponse', totalPage: number, currentPage: number, perPage: number } } };

export type LoginQueryVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'LoginResponse', id: string, token: string, refreshToken: string } };

export type ResetPasswordMutationVariables = Exact<{
  resetPassword: PasswordResetInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'PassWordResetResponse', message: string } };

export type RoleQueryVariables = Exact<{ [key: string]: never; }>;


export type RoleQuery = { __typename?: 'Query', listBasePrivilege: { __typename?: 'PrivilegeListResponse', privilege: Array<{ __typename?: 'PrivilegeResponse', name: string, group: string, id: string, type: Type, createdAt: any, updatedAt: any, deletedAt?: any | null }> } };

export type RefreshAccessTokenMutationVariables = Exact<{
  refreshAccessTokenInput: RefreshAccessTokenInput;
}>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', refreshAccessToken: { __typename?: 'VerifyEmailResponse', token: string, refreshToken: string } };

export type RequestPasswordResetMutationVariables = Exact<{
  passwordReset: PasswordResetRequestInput;
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename?: 'PassWordResetRequestResponse', message: string } };

export type SendInvitationMutationVariables = Exact<{
  sendInvitationInput: SendInvitationInput;
}>;


export type SendInvitationMutation = { __typename?: 'Mutation', sendInvitation: { __typename?: 'SendInvitationResponse', success?: boolean | null } };

export type SignupMutationVariables = Exact<{
  signupInput: SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'SignupResponse', id: string } };

export type UnAssignRoleMutationVariables = Exact<{
  unAssignRoleInput: UnAssignRoleInput;
}>;


export type UnAssignRoleMutation = { __typename?: 'Mutation', unAssignRole: { __typename?: 'UnAssignRoleResponse', success: boolean } };

export type UpdatePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  updatePostInput: UpdatePostInput;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'UpdatePostResponse', id: string } };

export type UpdateRoleMutationVariables = Exact<{
  roleUpdateInput: RoleUpdateInput;
}>;


export type UpdateRoleMutation = { __typename?: 'Mutation', updateRole: { __typename?: 'RoleUpdateResponse', id: string } };

export type UpdateWorkspaceMutationVariables = Exact<{
  updateWorkspaceInput: UpdateWorkspaceInput;
}>;


export type UpdateWorkspaceMutation = { __typename?: 'Mutation', updateWorkspace: { __typename?: 'UpdateWorkspaceResponse', id: string } };

export type VerifyEmailMutationVariables = Exact<{
  verifyEmailInput: VerifyEmailInput;
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'VerifyEmailResponse', token: string, refreshToken: string } };

export type AcceptInvitationMutationVariables = Exact<{
  acceptInvitationInput: AcceptInvitationInput;
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation: boolean };


export const AssignRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignRoleInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignRoleInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignRoleInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AssignRoleMutation, AssignRoleMutationVariables>;
export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createPostInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createPostInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createPostInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleCreateInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleCreateInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleCreateInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const CreateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createWorkspaceInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWorkspaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createWorkspaceInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createWorkspaceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"sessionCount"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"privilege"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const DeletePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postDeleteInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostDeleteInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postDeleteInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postDeleteInput"}}}]}]}}]} as unknown as DocumentNode<DeletePostMutation, DeletePostMutationVariables>;
export const DeleteRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleDeleteInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleDeleteInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleDeleteInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleDeleteInput"}}}]}]}}]} as unknown as DocumentNode<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const DeleteWorkSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWorkSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteWorkspaceInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkspaceDeleteInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWorkSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deleteWorkspaceInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteWorkspaceInput"}}}]}]}}]} as unknown as DocumentNode<DeleteWorkSpaceMutation, DeleteWorkSpaceMutationVariables>;
export const GetPostListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getPostListInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPostListInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPostList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"getPostListInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getPostListInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetPostListQuery, GetPostListQueryVariables>;
export const GetPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getPostInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"getPostInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getPostInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<GetPostQuery, GetPostQueryVariables>;
export const RoleListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RoleList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleListInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleListInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleListInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleListInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}}]}}]}}]}}]} as unknown as DocumentNode<RoleListQuery, RoleListQueryVariables>;
export const GetRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleGetInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleGetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleGetInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleGetInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"privilege"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetRoleQuery, GetRoleQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUsersInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GetUsersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"getUsersInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUsersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const ListWorkSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListWorkSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listWorkspaceInput"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ListWorkSpaceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listWorkSpace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listWorkspaceInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listWorkspaceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}}]}}]}}]}}]} as unknown as DocumentNode<ListWorkSpaceQuery, ListWorkSpaceQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loginInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginQuery, LoginQueryVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resetPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordResetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"resetPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resetPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const RoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listBasePrivilege"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"privilege"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]}}]} as unknown as DocumentNode<RoleQuery, RoleQueryVariables>;
export const RefreshAccessTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAccessToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshAccessTokenInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshAccessTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshAccessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshAccessTokenInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshAccessTokenInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;
export const RequestPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordReset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordResetRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordReset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordReset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const SendInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sendInvitationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendInvitationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sendInvitationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<SendInvitationMutation, SendInvitationMutationVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signupInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"signupInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signupInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const UnAssignRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnAssignRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unAssignRoleInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnAssignRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unAssignRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"unAssignRoleInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unAssignRoleInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UnAssignRoleMutation, UnAssignRoleMutationVariables>;
export const UpdatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updatePostInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"updatePostInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updatePostInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdatePostMutation, UpdatePostMutationVariables>;
export const UpdateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUpdateInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleUpdateInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUpdateInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const UpdateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateWorkspaceInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWorkspaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateWorkspaceInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateWorkspaceInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verifyEmailInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verifyEmailInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verifyEmailInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const AcceptInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"acceptInvitationInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"acceptInvitationInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"acceptInvitationInput"}}}]}]}}]} as unknown as DocumentNode<AcceptInvitationMutation, AcceptInvitationMutationVariables>;