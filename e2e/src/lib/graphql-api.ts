import {
  ApolloClient,
  ApolloLink,
  ApolloQueryResult,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { appEnv } from './app-env';
import { setContext } from '@apollo/client/link/context';
import { LOGIN_QUERY } from '../graphql/auth/login/login-query.gql';
import { LoginInput, LoginQuery } from '../gql/graphql';


export class GraphQlApi {
  public graphql: ApolloClient<NormalizedCacheObject>;
  private token: string | null = null;

  constructor() {
    this.graphql = new ApolloClient({
      link: ApolloLink.from([this.authLink(), this.httpLink()]),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          errorPolicy: 'all',  // or 'ignore', 'none'
        },
        mutate: {
          errorPolicy: 'all',  // or 'ignore', 'none'
        },
      },
    });
  }

  private httpLink() {
    return createHttpLink({
      uri: `${appEnv.API_BASE_URL}/graphql`,
    });
  }

  private authLink() {
    return setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: this.token ? `Bearer ${this.token}` : '',
        },
      };
    });
  }

  async login(loginInput: LoginInput): Promise<ApolloQueryResult<LoginQuery>> {
    const response = await this.graphql.query({
      query: LOGIN_QUERY,
      variables: {
        loginInput,
      },
    });

    this.token = response.data.login.token;

    return response;
  }
}
