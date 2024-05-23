import { StateCreator } from "zustand";

type UserState = {
  id: number | null;
  username: string;
};

type UserActions = {
  setUserId: (id: number) => void;
  setUsername: (username: string) => void;
};

export type UserSlice = UserState & UserActions;

export const createUserSlice: StateCreator<
  UserSlice,
  [["zustand/immer", never]],
  [],
  UserSlice
> = (set) => ({
  id: null,
  username: "",
  setUsername: (username) => {
    set((state) => {
      state.username = username;
    });
  },
  setUserId: (id) => {
    set((state) => {
      state.id = id;
    });
  },
});
