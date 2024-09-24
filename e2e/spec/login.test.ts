import { loginAndGetToken } from "../page/login";


describe('Login module', () => {
  let authToken: string | null = null; 

  beforeAll(async () => {
    authToken = await loginAndGetToken("example+admin-1@exanple.com", "SamLauncher@123");
  });

  test('verify token usage', () => {
    expect(authToken).toBeDefined();
    console.log('Stored token:', authToken);
  });

});
