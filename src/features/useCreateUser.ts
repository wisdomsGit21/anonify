"use client";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useCreateUser = () => {
  const mutation = useMutation({
    mutationKey: ["user"],
    mutationFn: async (username: string) => {
      const response = await client.api.auth.register.$post({
        json: {
          username: username,
        },
      });
      if (response.status == 409) {
        throw new Error("Username already exists");
      }
      if (!response.ok) {
        throw new Error("Error creating user");
      }
      const data = await response.json();
      return data;
    },
  });
  return mutation;
};
