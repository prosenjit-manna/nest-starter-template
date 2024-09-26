import { appEnv } from './app-env';

export const waitForTime = () => {
  new Promise((resolve) => setTimeout(resolve, appEnv.TIMEOUT));
};
