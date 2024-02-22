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
  setOpen:  Dispatch<SetStateAction<boolean>> ;
   open : boolean;
  newRef : any;
  destinationChain : number
}

const Selector = ({ options, setOriginChain , newRef ,open , setOpen , destinationChain }: ISelector) => {
  const [selected, setSelected] = useState<string>();
  // const [open , setOpen] = useState<boolean>(false)
  // console.log(open , setOpen )
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();

  function getColor (chain : number){
    const { theme } = getThemeColor(chain);
    const textcolor = theme.slice(4,-3)

    return { theme , textcolor}
  }

  useEffect(()=>{
      if(isConnected || walletClient?.chain){
        setSelected(walletClient?.chain?.id.toString())
      }
  },[isConnected , walletClient?.chain])

  
  return (
    <div  ref={newRef} className="w-full capitalize text-sm  relative ">
      <div
        onClick={() => setOpen(!open)}
        className={` cursor-pointer my-2 text-black  w-full  flex  items-center justify-start gap-2 rounded-[12px] border border-black/20 `}
      >
        {selected && destinationChain?.toString() !== selected ? (
          < div style={{color : getColor(+selected).textcolor ,  backgroundColor : getColor(+selected).textcolor+"1a" ,  }} className={`w-max font-semibold rounded-[8px] flex items-center mx-2 my-1 px-2 py-0.5 gap-2 justify-start capitalize `}>
            {" "}
            <img
              src={`/v2/logo/${selected}.png`}
              alt="logo"
              className={`w-4`}
            />{" "}
            {selected === "0" ? "Solana" : getChainName(+selected).toLowerCase()}
            <img   className={`w-3 transition-all duration-100 ease-linear absolute right-2 ${open ? "rotate-180" : 'rotate-0'} `} src="https://img.icons8.com/ios/50/000000/expand-arrow--v2.png" alt="expand-arrow--v2"/>
          </div>
        ) : (
          <span className='px-3 rounded-[8px]  mx-2 my-1 px-2 py-0.5'> Select Chain</span>
        )}

        <ul
          className={`  left-0 overflow-y-scroll w-[150%] ${
            open ? "block" : "hidden"
          } absolute top-full origin-top z-40 shadow-xl shadow-black/10 bg-white rounded-xl px-4 py-2 border border-black/10`}
        >
          {options &&
            options.map((chainId: number, idx: number) => (
              <li
                value={chainId}
                key={idx}
                className={`  text-sm flex w-max  mt-2 rounded-xl 
          ${selected && +chainId === +selected  ? "hidden" : 'block'} ${getColor(+chainId).theme} `}
                onClick={async () => {
                  if (selected && +chainId !== +selected ) {
                    setSelected(chainId?.toString());
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
                 <div style={{color : getColor(+chainId).textcolor}} className={`w-full font-semibold bg-white/90 flex items-center px-3 py-1.5 gap-2 justify-start capitalize `}>


                <img
                  src={`/v2/logo/${chainId}.png`}
                  alt="logo"
                  className={`w-4`}
                  />
                {chainId && chainId === 0 ? "Solana" : getChainName(+chainId).toLowerCase()}
                  </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Selector;
