import { TUser } from './user';

export type TMessage = {
  id: number;
  user: TUser;
  text: string;
  created_at: string;
};
