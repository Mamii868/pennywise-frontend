export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role?: string;
};

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
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