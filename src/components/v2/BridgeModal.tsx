"use client"
import Link from "next/link";
import {Dispatch , SetStateAction} from 'react';
import { Bridge } from "@/utils/bridge";

interface IBridgeModal {
 bridges : any[];
 amountIn : number ;
 setModal : Dispatch<SetStateAction<boolean>>;
 setBridge : Dispatch<SetStateAction<Bridge | undefined>>;
}

const BridgeModal = ({bridges , amountIn , setModal , setBridge} : IBridgeModal ) => {
  return (
    <div
          className={`p-[1rem] bg-white   min-h-max rounded-2xl lg:w-[30%] w-[80%] sm:w-[50%] md:w-[40%] pb-10 pt-2 relative `}
        > 
        <p className={`mt-2 mb-4 font-semibold `}>Select Bridge</p>
          <img
            className={`w-4 cursor-pointer absolute right-4 top-4 `}
            onClick={() => setModal(false)}
            src="https://img.icons8.com/fluency-systems-regular/48/delete-sign--v1.png"
            alt="delete-sign--v1"
          />
          {bridges.map((bridge, index) => {
            return (
              <div
                onClick={() => {
                  setBridge(bridge.bridge as Bridge);
                  setModal(false);
                }}
                key={index}
              >
                <div
                  className={` w-full flex mt-2 items-center justify-start rounded-t-2xl border border-black/20 p-3 cursor-pointer`}
                >
                  <div
                    className={` flex w-max items-center justify-start gap-x-2 `}
                  >
                    <span className="capitalize font-bold">You Receive</span>
                  </div>
                  <div
                    className={` ml-auto  flex flex-col items-end justify-end`}
                  >
                    <div className={` flex items-center justify-center gap-1`}>
                      <div
                        className={`w-4  rounded-full bg-yellow-400 flex overflow-hidden`}
                      >
                        <img src="/v2/zoom.png" alt="" className={`w-full `} />
                      </div>
                      <span className={`text-sm`}>
                        {amountIn
                          ? (Number(amountIn) * 0.09995).toFixed(5)
                          : "0"}
                      </span>
                    </div>
                    <p className={`text-xs text-black/40`}>$0.00</p>
                  </div>
                </div>
                <div
                  className={`w-full -translate-y-2 px-4  flex items-center justify-start rounded-b-2xl gap-2 mt-0 bg-blue-100 text-blue-900 text-sm`}
                >
                  <span className={` uppercase `}>
                    {" "}
                    {bridge.bridgeConfig.displayName}
                  </span>
                  <div className={` flex  items-center justify-center w-max`}>
                    <img
                      className={` w-4 py-1 `}
                      src="https://img.icons8.com/windows/32/044F9F/clock--v1.png"
                      alt="clock--v1"
                    />
                    <span className={`  `}> ~ 5 mins</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
  )
}

export default BridgeModal