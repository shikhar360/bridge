"use client";
import { chainsTheme } from "@/utils/colors";
import { getChainName } from "@/utils/chaintoname";
import Link from "next/link";

export default function Page() {

  return (
    <div
      className={` flex flex-col w-full min-h-screen items-start justify-start px-[15%] py-24 bg-white`}
    >
      <p className={` text-3xl font-semibold`}>Brigde 🌉</p>
      <p>Select the destination chain you want to bridge your ZOOMER to.</p>
      <div className={`mt-8 w-full grid grid-cols-4 gap-4`}>
        {chainsTheme.map((chain: any, idx: number) => (
          <Link
            key={idx}
            className={` w-full ${chain.theme} px-4 py-2 text-white rounded-2xl relative cursor-pointer`}
            href={`/v2/${chain.chain}`}
          >
            <img
              src={`/v2/logo/${chain.chain}.png`}
              alt=""
              className={`w-6 absolute  top-2 right-2`}
            />
            <img
              src="/v2/zoom.png"
              alt=""
              className={`w-full mix-blend-luminosity mt-4 `}
            />
            <p className={` text-2xl mt-4 text-center font-semibold `}>
              {getChainName(chain.chain)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/*
 <div  className={``}>
      Dashboard
    </div>
*/
