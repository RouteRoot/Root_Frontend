import { axiosInstance } from "@/app/api/axios/axiosInstance";

import type {
  LoginRequest,
  LoginResponse,
  LoginResult,
  SignupRequest,
  SignupResponse,
  SignupResult,
} from "@/app/api/auth/authTypes";

export const login = async (payload: LoginRequest): Promise<LoginResult> => {
  const response = await axiosInstance.post("/users/login", payload, {
    transformResponse: [(data) => data],
  });

  const rawText =
    typeof response.data === "string"
      ? response.data
      : JSON.stringify(response.data, null, 2);

  let parsedData: LoginResponse | null = null;

  if (typeof response.data === "string" && response.data.trim()) {
    try {
      parsedData = JSON.parse(response.data) as LoginResponse;
    } catch {
      parsedData = null;
    }
  } else if (typeof response.data === "object" && response.data !== null) {
    parsedData = response.data as LoginResponse;
  }

  return {
    status: response.status,
    rawText,
    data: parsedData,
  };
};

export const signup = async (payload: SignupRequest): Promise<SignupResult> => {
  const response = await axiosInstance.post("/users/signup", payload, {
    transformResponse: [(data) => data],
  });

  const rawText =
    typeof response.data === "string"
      ? response.data
      : JSON.stringify(response.data, null, 2);

  let parsedData: SignupResponse | null = null;

  if (typeof response.data === "string" && response.data.trim()) {
    try {
      parsedData = JSON.parse(response.data) as SignupResponse;
    } catch {
      parsedData = { message: response.data };
    }
  } else if (typeof response.data === "object" && response.data !== null) {
    parsedData = response.data as SignupResponse;
  }

  return {
    status: response.status,
    rawText,
    data: parsedData,
  };
};
