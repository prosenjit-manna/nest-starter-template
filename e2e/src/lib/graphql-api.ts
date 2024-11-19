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
import { LOGIN_QUERY } from '../graphql/login-query.gql';
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
          errorPolicy: 'all', // or 'ignore', 'none'
          fetchPolicy: 'no-cache',
        },
        mutate: {
          errorPolicy: 'all', // or 'ignore', 'none'
          fetchPolicy: 'no-cache',
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

  public setToken(token: string) {
    this.token = token;
  }

  async login(loginInput: LoginInput): Promise<ApolloQueryResult<LoginQuery>> {
    const response = await this.graphql.query({
      query: LOGIN_QUERY,
      variables: {
        loginInput,
      },
    });

    // Store the token in local storage for future use
    this.token = response.data.login.token;

    return response;
  }
}
