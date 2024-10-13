import { TUser } from '@/types/user';

export type TToken = TUser & {
  tokenString: string;
  expiresAt: Date;
};
