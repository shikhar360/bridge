"use client";
import { getThemeColor } from "@/utils/colors";
import ConnectButton from "@/components/ConnectButton"
interface Iprops {
  params: { bridgeTo: string };
}

export default function Page({ params }: Iprops) {
  const { theme } = getThemeColor(params?.bridgeTo);
  console.log(theme, params?.bridgeTo);

  return (
    <div
      className={`${theme} w-full min-h-screen flex flex-col items-center justify-center`}
    >
      <div className={` w-[30%] bg-white/50 rounded-3xl p-4    `}>
        <div
          className={`w-full p-[1rem] bg-white h-full min-h-[60vh] rounded-2xl `}
        >
           <ConnectButton colorTheme={theme} />
        </div>
      </div>
    </div>
  );
}

/*
 <div  className={``}>
      Dashboard
    </div>
*/
