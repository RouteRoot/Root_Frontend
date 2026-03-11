export type LoginRequest = {
  loginId: string;
  loginPw: string;
};

export type LoginResponse = {
  message?: string;
  token?: string;
  userId?: number;
  [key: string]: unknown;
};

export type LoginResult = {
  status: number;
  rawText: string;
  data: LoginResponse | null;
};
