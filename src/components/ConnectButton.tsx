"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { formatAddress } from "@/utils/formatAddress";
import { chainsTheme } from "@/utils/colors";
import { useAccount } from "wagmi";

interface IProp {
  colorTheme?: string;
}
export default function ConnectButton({ colorTheme = "bg-white/30" }: IProp) {
  // 4. Use modal hook
  const { open } = useWeb3Modal();
  const { address,  chain } = useAccount();


  const fallback = chainsTheme.some(
    (val) => val.chain == chain?.name.toUpperCase()
  );

  return (
    <div
      className={` ${address ? "bg-white/30" : colorTheme} cursor-pointer py-2 px-6 rounded-xl text-white font-semibold text-center`}
      onClick={() => open()}
    >
      {address ? (
        <div className="flex items-center justify-center gap-2">
          <img
            src={`${!fallback ? "/v2/zoom.png" : `/v2/logo/${chain?.name?.toUpperCase()}.png`}`}
            alt="logo"
            className={`w-4`}
          />
          {formatAddress(address)}
        </div>
      ) : (
        <button onClick={() => open()}>Connect Button</button>
      )}
    </div>
  );
}
