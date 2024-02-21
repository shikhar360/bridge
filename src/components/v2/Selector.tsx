"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { BiChevronDown } from "react-icons/bi";
// import { AiOutlineSearch } from "react-icons/ai";
//@ts-ignore
import { switchChain } from "@wagmi/core";
import { solana } from "@/utils/asset";
import { wagmiConfig } from "@/wagmi";
import { getChainName } from "@/utils/chaintoname";
import { getThemeColor } from "@/utils/colors";
import {
  useWalletClient,
  useAccount
} from "wagmi";

interface ISelector {
  options: number[];
  setOriginChain: Dispatch<SetStateAction<number | undefined>>;

}

const Selector = ({ options, setOriginChain  }: ISelector) => {
  const [selected, setSelected] = useState<number>();
  const [open, setOpen] = useState<boolean>(false);
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();

  function getColor (chain : number){
    const { theme } = getThemeColor(chain);
    const textcolor = theme.slice(4,-3)
    return { theme , textcolor}
  }

  useEffect(()=>{
      if(isConnected || walletClient?.chain){
        setSelected(walletClient?.chain?.id )
      }
  },[isConnected , walletClient?.chain])

  return (
    <div className="w-full capitalize  relative">
      <div
        onClick={() => setOpen(!open)}
        className={` cursor-pointer py-2 text-black w-full  flex  items-center justify-start gap-2 rounded `}
      >
        {selected ? (
          < div style={{color : getColor(+selected).textcolor ,  background : getColor(+selected).theme ,  }} className={`w-max font-bold  flex items-center px-3 py-1.5 gap-2 justify-start capitalize `}>
            {" "}
            <img
              src={`/v2/logo/${selected}.png`}
              alt="logo"
              className={`w-4`}
            />{" "}
            {getChainName(+selected).toLowerCase()}
          </div>
        ) : (
          "Select Chain"
        )}

        <ul
          className={`bg-red  left-0 overflow-y-scroll w-[150%] ${
            open ? "block" : "hidden"
          } absolute top-full origin-top z-40 shadow-xl shadow-black/10 bg-white rounded-xl px-4 py-2`}
        >
          {options &&
            options.map((chainId: number, idx: number) => (
              <li
                value={chainId}
                key={idx}
                className={`  text-sm flex w-max  mt-2 rounded-xl 
          ${+chainId === selected && "bg-stone-200"} ${getColor(+chainId).theme} `}
                onClick={async () => {
                  if (+chainId !== selected) {
                    setSelected(+chainId);
                    setOriginChain(+chainId);
                    setOpen(false);

                    if (+chainId !== solana.id) {
                      await switchChain(wagmiConfig, {
                        chainId: +chainId,
                      });
                    }
                  }
                }}
              >
                 <div style={{color : getColor(+chainId).textcolor}} className={`w-full font-bold bg-white/90 flex items-center px-3 py-1.5 gap-2 justify-start capitalize `}>


                <img
                  src={`/v2/logo/${chainId}.png`}
                  alt="logo"
                  className={`w-4`}
                  />
                {chainId && getChainName(+chainId).toLowerCase()}
                  </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Selector;
