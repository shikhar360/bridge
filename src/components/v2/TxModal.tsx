"use client"
import {Dispatch , SetStateAction} from 'react';
import Link from "next/link";

type TxModalProps = {
  txHash: string;
  bridge: string;
  setTxModal : Dispatch<SetStateAction<boolean>>;
  fee : number;
  amountIn : number;
  textcolor : string
};
const TxModal = ({
  txHash ,
  bridge ,
  setTxModal,
  fee,
  amountIn,
  textcolor,
}: TxModalProps) => {
  return (
    <div
      className={`w-full min-h-screen bg-black/30 flex items-center justify-center`}
    >
      
      <div
        className={`lg:w-[30%] w-[80%] sm:w-[50%] md:w-[40%] min-h-max bg-white flex flex-col rounded-xl items-start justify-start  py-8 lg:px-10 px-5 relative`}
      >
         <img
            className={`w-6 cursor-pointer absolute right-4 top-4 `}
            onClick={() => setTxModal(false)}
            src="https://img.icons8.com/fluency-systems-regular/48/delete-sign--v1.png"
            alt="delete-sign--v1"
          />
        <p className="font-semibold">Transaction Confirmation</p>
        <p className={` text-4xl  text-center w-full mt-8`}>5 mins</p>
        <p className={` text-lg text-black/30 text-center w-full mt-2`}>
          Deposite in Progress
        </p>
        <div className={`flex flex-col w-full mt-8 gap-y-2 text-sm`}>
          <div className={`flex items-center w-full justify-between`}>
            <span>Time to Chain</span>
            <span>5 mins</span>
          </div>
          <div className={`flex items-center w-full justify-between`}>
            <span>Bridge</span>
            <span>{bridge}</span>
          </div>
          <div className={`flex items-center w-full justify-between`}>
            <span>Fees</span>
            <span>{fee.toFixed(5)}</span>
          </div>
          <div className={`flex items-center w-full justify-between`}>
            <span>You will receive</span>
            <span>{(Number(amountIn) * 0.9995).toFixed(5)}</span>
          </div>
        </div>

        <Link
          href={` ${
            bridge === "connext"
              ? `https://connextscan.io/tx/${txHash}`
              : bridge === "ccip"
              ? `https://ccip.chain.link`
              : null
          }`}
          className={` w-full mt-6  flex items-center justify-center  py-[10px] px-[12px] rounded-[12px] h-[44px]`}
          style={{color: textcolor , backgroundColor : textcolor+"1a" }}
        >
          <img
            className="w-5 "
          style={{color: textcolor , backgroundColor : textcolor+"1a" }}
          src={`https://img.icons8.com/ios-glyphs/30/${textcolor.slice(1)}/external-link.png`}
            alt="external-link"
          />
          <span>Track in Explorer </span>
        </Link>
      </div>
    </div>
  );
};

export default TxModal;
