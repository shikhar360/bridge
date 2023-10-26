"use client";

import {
  VStack,
  Box,
  Flex,
  Spacer,
  Button,
  LinkOverlay,
  LinkBox,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { NavBar } from "../components/NavBar";
import { BridgeUI } from "../components/BridgeUI";

const BUY_ZOOMER_LINK =
  "https://app.uniswap.org/#/tokens/ethereum/0x0d505c03d30e65f6e9b4ef88855a47a89e4b7676";

const Page = () => {
  const { colorMode } = useColorMode();
  return (
    <VStack
      spacing={4}
      align="stretch"
      p={4}
      backgroundColor={colorMode === "light" ? "#FEFC52" : "black"}
      textColor={colorMode === "light" ? "black" : "#FEFC52"}
    >
      <NavBar />
      <Flex>
        <Spacer />
        <Box width={{ base: "100%", md: "640px" }}>
          <BridgeUI />
          <LinkBox>
            <Button
              width="100%"
              backgroundColor={colorMode === "light" ? "black" : "#FEFC52"}
              color={colorMode === "light" ? "#FEFC52" : "black"}
              mt={4}
            >
              <LinkOverlay href={BUY_ZOOMER_LINK} isExternal>
                BUY ZOOMER
              </LinkOverlay>
            </Button>
            <Flex direction={"row"}>
              <Spacer />
              <Image
                src="/bridge2.png"
                boxSize="600px"
                alt="bridge"
                objectFit='cover'
              />
            </Flex>
          </LinkBox>
        </Box>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
      </Flex>
    </VStack>
  );
};

export default Page;
