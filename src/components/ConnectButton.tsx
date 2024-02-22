"use client";
import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/react";
import { formatAddress } from "@/utils/formatAddress";
import { chainsTheme } from "@/utils/colors";
import { useAccount } from "wagmi";
import { usePathname } from 'next/navigation'
import { projectId, wagmiConfig } from "@/wagmi";

interface IProp {
  colorTheme?: string;
}

createWeb3Modal({
  wagmiConfig: wagmiConfig as any,
  projectId,
})


export default function ConnectButton({ colorTheme = "bg-black"}: IProp) {
  const { open } = useWeb3Modal();
  const { address,  chain , isConnected} = useAccount();
  const pathname = usePathname()

  // const fallback = chainsTheme.some(
  //   (val) => val.chain == chain?.name.toUpperCase()
  // );

  return (
    <div
      className={` ${isConnected ? pathname === "/v2" ? 'bg-black' :"bg-white/30" : colorTheme} cursor-pointer py-[10px] px-[12px] rounded-[12px] h-[44px]   text-white font-semibold text-center`}
      onClick={() => open()}
    >
      {address ? (
        <div className="flex items-center justify-center gap-2">
          <img
            src={`/v2/logo/${chain?.id}.png`}
            alt="logo"
            className={`w-4`}
          />
          {formatAddress(address)}
        </div>
      ) : (
        <button onClick={() => open()}>Connect Wallet</button>
      )}
    </div>
  );
}
