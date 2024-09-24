import { PrismaService } from 'src/prisma.service';
import { LoginInput } from './login-input.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export default async function loginResolver({
  loginInput,
  prisma,
  generateToken,
}: {
  loginInput: LoginInput;
  prisma: PrismaService;
  generateToken: (
    user: User,
  ) => Promise<{ token: string; expiryDate: string; refreshToken: string }>;
}) {
  const user = await prisma.user.findFirst({
    where: {
      email: loginInput.email,
    },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isVerified) {
    throw new Error('Account not verified');
  }

  const isPasswordValid = await bcrypt.compare(
    loginInput.password,
    String(user?.password),
  );

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const { token, expiryDate, refreshToken } = await generateToken(user);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: refreshToken,
      refreshTokenExpiry: expiryDate,
    },
  });

  // Clear expired sessions
  // For improve performance
  await prisma.session.deleteMany({
    where: {
      refreshTokenExpiry: {
        lt: new Date(),
      },
    },
  });

  return {
    id: user?.id,
    token,
    refreshToken,
  };
}
