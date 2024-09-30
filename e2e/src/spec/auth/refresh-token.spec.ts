import { appEnv } from '../../lib/app-env';
import { PrismaClient, UserType } from '@prisma/client';
import { GraphQlApi } from '../../lib/graphql-api';
import { REFRESH_TOKEN_MUTATION } from '../../graphql/refresh-token.gql';
import { CURRENT_USER_QUERY } from '../../graphql/current-user.gql';

describe('Refresh token module', () => {
  [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.USER].forEach((type) => {
    const dbClient = new PrismaClient();
    const api = new GraphQlApi();
    let refreshToken: string;
    beforeAll(async () => {
      const user = await dbClient.user.findFirst({
        where: {
          userType: type,
        },
      });
      if (!user) {
        return;
      }
      const response = await api.login({
        email: user.email,
        password: appEnv.SEED_PASSWORD,
      });
      refreshToken = response.data.login.refreshToken;
    });

    test('should return an error if the refresh token is invalid', async () => {
      const response = await api.graphql.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: {
          refreshAccessTokenInput: {
            refreshToken: `${refreshToken}-a`,
          },
        },
      });
      expect(response.errors?.[0]?.message).toBe('Session Invalid');
      
    });

    test('should generate a new access token when provided with a valid refresh token', async () => {
      const response = await api.graphql.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: {
          refreshAccessTokenInput: {
            refreshToken: refreshToken,
          },
        },
      });
      expect(response.data?.refreshAccessToken.token).toBeDefined();
      expect(response.data?.refreshAccessToken.refreshToken).toBeDefined();


      // Want to check if new access token working
      const currentUserResponse = await api.graphql.query({
        query: CURRENT_USER_QUERY,
      })

      expect(currentUserResponse.data).toBeDefined();
    });

    test('should return an error if the refresh token is not provided', async () => {
      const response = await api.graphql.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: {
          refreshAccessTokenInput: {
            refreshToken: '',
          },
        },
      });
      expect(response.errors?.[0]?.message).toBe('Session Invalid');
    });

   


  });
});
