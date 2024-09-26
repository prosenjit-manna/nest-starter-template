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

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  id: Scalars['String']['output'];
};

export type CurrentUserResponse = {
  __typename?: 'CurrentUserResponse';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  sessionCount: Scalars['Float']['output'];
  userType: Scalars['String']['output'];
};

export type GetPostListInput = {
  authorId?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Order>;
  orderByField?: InputMaybe<OrderByField>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  createPost: CreatePostResponse;
  createRole: RoleCreateResponse;
  createUser: CreateUserResponse;
  refreshAccessToken: VerifyEmailResponse;
  requestPasswordReset: PassWordResetRequestResponse;
  resetPassword: PassWordResetResponse;
  signup: SignupResponse;
  updatePost: UpdatePostResponse;
  verifyEmail: VerifyEmailResponse;
};


export type MutationCreatePostArgs = {
  createPostInput: CreatePostInput;
};


export type MutationCreateRoleArgs = {
  roleCreateInput: RoleCreateInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
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


export type MutationSignupArgs = {
  signupInput: SignupInput;
};


export type MutationUpdatePostArgs = {
  postId: Scalars['String']['input'];
  updatePostInput: UpdatePostInput;
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

export type PostListResponse = {
  __typename?: 'PostListResponse';
  pagination: BaseListResponse;
  posts: Array<PostResponse>;
};

export type PostResponse = {
  __typename?: 'PostResponse';
  authorId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  id: Scalars['String']['output'];
  published: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  currentUser: CurrentUserResponse;
  getPostList: PostListResponse;
  getUsers: Array<CurrentUserResponse>;
  login: LoginResponse;
  roleList: RoleListResponse;
};


export type QueryGetPostListArgs = {
  getPostListInput?: InputMaybe<GetPostListInput>;
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
  title: Scalars['String']['input'];
};

export type RoleCreateResponse = {
  __typename?: 'RoleCreateResponse';
  id: Scalars['String']['output'];
};

export type RoleListInput = {
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

export type RoleResponse = {
  __typename?: 'RoleResponse';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type SignupInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignupResponse = {
  __typename?: 'SignupResponse';
  id: Scalars['String']['output'];
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

export type VerifyEmailInput = {
  token: Scalars['String']['input'];
};

export type VerifyEmailResponse = {
  __typename?: 'VerifyEmailResponse';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type BaseListResponse = {
  __typename?: 'baseListResponse';
  currentPage: Scalars['Float']['output'];
  perPage: Scalars['Float']['output'];
  totalPage: Scalars['Float']['output'];
};

export enum OrderByField {
  AuthorId = 'authorId',
  Id = 'id',
  Published = 'published',
  Title = 'title'
}

export enum RoleOrderByField {
  Id = 'id',
  Title = 'title'
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUserResponse', id: string, name?: string | null, email: string, userType: string, sessionCount: number } };

export type LoginQueryVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'LoginResponse', id: string, token: string } };

export type SignupMutationVariables = Exact<{
  signupInput: SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'SignupResponse', id: string } };

export type VerifyEmailMutationVariables = Exact<{
  verifyEmailInput: VerifyEmailInput;
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'VerifyEmailResponse', token: string, refreshToken: string } };


export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"sessionCount"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loginInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LoginQuery, LoginQueryVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signupInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"signupInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signupInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verifyEmailInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"verifyEmailInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verifyEmailInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;