"use client";

import { Flex, Spacer, VStack, useColorMode, Box } from "@chakra-ui/react";

import { NavBar } from "../../components/NavBar";
import { configByAsset } from "../../utils/asset";
import { Migrate } from "../../components/migrate/Migrate";

const Page = () => {
  const { colorMode } = useColorMode();
  return (
    <VStack
      spacing={4}
      align="stretch"
      p={4}
      backgroundColor={
        colorMode === "light" ? configByAsset["zoomer"].color : "black"
      }
      textColor={
        colorMode === "light" ? "black" : configByAsset["zoomer"].color
      }
    >
      <NavBar />
      <Flex>
        <Spacer />
        <Box width={{ base: "100%", md: "640px" }}>
          <Migrate />
        </Box>

        <Spacer />
      </Flex>
    </VStack>
  );
};

export default Page;
