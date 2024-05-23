import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { Store } from "./types";
import { createUserSlice } from "./user-slice";

export const useStore = create<Store>()(
  persist(
    subscribeWithSelector(
      immer((...a) => ({
        ...createUserSlice(...a),
      }))
    ),
    {
      name: "user-state",
    }
  )
);
