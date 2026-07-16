export type User = {
  id: string;
  username: string;
  password?: string;
  role: string;
};

export type CreateUserPayload = {
  username: string;
  password: string;
  [key: string]: unknown;
};

export type UpdateUserPayload = {
  username: string;
  password?: string;
  role?: string;
  [key: string]: unknown;
};

export type LoginPayload = {
  username: string;
  password: string;
};