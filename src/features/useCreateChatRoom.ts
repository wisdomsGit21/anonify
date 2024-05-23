"use client";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useCreateChatRoom = () => {
  const mutation = useMutation({
    mutationKey: ["messages"],
    mutationFn: async (ownerId: number) => {
      const response = await client.api.chatRoom.create.$post({
        json: {
          ownerId,
        },
      });
      if (response.status == 404) {
        throw new Error("For some reason this chat room exists");
      }
      if (!response.ok) {
        throw new Error("Error creating chatroom");
      }
      const data = await response.json();
      return data;
    },
  });
  return mutation;
};
