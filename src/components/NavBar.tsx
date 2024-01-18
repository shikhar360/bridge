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
import { wagmiConfig, projectId, chains } from "../wagmi";

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
});

export const NavBar = () => {
  const { toggleColorMode } = useColorMode();
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
  );
};
