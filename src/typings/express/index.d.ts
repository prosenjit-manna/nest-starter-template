import { Express } from 'express';

declare global {
  namespace Express {
    interface Request extends Request {
      jwt?: any;
      user?: {
        id: string;
        email: string;
        name: string | null;
        UserRole: {
          id: string;
          userId: string | null;
          roleId: string | null;
        }[];
      } | null;
    }
  }
}
