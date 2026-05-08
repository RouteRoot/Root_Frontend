import { axiosInstance } from "../axios/axiosInstance";

export type MeResponse = {
  loginId: string;
  name: string;
  nickname?: string;
};

export const getMe = async (): Promise<MeResponse> => {
  const res = await axiosInstance.get("/users/me");
  return res.data;
};
