export type IForm<T> = {
  [K in keyof T]?: any;
}

export class User {
  id?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
}