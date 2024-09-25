import { appEnv } from "../lib/app-env";
import { loginAndGetToken } from "../page/login";
import { PrismaClient, UserType } from '@prisma/client';


describe('Login module', () => {
  [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.USER].forEach((type) => {
    test(`${type.toUpperCase()} Login`, async () => {
      const dbClient = new PrismaClient();
      const user = await dbClient.user.findFirst({
        where: {
          userType: type,
        },
      })
      if (!user) {
        return;
      }
      await loginAndGetToken(user?.email, appEnv.SEED_PASSWORD);
    });
  })

});
