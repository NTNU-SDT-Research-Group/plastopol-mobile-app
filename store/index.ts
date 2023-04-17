import { create } from "zustand";
import { Image } from "../components/types";

interface GlobalState {
  imageList: Image[];
  setImageList: (imageList: Image[]) => void;
  labelMap: Record<string, { title: string; color: string }>
}

export const useStore = create<GlobalState>((set) => ({
  imageList: [],
  setImageList: (imageList) => set({ imageList }),
  labelMap: {
    electronics: { title: "Electronics", color: "97, 0, 255" },
    ceramic: { title: "Ceramic", color: "0, 236, 123" },
    glass: { title: "Glass", color: "219, 0, 255" },
    metal: { title: "Metal", color: "5, 0, 255" },
    paper: { title: "Paper", color: "0, 239, 196" },
    fabric: { title: "Fabric", color: "0, 102, 255" },
    wood: { title: "Wood", color: "255, 0, 0" },
    fishingGear: { title: "Fishing Gear", color: "0, 225, 239" },
    rubber: { title: "Rubber", color: "82, 255, 0" },
    softPlastic: { title: "Soft Plastic", color: "255, 199, 0" },
    hardPlastic: { title: "Hard Plastic", color: "255, 153, 0" },
  }
}));
