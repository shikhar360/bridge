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
import { useState } from "react";

import { NavBar } from "../components/NavBar";
import { BridgeUI } from "../components/BridgeUI";
import { Asset, configByAsset } from "../utils/asset";

const Page = () => {
  const { colorMode } = useColorMode();
  const [asset, setAsset] = useState<Asset>("zoomer");
  return (
    <VStack
      spacing={4}
      align="stretch"
      p={4}
      backgroundColor={
        colorMode === "light" ? configByAsset[asset].color : "black"
      }
      textColor={colorMode === "light" ? "black" : configByAsset[asset].color}
    >
      <NavBar />
      <Flex>
        <Spacer />
        <Box width={{ base: "100%", md: "640px" }}>
          <BridgeUI asset={asset} setAsset={setAsset} />
          <LinkBox>
            <Button
              width="100%"
              backgroundColor={
                colorMode === "light" ? "black" : configByAsset[asset].color
              }
              color={
                colorMode === "light" ? configByAsset[asset].color : "black"
              }
              mt={4}
            >
              <LinkOverlay href={configByAsset[asset].buyLink} isExternal>
                BUY {asset.toUpperCase()}
              </LinkOverlay>
            </Button>
            <Flex direction={"row"}>
              <Spacer />
              <Image
                src={
                  colorMode === "light"
                    ? "/bridge2.png"
                    : `/bridge-dark-${asset.toLowerCase()}.png`
                }
                boxSize="600px"
                alt="bridge"
                objectFit="cover"
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
