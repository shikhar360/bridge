import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const NavBar = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
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
            colorScheme={colorMode === "light" ? "blackAlpha" : "yellow"}
            mr={5}
            onClick={toggleColorMode}
            // variant={"ghost"}
            aria-label="Toggle color mode"
            // icon={<SearchIcon />}
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          />
          <Box>
            <ConnectButton />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
