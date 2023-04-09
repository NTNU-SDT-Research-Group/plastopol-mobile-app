import { create } from "zustand";
import { Image } from "../@types/global";

interface GlobalState {
  imageList: Image[];
  setImageList: (imageList: Image[]) => void;
  labelMap: Record<string, { title: string; color: string }>
}

export const useStore = create<GlobalState>((set) => ({
  imageList: [],
  setImageList: (imageList) => set({ imageList }),
  labelMap: {
    label1: { title: "Metal", color: "255, 0, 0" },
    label2: { title: "Plastic", color: "100, 200, 300" },
  }
}));
