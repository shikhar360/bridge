import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { mainnet, polygon, base } from "wagmi/chains";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, base],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Zoomer",
  projectId: "296a55745d9880bb16e1386b1b0eb360",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider
      theme={extendTheme({
        styles: {
          global: () => ({
            body: {
              bg: "#FEFC52",
            },
          }),
        },
      })}
    >
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          coolMode
          chains={chains}
          showRecentTransactions={true}
          theme={darkTheme({
            accentColor: "#FEFC52",
            accentColorForeground: "black",
            borderRadius: "small",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
