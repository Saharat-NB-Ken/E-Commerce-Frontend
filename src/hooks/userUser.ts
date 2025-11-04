import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/user/me");
      return data;
    },
  });
};
