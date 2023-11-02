import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { arbitrum, base, bsc, mainnet, optimism, polygon } from "wagmi/chains";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { infuraProvider } from "@wagmi/core/providers/infura";
import { publicProvider } from "@wagmi/core/providers/public";

const projectId = "296a55745d9880bb16e1386b1b0eb360";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, base, bsc, polygon, arbitrum, optimism],
  [
    publicProvider(),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID! }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Zoomer",
  projectId,
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
