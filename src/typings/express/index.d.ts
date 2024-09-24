import { Express } from 'express';

declare global {
  namespace Express {
    interface Request extends Request {
      jwt?: any;
      user?: {
        id: string;
        email: string;
        name: string | null;
        password: string | null;
        verificationToken: string | null;
        passwordResetToken: string | null;
        isVerified: boolean;
        userStatus: $Enums.userStatus;
        userType: $Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null
    }
  }
}
