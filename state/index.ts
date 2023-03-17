import { create } from "zustand";
import { Image } from "../@types/global";

interface GlobalState {
  imageList: Image[];
  setImageList: (imageList: Image[]) => void;
}

export const useStore = create<GlobalState>((set) => ({
  imageList: [],
  setImageList: (imageList) => set({ imageList }),
}));
