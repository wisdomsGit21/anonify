"use client";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetUser = (param: string) => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await client.api.chatRoom.user[":id"].$get({
        param: { id: param },
      });
      if (!response.ok) {
        throw new Error("Failed to user");
      }
      const data = await response.json();
      return data;
    },
  });
  return query;
};
