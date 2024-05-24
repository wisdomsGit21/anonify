"use client";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetMessages = (param: string) => {
  const query = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await client.api.chatRoom[":chatRoomId"].$get({
        param: { chatRoomId: param },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      return data;
    },
    refetchInterval: 2000,
  });
  return query;
};
