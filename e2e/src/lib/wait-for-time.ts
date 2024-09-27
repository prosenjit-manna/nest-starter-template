import { appEnv } from './app-env';

export const waitForTime = (timeout: number = appEnv.TIMEOUT) => {
  new Promise((resolve) => setTimeout(resolve, timeout));
};
