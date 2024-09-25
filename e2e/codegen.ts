import { CodegenConfig } from '@graphql-codegen/cli';
import { appEnv } from './src/lib/app-env';

const config: CodegenConfig = {
  schema: appEnv.API_BASE_URL + '/graphql',
  documents: ['src/graphql/**/*.ts'],
  generates: {
    './src/gql/': {
      preset: 'client',
    },
  },
};

export default config;
