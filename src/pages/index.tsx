import {
  Box,
  Flex,
  Heading,
  Spacer,
  VStack,
  Input,
  Select,
  Button,
  Code,
  Link,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useDebounce } from "usehooks-ts";
import { arbitrum, base, mainnet, polygon } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther, parseEther } from "viem";
import { SdkBase, SdkConfig, SdkUtils, create } from "@connext/sdk";
import { erc20ABI } from "wagmi";
import { chainIdToDomain } from "@connext/nxtp-utils";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { debounce } from "lodash";
import { prepareWriteContract } from "wagmi/actions";
import { xerc20LockboxAbi } from "@/abi/xerc20Lockbox";

const chains = [mainnet, base, polygon, arbitrum];

const WRAPPED_ZOOMER_MAINNET = "0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A";
const ZOOMER_WRAPPER_MAINNET = "0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393";

const zoomer: Record<number, `0x${string}`> = {
  [mainnet.id]: "0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676",
  [polygon.id]: "0xb2588731d8f6F854037936d6ffac4c13d0b6bd62",
  [arbitrum.id]: "0xBB1B173cdFBe464caaaCeaB2a9c8C44229d62D14",
};

export default function Home() {
  const addRecentTransaction = useAddRecentTransaction();
  const [_amountIn, setAmountIn] = useState("");
  const amountIn = useDebounce(_amountIn, 500);
  const [balance, setBalance] = useState(BigInt(0));
  const [amountToWrap, setAmountToWrap] = useState("");
  const [amountToUnwrap, setAmountToUnwrap] = useState("");
  const [wrappedBalance, setWrappedBalance] = useState(BigInt(0));
  const [tabIndex, setTabIndex] = useState(0);
  const [relayerFee, setRelayerFee] = useState("0");
  const [relayerFeeLoading, setRelayerFeeLoading] = useState(false);
  const [approvalNeeded, setApprovalNeeded] = useState(true);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [xcallLoading, setXCallLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [xcallTxHash, setXCallTxHash] = useState("");
  const [destinationChain, setDestinationChain] = useState<number | undefined>(
    undefined
  );
  const [connext, setConnext] = useState<
    { sdkBase: SdkBase; sdkUtils: SdkUtils } | undefined
  >();
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { waitForTransactionReceipt, readContract } = usePublicClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    const run = async () => {
      const sdkConfig: SdkConfig = {
        signerAddress: walletClient?.account?.address,
        network: "mainnet",
        chains: {
          [chainIdToDomain(mainnet.id)]: {
            providers: ["https://eth.llamarpc.com", "https://1rpc.io/eth"],
          },
          [chainIdToDomain(arbitrum.id)]: {
            providers: [
              "https://1rpc.io/arb",
              "https://arbitrum-one.publicnode.com",
              "https://rpc.ankr.com/arbitrum",
            ],
          },
          [chainIdToDomain(polygon.id)]: {
            providers: [
              "https://polygon.llamarpc.com",
              "https://polygon.rpc.blxrbdn.com",
              "https://polygon-bor.publicnode.com",
            ],
          },
        },
      };
      const { sdkBase, sdkUtils } = await create(sdkConfig);
      setConnext({ sdkBase, sdkUtils });
      if (!walletClient) {
        return;
      }
      const _balance = await readContract({
        address: zoomer[walletClient!.chain.id],
        args: [walletClient!.account!.address!],
        abi: erc20ABI,
        functionName: "balanceOf",
      });
      console.log("_balance: ", _balance);
      setBalance(_balance);
    };
    run();
  }, [
    readContract,
    walletClient,
    walletClient?.account?.address,
    walletClient?.chain?.id,
  ]);

  const getRelayerFee = async (destinationChain: string) => {
    console.log("getting relayer fee: ", destinationChain);
    setRelayerFeeLoading(true);
    const fee = await connext?.sdkBase.estimateRelayerFee({
      originDomain: chainIdToDomain(walletClient!.chain.id),
      destinationDomain: chainIdToDomain(+destinationChain),
    });
    console.log("relayer fee: ", fee);
    setRelayerFeeLoading(false);
    setRelayerFee((fee ?? "0").toString());
  };

  const handleSwitchDestinationChain = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setDestinationChain(+event.target.value);
    if (event.target.value === base.id.toString()) {
      setRelayerFee("0");
      const _balance = await readContract({
        address: WRAPPED_ZOOMER_MAINNET,
        args: [walletClient!.account!.address!],
        abi: erc20ABI,
        functionName: "balanceOf",
      });
      console.log("wrapped _balance: ", _balance);
      setWrappedBalance(_balance);
    } else {
      await getRelayerFee(event.target.value);
    }
  };

  const getAllowance = debounce(async (amount: string) => {
    const allowance = await readContract({
      address: zoomer[walletClient!.chain.id],
      args: [walletClient!.account!.address!, ZOOMER_WRAPPER_MAINNET],
      abi: erc20ABI,
      functionName: "allowance",
    });
    console.log("allowance: ", allowance);
    console.log("amount: ", amount);
    if (BigInt(allowance) < parseEther(amount)) {
      setApprovalNeeded(true);
    } else {
      setApprovalNeeded(false);
    }
  });

  const handleWrapAmountChanged = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setAmountToWrap(event.target.value);
    await getAllowance(event.target.value);
  };

  const handleApproveWrap = async () => {
    setApprovalLoading(true);
    try {
      console.log(
        "approveIfNeeded: ",
        chainIdToDomain(walletClient!.chain.id).toString(),
        zoomer[walletClient!.chain.id],
        parseEther(amountToWrap).toString(),
        true
      );
      const prepApprove = await prepareWriteContract({
        abi: erc20ABI,
        address: zoomer[walletClient!.chain.id],
        functionName: "approve",
        args: [ZOOMER_WRAPPER_MAINNET, parseEther(amountToWrap)],
      });
      console.log("prepApprove: ", prepApprove);
      const res = await walletClient!.writeContract(prepApprove.request);
      addRecentTransaction({ hash: res, description: "Approve Wrapper" });
      await waitForTransactionReceipt({ hash: res });
      setApprovalLoading(false);
      setApprovalNeeded(false);
    } catch (e) {
      console.log("error approving: ", e);
      setApprovalLoading(false);
    }
  };

  const handleApprove = async (infinite: boolean) => {
    setApprovalLoading(true);
    try {
      console.log(
        "approveIfNeeded: ",
        chainIdToDomain(walletClient!.chain.id).toString(),
        zoomer[walletClient!.chain.id],
        parseEther(amountIn).toString(),
        infinite
      );
      const res = await connext!.sdkBase.approveIfNeeded(
        chainIdToDomain(walletClient!.chain.id).toString(),
        zoomer[walletClient!.chain.id],
        parseEther(amountIn).toString(),
        infinite
      );
      if (!res) {
        console.log("approval not needed");
        setApprovalNeeded(false);
        return;
      }
      console.log("res: ", res);
      const tx = await walletClient!.sendTransaction({
        to: res.to! as `0x${string}`,
        value: BigInt(0),
        data: res.data! as `0x${string}`,
      });
      setApprovalLoading(true);
      addRecentTransaction({ hash: tx, description: "Approval" });
      const receipt = await waitForTransactionReceipt({ hash: tx });
      console.log("receipt: ", receipt);
      setApprovalLoading(false);
      setApprovalNeeded(false);
    } catch (e) {
      setApprovalLoading(false);
      console.log("error: ", e);
    }
  };

  const wrapZoomer = async () => {
    try {
      const prepWrap = await prepareWriteContract({
        abi: xerc20LockboxAbi,
        address: ZOOMER_WRAPPER_MAINNET,
        functionName: "deposit",
        args: [parseEther(amountToWrap)],
      });
      console.log("prepWrap: ", prepWrap);
      const res = await walletClient!.writeContract(prepWrap.request);
      addRecentTransaction({ hash: res, description: "Wrap Zoomer" });
      await waitForTransactionReceipt({ hash: res });
      setAmountToWrap("");
      setTabIndex(0);
      const _balance = await readContract({
        address: zoomer[walletClient!.chain.id],
        args: [walletClient!.account!.address!],
        abi: erc20ABI,
        functionName: "balanceOf",
      });
      console.log("_balance: ", _balance);
      setBalance(_balance);

      const _wrappedBalance = await readContract({
        address: WRAPPED_ZOOMER_MAINNET,
        args: [walletClient!.account!.address!],
        abi: erc20ABI,
        functionName: "balanceOf",
      });
      console.log("_wrappedBalance: ", _wrappedBalance);
      setWrappedBalance(_wrappedBalance);

      onClose();
    } catch (e) {
      console.log("error wrapping: ", e);
    }
  };

  const unwrapZoomer = async () => {
    try {
      const prepUnwrap = await prepareWriteContract({
        abi: xerc20LockboxAbi,
        address: ZOOMER_WRAPPER_MAINNET,
        functionName: "withdraw",
        args: [parseEther(amountToUnwrap)],
      });
      console.log("prepUnwrap: ", prepUnwrap);
      const res = await walletClient!.writeContract(prepUnwrap.request);
      addRecentTransaction({ hash: res, description: "Unwrap Zoomer" });
      await waitForTransactionReceipt({ hash: res });
      setAmountToUnwrap("");
      setTabIndex(0);

      const _balance = await readContract({
        address: zoomer[walletClient!.chain.id],
        args: [walletClient!.account!.address!],
        abi: erc20ABI,
        functionName: "balanceOf",
      });
      console.log("_balance: ", _balance);
      setBalance(_balance);

      const _wrappedBalance = await readContract({
        address: WRAPPED_ZOOMER_MAINNET,
        args: [walletClient!.account!.address!],
        abi: erc20ABI,
        functionName: "balanceOf",
      });
      console.log("_wrappedBalance: ", _wrappedBalance);
      setWrappedBalance(_wrappedBalance);

      onClose();
    } catch (e) {
      console.log("error unwrapping: ", e);
    }
  };

  const handleXCall = async () => {
    console.log(`amountIn: ${parseEther(amountIn)}`);
    console.log("relayerFee: ", relayerFee);
    const sdkParams = {
      origin: chainIdToDomain(walletClient!.chain.id),
      destination: chainIdToDomain(destinationChain!),
      to: walletClient!.account.address,
      asset: zoomer[walletClient!.chain.id],
      delegate: walletClient!.account.address,
      amount: parseEther(amountIn).toString(),
      slippage: 300,
      callData: "0x",
      relayerFee,
    };
    console.log("sdkParams: ", sdkParams);
    setXCallLoading(true);
    try {
      const res = await connext!.sdkBase.xcall(sdkParams);
      console.log("res: ", res);
      const tx = await walletClient!.sendTransaction({
        to: res.to! as `0x${string}`,
        value: BigInt((res.value as any).hex),
        data: res.data! as `0x${string}`,
      });
      addRecentTransaction({ hash: tx, description: "XCall" });
      console.log("tx: ", tx);
      setIsSending(true);
      setXCallLoading(false);
      setXCallTxHash(tx);
      startMonitoringTx();
    } catch (e) {
      console.log("error: ", e);
      setXCallLoading(false);
    }
  };

  const startMonitoringTx = async () => {
    const interval = setInterval(async () => {
      try {
        const transfers = await connext?.sdkUtils.getTransfers({
          transactionHash: xcallTxHash,
        });
        if (transfers && transfers[0]) {
          console.log("transfer: ", transfers[0]);
          if (transfers[0].status !== "XCalled") {
            setTransferComplete(true);
            clearInterval(interval);
          }
        }
      } catch (e) {
        console.log("error monitoring xcall: ", e);
      }
    }, 30_000);
  };

  return (
    <>
      <time dateTime="2016-10-25" suppressHydrationWarning />
      <VStack spacing={4} align="stretch" p={4}>
        <Box h="40px">
          <Flex>
            <Box>
              <Heading size={"lg"}>
                <a href="https://zoomer.money">/TAKE_ME_HOME</a>
              </Heading>
            </Box>
            <Spacer />
            <Box>{isConnected ? <ConnectButton /> : <></>}</Box>
          </Flex>
        </Box>
        {!isConnected ? (
          <Flex>
            <Spacer />
            <Box>
              <ConnectButton label="/CONNECT_WALLET" />
            </Box>
            <Spacer />
          </Flex>
        ) : transferComplete ? (
          <Flex>
            <Spacer />
            <Box>
              <Heading pb={4} pt={4}>
                /DONE
              </Heading>
              <Link
                pb={4}
                pt={4}
                as={NextLink}
                isExternal
                href={`https://connextscan.io/tx/${xcallTxHash}`}
              >
                /SEE_MY_TRANSFER
              </Link>
            </Box>
            <Spacer />
          </Flex>
        ) : isSending ? (
          <Flex>
            <Spacer />
            <Flex direction={"column"} borderColor={"black"}>
              <Heading pb={4} pt={4}>
                /AHHHHHHHHHHHHHHHHH
              </Heading>
              <Image
                src="/zoomer.gif"
                alt={"Zoomer"}
                width={500}
                height={500}
              />
              <Link
                pb={4}
                pt={4}
                as={NextLink}
                isExternal
                href={`https://connextscan.io/tx/${xcallTxHash}`}
              >
                /CHECK_MY_TX
              </Link>
              <Text width={500}>
                (this might take a while, you can close this page and check your
                wallet or the tracking link later)
              </Text>
            </Flex>
            <Spacer />
          </Flex>
        ) : (
          <Flex>
            <Spacer />
            <Flex direction={"column"} borderColor={"black"}>
              <Box pb={4} pt={4}>
                <Heading>/AHH_WE_BRIDGING</Heading>
              </Box>
              <Box>
                <Input
                  w="450px"
                  value={_amountIn}
                  onChange={async (event) => {
                    setAmountIn(event.target.value);
                    if (!event.target.value) {
                      return;
                    }
                    console.log(
                      "approveIfNeeded: ",
                      chainIdToDomain(walletClient!.chain.id).toString(),
                      zoomer[walletClient!.chain.id],
                      parseEther(event.target.value)
                    );
                    const res = await connext!.sdkBase.approveIfNeeded(
                      chainIdToDomain(walletClient!.chain.id).toString(),
                      zoomer[walletClient!.chain.id],
                      parseEther(event.target.value).toString(),
                      true
                    );
                    console.log("res: ", res);
                    console.log("approvalNeeded: ", !!res);
                    setApprovalNeeded(!!res);
                  }}
                  focusBorderColor="black"
                  variant="flushed"
                  placeholder="amount to bridge"
                  size="lg"
                />
              </Box>
              <Box pb={4} pt={4}>
                <Flex direction="column">
                  <Flex pb={2}>
                    <Code colorScheme="yellow" width={400}>
                      {formatEther(balance ?? BigInt(0))} ZOOMER
                    </Code>
                    <Button
                      variant="outline"
                      borderColor="black"
                      size="xs"
                      onClick={() => {
                        setAmountIn(
                          formatEther(
                            destinationChain === base.id
                              ? wrappedBalance
                              : balance ?? BigInt(0)
                          )
                        );
                      }}
                      ml={2}
                    >
                      /max
                    </Button>
                  </Flex>
                  <Flex>
                    <Code colorScheme="yellow" width={400}>
                      {formatEther(wrappedBalance ?? BigInt(0))} WRAPPED ZOOMER
                    </Code>
                    <Button
                      variant="outline"
                      onClick={onOpen}
                      borderColor="black"
                      size="xs"
                      ml={2}
                    >
                      WRAP/UNWRAP
                    </Button>
                    <AlertDialog
                      isOpen={isOpen}
                      leastDestructiveRef={cancelRef}
                      onClose={onClose}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent>
                          <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            ZOOMER WRAPPER
                          </AlertDialogHeader>

                          <AlertDialogBody>
                            <Tabs
                              index={tabIndex}
                              onChange={(index) => {
                                setTabIndex(index);
                              }}
                            >
                              <TabList>
                                <Tab>WRAP</Tab>
                                <Tab>UNWRAP</Tab>
                              </TabList>

                              <TabPanels>
                                <TabPanel>
                                  <Flex pb={2}>
                                    <Input
                                      variant="outline"
                                      placeholder="AMOUNT TO WRAP"
                                      size="lg"
                                      onChange={handleWrapAmountChanged}
                                      value={amountToWrap}
                                    />
                                  </Flex>
                                  <Code>
                                    {formatEther(balance ?? BigInt(0))} ZOOMER
                                  </Code>
                                </TabPanel>
                                <TabPanel>
                                  <Flex pb={2}>
                                    <Input
                                      variant="outline"
                                      placeholder="AMOUNT TO UNWRAP"
                                      size="lg"
                                      onChange={(event) =>
                                        setAmountToUnwrap(event.target.value)
                                      }
                                      value={amountToUnwrap}
                                    />
                                  </Flex>
                                  <Code>
                                    {formatEther(wrappedBalance ?? BigInt(0))}{" "}
                                    ZOOMER
                                  </Code>
                                </TabPanel>
                              </TabPanels>
                            </Tabs>
                          </AlertDialogBody>

                          <AlertDialogFooter>
                            {tabIndex === 0 ? (
                              <Button
                                ref={cancelRef}
                                onClick={handleApproveWrap}
                                isDisabled={!approvalNeeded}
                              >
                                APPROVE
                              </Button>
                            ) : (
                              <></>
                            )}
                            <Button
                              colorScheme="yellow"
                              ml={3}
                              isDisabled={tabIndex === 0 && approvalNeeded}
                              onClick={() => {
                                if (tabIndex === 0) {
                                  wrapZoomer();
                                } else {
                                  unwrapZoomer();
                                }
                              }}
                            >
                              {tabIndex === 0 ? `WRAP` : `UNWRAP`}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog>
                  </Flex>
                </Flex>
              </Box>
              <Box pb={4} pt={4}>
                <Select
                  placeholder="destination chain"
                  variant={"flushed"}
                  size="sm"
                  w="250px"
                  focusBorderColor="black"
                  value={destinationChain}
                  onChange={handleSwitchDestinationChain}
                >
                  {chains
                    .filter((chain) => {
                      return chain.id !== walletClient?.chain.id;
                    })
                    .map((chain) => {
                      return (
                        <option
                          key={chain.id}
                          value={chain.id}
                          disabled={chain.id === 42161}
                        >
                          {chain.id === 42161
                            ? `${chain.name} - SOON(tm)`
                            : chain.name}
                        </option>
                      );
                    })}
                </Select>
              </Box>
              <Box pb={4}>
                <Code colorScheme="yellow">
                  Relayer fee:{" "}
                  {relayerFeeLoading ? "..." : formatEther(BigInt(relayerFee))}{" "}
                  {walletClient?.chain.id
                    ? chains.find(
                        (chain) => chain.id === walletClient?.chain.id
                      )?.nativeCurrency.symbol
                    : "???"}
                </Code>
              </Box>
              {destinationChain === base.id ? (
                <></>
              ) : (
                <Box pb={2} pt={4}>
                  <Flex>
                    <Button
                      variant="outline"
                      borderColor="black"
                      mr={2}
                      isDisabled={!approvalNeeded || !amountIn}
                      size="sm"
                      onClick={() => handleApprove(false)}
                      isLoading={approvalLoading}
                    >
                      /APPROVE
                    </Button>
                    <Button
                      variant="outline"
                      borderColor="black"
                      size="sm"
                      isDisabled={!approvalNeeded || !amountIn}
                      onClick={() => handleApprove(true)}
                      isLoading={approvalLoading}
                    >
                      /APPROVE_INFINITE
                    </Button>
                  </Flex>
                </Box>
              )}
              <Box pb={4} pt={2}>
                <Button
                  variant="outline"
                  borderColor="black"
                  isDisabled={
                    BigInt(relayerFee) == BigInt(0) ||
                    !amountIn ||
                    approvalNeeded
                  }
                  isLoading={xcallLoading}
                  onClick={handleXCall}
                >
                  /LEZ_FUCKING_GO
                </Button>
              </Box>
              <Text width={500}>
                {destinationChain === base.id
                  ? `(base bridging uses wrapped zoomer)`
                  : `(bridging will take 1-2 hours until we onboard instant-fill LPs)`}
              </Text>
            </Flex>
            <Spacer />
          </Flex>
        )}
        <Flex>
          <Spacer />
          <Image
            src="/bridge2.png"
            width={900}
            height={900}
            alt="bridge"
            priority={true}
          />
        </Flex>
      </VStack>
    </>
  );
}
