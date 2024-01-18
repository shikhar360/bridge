import {
  Card,
  CardBody,
  VStack,
  Flex,
  Spacer,
  Heading,
  useColorMode,
  Box,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Button,
  Link,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { polygon } from "viem/chains";
import NextLink from "next/link";
import { Address, formatEther } from "viem";
import { Dispatch, SetStateAction, useState } from "react";

import { configByAsset } from "../../utils/asset";
import {
  useReadZoomerXerc20OldAllowance,
  useReadZoomerXerc20OldBalanceOf,
  useWriteZoomerMigratorMigrate,
  useWriteZoomerXerc20OldApprove,
  zoomerMigratorAddress,
} from "../../generated";

export const Migrate = () => {
  const { colorMode } = useColorMode();
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState(BigInt(0));
  return (
    <>
      <Link as={NextLink} href="/">
        {"<<<"} BACK TO BRIDGE
      </Link>
      <Card
        bg={
          colorMode === "light"
            ? configByAsset["zoomer"].color
            : "blackAlpha.100"
        }
        textColor={
          colorMode === "light" ? "black" : configByAsset["zoomer"].color
        }
        borderColor={
          colorMode === "light"
            ? "blackAlpha.400"
            : configByAsset["zoomer"].color
        }
        variant={"outline"}
        mt={4}
      >
        <CardBody>
          <VStack spacing={4} align="stretch" p={4} pb={0}>
            {!isConnected ||
            !walletClient?.account?.address ||
            !walletClient?.chain?.id ? (
              <Flex>
                <Spacer />
                <Box>
                  <w3m-button />
                </Box>
                <Spacer />
              </Flex>
            ) : walletClient.chain.id !== polygon.id ? (
              <Flex>
                <Spacer />
                <Box>
                  <Heading>SWITCH TO POLYGON</Heading>
                </Box>
                <Spacer />
              </Flex>
            ) : (
              <Flex direction={"column"}>
                <Box pb={4} pt={4}>
                  <Heading>MIGRATE ZOOMER</Heading>
                </Box>
                <BridgeDescription />
                <Box pt={4} />
                <OldZoomerDisplay
                  address={walletClient!.account!.address}
                  setAmount={setAmount}
                />
                <ActionButton
                  address={walletClient!.account!.address}
                  amount={amount}
                />
              </Flex>
            )}
          </VStack>
        </CardBody>
      </Card>
    </>
  );
};

type OldZoomerDisplayProps = {
  address: Address;
  setAmount: Dispatch<SetStateAction<bigint>>;
};
const OldZoomerDisplay = ({ address, setAmount }: OldZoomerDisplayProps) => {
  const { data, isSuccess } = useReadZoomerXerc20OldBalanceOf({
    args: [address],
  });
  if (isSuccess) {
    console.log("data: ", data);
    setAmount(data!);
  }
  return (
    <Stat>
      <StatLabel>Available to Migrate</StatLabel>
      <StatNumber>{!isSuccess ? "..." : formatEther(data!)}</StatNumber>
      <StatHelpText>$ZOOMER</StatHelpText>
    </Stat>
  );
};

type ActionButtonProps = {
  address: Address;
  amount: bigint;
};
const ActionButton = ({ amount, address }: ActionButtonProps) => {
  const { data, isSuccess } = useReadZoomerXerc20OldAllowance({
    args: [address, zoomerMigratorAddress[137]],
  });

  if (!isSuccess) {
    return <></>;
  }
  return data! < amount ? (
    <ApproveButton amount={amount} />
  ) : (
    <MigrateButton amount={amount} />
  );
};

type ApproveButtonProps = {
  amount: bigint;
};
const ApproveButton = ({ amount }: ApproveButtonProps) => {
  const { colorMode } = useColorMode();
  const [approvalLoading, setApprovalLoading] = useState(false);
  const { writeContractAsync } = useWriteZoomerXerc20OldApprove();
  const { waitForTransactionReceipt } = usePublicClient();

  const handleApprove = async () => {
    setApprovalLoading(true);
    try {
      const tx = await writeContractAsync({
        args: [zoomerMigratorAddress[137], amount],
      });
      await waitForTransactionReceipt({ hash: tx });
    } finally {
      setApprovalLoading(false);
    }
  };
  return (
    <Button
      variant="outline"
      borderColor="black"
      mr={2}
      size="md"
      onClick={() => handleApprove()}
      isDisabled={amount === BigInt(0)}
      isLoading={approvalLoading}
      loadingText="/CHECK_WALLET"
      width="100%"
      backgroundColor={
        colorMode === "light" ? "black" : configByAsset["zoomer"].color
      }
      color={colorMode === "light" ? configByAsset["zoomer"].color : "black"}
    >
      /APPROVE
    </Button>
  );
};

type MigrateButtonProps = {
  amount: bigint;
};
const MigrateButton = ({ amount }: MigrateButtonProps) => {
  const { colorMode } = useColorMode();
  const [migrateLoading, setMigrateLoading] = useState(false);
  const { writeContractAsync } = useWriteZoomerMigratorMigrate();
  const { waitForTransactionReceipt } = usePublicClient();

  const handleMigrate = async () => {
    setMigrateLoading(true);
    try {
      const tx = await writeContractAsync({ args: [amount] });
      await waitForTransactionReceipt({ hash: tx });
    } finally {
      setMigrateLoading(false);
    }
  };
  return (
    <Button
      variant="outline"
      borderColor="black"
      mr={2}
      size="md"
      onClick={() => handleMigrate()}
      isLoading={migrateLoading}
      loadingText="/CHECK_WALLET"
      width="100%"
      backgroundColor={
        colorMode === "light" ? "black" : configByAsset["zoomer"].color
      }
      color={colorMode === "light" ? configByAsset["zoomer"].color : "black"}
    >
      /MIGRATE
    </Button>
  );
};

const BridgeDescription = () => {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton width="100%">
            <Box as="span" flex="1" textAlign="left">
              <Text as="b">what is this??</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Text as="b">
            the xerc20 on Polygon had to change due to some configuration
            changes on the Connext side. zoomer was one of the earliest xerc20
            tokens and needs to pick up changes that have happened since then.
            <br />
            <br />
            old zoomer tokens will be migrated 1:1 to new zoomer tokens. the old
            ones cannot be bridged to any chain. the migration process is
            one-way only.
            <br />
            <br />
            <Link
              href="https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62"
              isExternal
              color="blue.400"
            >
              old zoomer xerc20 contract
            </Link>
            <br />
            <Link
              href="https://polygonscan.com/address/0xB962150760F9A3bB00e3E9Cf48297EE20AdA4A33"
              isExternal
              color="blue.400"
            >
              new zoomer xerc20 contract
            </Link>
            <br />
            <Link
              href="https://polygonscan.com/address/0x3045597e25f8c57e32c08fe5276c5cf4aa4dd7f7#readContract"
              isExternal
              color="blue.400"
            >
              zoomer migrator
            </Link>
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
