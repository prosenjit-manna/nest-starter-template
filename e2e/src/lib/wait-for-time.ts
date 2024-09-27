import { appEnv } from './app-env';

export const waitForTime = (timeout: number = appEnv.TIMEOUT) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
