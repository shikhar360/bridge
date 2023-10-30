import { Chain } from "wagmi/chains";
import { arbitrum, base, bsc, mainnet, optimism, polygon } from "wagmi/chains";
import { GRUMPY_BLUE, ZOOMER_YELLOW } from "./colors";

export type AssetConfig = {
  chains: Chain[];
  color: string;
};

export const configByAsset: Record<Assets, AssetConfig> = {
  zoomer: { color: ZOOMER_YELLOW, chains: [mainnet, base, polygon] },
  grumpycat: {
    color: GRUMPY_BLUE,
    chains: [mainnet, polygon, bsc, arbitrum, optimism],
  },
};

export const chainsByAsset: Record<Assets, Chain[]> = {
  zoomer: [mainnet, base, polygon],
  grumpycat: [mainnet, polygon, bsc, arbitrum, optimism],
};

export type Assets = "zoomer" | "grumpycat";
