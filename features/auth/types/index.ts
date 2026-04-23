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


export type SignupRequest = {
  loginId: string;
  loginPw: string;
  name: string;
  nickname: string;
  birthDate: string;
  phoneNumber: string;
};

export type SignupResponse = {
  message?: string;
};

export type SignupResult = {
  status: number;
  rawText: string;
  data: SignupResponse | null;
};