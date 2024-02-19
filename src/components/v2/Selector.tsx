"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { BiChevronDown } from "react-icons/bi";
// import { AiOutlineSearch } from "react-icons/ai";
//@ts-ignore
import { switchChain } from "@wagmi/core";
import { solana } from "@/utils/asset";
import { wagmiConfig } from "@/wagmi";
import { getChainName } from "@/utils/chaintoname";
interface ISelector {
  options: number[];
  setOriginChain: Dispatch<SetStateAction<number | undefined>>;
}

const Selector = ({ options, setOriginChain }: ISelector) => {
  const [selected, setSelected] = useState<number>();
  const [open, setOpen] = useState<boolean>(false);


  return (
    <div className="w-full capitalize  relative">
      <div
        onClick={() => setOpen(!open)}
        className={` cursor-pointer p-2 text-black w-full  flex  truncate items-center justify-start gap-2 rounded `}
      >
        {selected ? (
          <>
            {" "}
            <img
              src={`/v2/logo/${selected}.png`}
              alt="logo"
              className={`w-4`}
            />{" "}
            {getChainName(+selected).toLowerCase()}
          </>
        ) : (
          "Select Chain"
        )}

        <ul
          className={`bg-red  left-0 overflow-y-scroll w-full ${
            open ? "block" : "hidden"
          } absolute top-full origin-top shadow-xl shadow-black/10 bg-white rounded-xl`}
        >
          {options &&
            options.map((chainId: number, idx: number) => (
              <li
                value={chainId}
                key={idx}
                className={` p-2 text-sm flex w-full  items-center  gap-2 justify-start  rounded-xl 
          ${+chainId === selected && "bg-stone-200"} `}
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
                <img
                  src={`/v2/logo/${chainId}.png`}
                  alt="logo"
                  className={`w-4`}
                />
                {chainId && getChainName(+chainId).toLowerCase()}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Selector;
