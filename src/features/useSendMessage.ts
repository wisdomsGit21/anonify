"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

interface SendMessageArgs {
  content: string;
  chatRoomId: string;
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["messages"],
    mutationFn: async ({ content, chatRoomId }: SendMessageArgs) => {
      const response = await client.api.chatRoom[":chatRoomId"].message.$post({
        json: {
          content: content,
        },
        param: {
          chatRoomId: chatRoomId,
        },
      });

      if (!response.ok) {
        throw new Error("Error sending message");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: (_, { chatRoomId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatRoomId] });
    },
  });
  return mutation;
};
