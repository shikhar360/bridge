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
import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/react";
import { wagmiConfig, projectId, chains } from "../wagmi";
import { ZOOMER_YELLOW } from "../utils/colors";

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "light",
  themeVariables: {
    // "--w3m-accent": ZOOMER_YELLOW,
  },
});

export const NavBar = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { open } = useWeb3Modal();
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
            // variant={"ghost"}
            aria-label="Toggle color mode"
            // icon={<SearchIcon />}
            icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
          />
          {/* <Button onClick={() => open()}>Open Connect Modal</Button>
          <Button onClick={() => open({ view: "Networks" })}>
            Open Network Modal
          </Button> */}
          <w3m-button />
          <Box></Box>
        </Flex>
      </Flex>
    </Box>
  );
};
