import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { base, mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";


const projectId = "296a55745d9880bb16e1386b1b0eb360";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, base],
  [publicProvider()]
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
