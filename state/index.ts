import { create } from "zustand";
import { ImageWithAnnotation } from "../@types/global";

interface GlobalState {
  imageList: ImageWithAnnotation[];
  setImageList: (imageList: ImageWithAnnotation[]) => void;
}

export const useStore = create<GlobalState>((set) => ({
  imageList: [],
  setImageList: (imageList) => set({ imageList }),
}));
