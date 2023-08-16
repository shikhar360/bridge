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
import { prepareWriteContract } from "wagmi/actions";
import { xerc20LockboxAbi } from "@/abi/xerc20Lockbox";

const chains = [mainnet, base, polygon];

const ZOOMER_WRAPPER_MAINNET = "0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87";

const zoomer: Record<number, `0x${string}`> = {
  [mainnet.id]: "0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676",
  [polygon.id]: "0xb2588731d8f6F854037936d6ffac4c13d0b6bd62",
  [arbitrum.id]: "0xBB1B173cdFBe464caaaCeaB2a9c8C44229d62D14",
  [base.id]: "0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2",
};

export default function Home() {
  const addRecentTransaction = useAddRecentTransaction();
  const [_amountIn, setAmountIn] = useState("");
  const amountIn = useDebounce(_amountIn, 500);
  const [balance, setBalance] = useState(BigInt(0));
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

  const updateApprovals = async (amount: string) => {
    if (destinationChain === base.id) {
      const res = await readContract({
        address: zoomer[walletClient!.chain.id],
        args: [walletClient!.account!.address!, ZOOMER_WRAPPER_MAINNET],
        abi: erc20ABI,
        functionName: "allowance",
      });
      if (res < parseEther(amount)) {
        console.log("approval needed");
        setApprovalNeeded(true);
      }
    } else {
      console.log(
        "approveIfNeeded: ",
        chainIdToDomain(walletClient!.chain.id).toString(),
        zoomer[walletClient!.chain.id],
        parseEther(amount)
      );
      const res = await connext!.sdkBase.approveIfNeeded(
        chainIdToDomain(walletClient!.chain.id).toString(),
        zoomer[walletClient!.chain.id],
        parseEther(amount).toString(),
        true
      );
      console.log("res: ", res);
      console.log("approvalNeeded: ", !!res);
      setApprovalNeeded(!!res);
    }
  };

  const handleAmountInChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setAmountIn(event.target.value);
    if (!event.target.value) {
      return;
    }
    await updateApprovals(event.target.value);
  };

  const handleSwitchDestinationChain = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setDestinationChain(+event.target.value);
    if (event.target.value === base.id.toString()) {
      setRelayerFee("0");
    } else {
      await getRelayerFee(event.target.value);
    }
    await updateApprovals(amountIn);
  };

  const handleApprove = async (infinite: boolean) => {
    setApprovalLoading(true);
    try {
      let tx: `0x${string}`;
      if (destinationChain === base.id) {
        console.log(
          "zoomer[walletClient!.chain.id]: ",
          zoomer[walletClient!.chain.id]
        );
        const approve = await prepareWriteContract({
          address: zoomer[walletClient!.chain.id],
          abi: erc20ABI,
          functionName: "approve",
          args: [
            ZOOMER_WRAPPER_MAINNET,
            infinite
              ? BigInt(
                  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                )
              : parseEther(amountIn),
          ],
        });
        console.log("approve.request: ", approve.request);
        tx = await walletClient!.writeContract(approve.request);
      } else {
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
        tx = await walletClient!.sendTransaction({
          to: res.to! as `0x${string}`,
          value: BigInt(0),
          data: res.data! as `0x${string}`,
        });
      }
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

  const handleXCall = async () => {
    console.log(`amountIn: ${parseEther(amountIn)}`);
    console.log("relayerFee: ", relayerFee);
    setXCallLoading(true);
    try {
      let tx: `0x${string}`;
      if (destinationChain === base.id) {
        const lockbox = await prepareWriteContract({
          address: ZOOMER_WRAPPER_MAINNET,
          abi: xerc20LockboxAbi,
          functionName: "depositAndBridgeToL2",
          args: [parseEther(amountIn).toString()],
        });
        tx = await walletClient!.writeContract(lockbox.request);
      } else {
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
        const res = await connext!.sdkBase.xcall(sdkParams);
        console.log("res: ", res);
        tx = await walletClient!.sendTransaction({
          to: res.to! as `0x${string}`,
          value: BigInt((res.value as any).hex),
          data: res.data! as `0x${string}`,
        });
        startMonitoringTx();
      }
      addRecentTransaction({ hash: tx, description: "XCall" });
      console.log("tx: ", tx);
      setIsSending(true);
      setXCallLoading(false);
      setXCallTxHash(tx);
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
                href={
                  destinationChain === base.id
                    ? `https://etherscan.io/tx/${xcallTxHash}`
                    : `https://connextscan.io/tx/${xcallTxHash}`
                }
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
                  onChange={handleAmountInChange}
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
                        setAmountIn(formatEther(balance ?? BigInt(0)));
                      }}
                      ml={2}
                    >
                      /max
                    </Button>
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
                      if (walletClient?.chain.id === base.id) {
                        return chain.id === mainnet.id;
                      } else if (walletClient?.chain.id === mainnet.id) {
                        return chain.id !== walletClient?.chain.id;
                      } else {
                        return (
                          chain.id !== base.id &&
                          chain.id !== walletClient?.chain.id
                        );
                      }
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
              <Box pb={4} pt={2}>
                <Button
                  variant="outline"
                  borderColor="black"
                  isDisabled={
                    (walletClient?.chain.id === base.id &&
                      BigInt(relayerFee) == BigInt(0)) ||
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
                  ? `(bridging to base will take up to 10 min)`
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
