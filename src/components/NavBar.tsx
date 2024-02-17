"use client"
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { wagmiConfig, projectId } from "../wagmi";
import {getThemeColor} from "@/utils/colors"
import ConnectButton from "@/components/ConnectButton"


createWeb3Modal({
  wagmiConfig: wagmiConfig as any,
  projectId,
})

import { usePathname , useRouter } from 'next/navigation'

export const NavBar = () => {
  const { toggleColorMode } = useColorMode();
  const pathname = usePathname()
  const router = useRouter()
  
  console.log(pathname)
  // const theme = getThemeColor(pathname)
  return (
   <div className={`flex items-center justify-between px-[15%] py-4 fixed top-0 left-0 w-full`}>
    <img onClick={()=>router.back()} className={`${pathname === '/' ? "hidden" : "block"}`} src="https://img.icons8.com/ios/50/left-squared--v1.png" alt="left-squared--v1"/>
    <div className={`w-12 rounded-full bg-yellow-300 overflow-hidden`}>
      <img src="/v2/zoom.png" alt="" className={`w-10`} />
    </div>
    <ConnectButton/>
    {/* <w3m-button /> */}
   </div>
  );
};

/*
 <Box h="40px">
      <Flex>
        <Box>
          <Heading size={"lg"}>
            <a href="https://zoomer.money">/TAKE_ME_HOME</a>
          </Heading>
        </Box>
        <Spacer />
        <Flex direction={"row"}>
          <IconButton
            colorScheme={useColorModeValue("blackAlpha", "yellow")}
            mr={5}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
          />
          <w3m-button />
          <Box></Box>
        </Flex>
      </Flex>
    </Box>

*/