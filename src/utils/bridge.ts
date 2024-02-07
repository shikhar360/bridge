import { arbitrum, base, bsc, mainnet, optimism, polygon } from "viem/chains";
import { Address } from "viem";

import { solana } from "./asset";
import {
  cciPxErc20BridgeAddress,
  zoomerXerc20LockboxBaseAddress,
} from "../generated";

export type Bridge = "connext" | "base" | "ccip" | "wormhole";

type BridgeConfig = {
  origin: number[];
  destination: number[];
  displayName: string;
};

export const bridgeConfig: Record<Bridge, BridgeConfig> = {
  connext: {
    origin: [mainnet.id, arbitrum.id, optimism.id, polygon.id, bsc.id],
    destination: [mainnet.id, arbitrum.id, optimism.id, polygon.id, bsc.id],
    displayName: "connext",
  },
  base: {
    origin: [mainnet.id],
    destination: [base.id],
    displayName: "base rollup",
  },
  ccip: {
    origin: [mainnet.id, arbitrum.id, optimism.id, polygon.id, bsc.id, base.id],
    destination: [
      mainnet.id,
      arbitrum.id,
      optimism.id,
      polygon.id,
      bsc.id,
      base.id,
    ],
    displayName: "chainlink ccip",
  },
  wormhole: {
    origin: [mainnet.id, solana.id],
    destination: [mainnet.id, solana.id],
    displayName: "wormhole",
  },
};

export const getApproveToByBridge = (
  bridge: Bridge,
  originChainId: number
): Address => {
  if (bridge === "base") {
    return zoomerXerc20LockboxBaseAddress[
      originChainId as keyof typeof zoomerXerc20LockboxBaseAddress
    ];
  }
  if (bridge === "ccip") {
    return cciPxErc20BridgeAddress[
      originChainId as keyof typeof cciPxErc20BridgeAddress
    ];
  } else {
    throw new Error(`Unknown bridge: ${bridge}`);
  }
};
