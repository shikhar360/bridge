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
  Text,
  CardBody,
  Card,
  useColorMode,
  Modal,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  erc20ABI,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useSendTransaction,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import { switchNetwork } from "@wagmi/core";
import { arbitrum, base, mainnet, polygon } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Address,
  Hash,
  Hex,
  encodeAbiParameters,
  formatEther,
  parseEther,
} from "viem";
import { SdkBase, SdkConfig, SdkUtils, create } from "@connext/sdk-core";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { chainIdToDomain } from "@connext/nxtp-utils";

import { useDebounce } from "../hooks/useDebounce";
import {
  useBridgeSendThroughBridge,
  useErc20Allowance,
  useErc20BalanceOf,
  useZoomerXerc20LockboxBaseDepositAndBridgeToL2,
  useZoomerXerc20OldBalanceOf,
  zoomerCoinAddress,
} from "../generated";
import {
  Asset,
  configByAsset,
  getAddressByAsset,
  getApproveToByAsset,
  getCalldataByAsset,
  getRecipientByAsset,
} from "../utils/asset";
import { configuredChains } from "../wagmi";

type BridgeUIProps = {
  asset: Asset;
  setAsset: Dispatch<SetStateAction<Asset>>;
};

const solana = {
  id: 0,
};

const getRPCForChain = (chainId: number): string =>
  configuredChains.find((chain) => chain.id === chainId)?.rpcUrls.default
    .http[0];

export const BridgeUI = ({ asset, setAsset }: BridgeUIProps) => {
  const { data: walletClient } = useWalletClient();
  const { colorMode } = useColorMode();
  const [_amountIn, setAmountIn] = useState("");
  const amountIn = useDebounce(_amountIn, 500);
  const [relayerFee, setRelayerFee] = useState("0");
  const [relayerFeeLoading, setRelayerFeeLoading] = useState(false);
  const [approvalNeeded, setApprovalNeeded] = useState(true);
  const [destinationChain, setDestinationChain] = useState<number | undefined>(
    polygon.id
  );
  const [originChain, setOriginChain] = useState<number | undefined>(
    walletClient?.chain.id ?? mainnet.id
  );
  const [connext, setConnext] = useState<
    { sdkBase: SdkBase; sdkUtils: SdkUtils } | undefined
  >();
  const { isConnected } = useAccount();
  const {
    data: allowance,
    isSuccess: allowanceIsSuccess,
    isError: allowanceIsError,
    error,
  } = useErc20Allowance({
    enabled:
      !!walletClient?.chain?.id &&
      !!walletClient?.account?.address &&
      !!destinationChain &&
      ((asset === "zoomer" && destinationChain === base.id) ||
        asset === "grumpycat"),
    address: walletClient?.chain.id
      ? getAddressByAsset(asset, walletClient!.chain.id)
      : "0x0000000000000000000000000000000000000000",
    chainId: walletClient?.chain.id,
    args: [
      walletClient?.account.address ??
        "0x0000000000000000000000000000000000000000",
      getApproveToByAsset(
        asset,
        walletClient?.chain.id ?? 1,
        destinationChain ?? 137
      )!,
    ],
  });

  const urlParams = useSearchParams();
  const _asset = urlParams.get("asset");
  if (_asset) {
    setAsset(_asset as Asset);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRelayerFee = async (destinationChain: string): Promise<string> => {
    if (!destinationChain) {
      console.error("destinationChain is undefined: ", destinationChain);
      return "0";
    }
    let fee;
    if (
      destinationChain === base.id.toString() ||
      destinationChain === solana.id.toString() ||
      walletClient?.chain.id === base.id
    ) {
      fee = "0";
    } else {
      console.log("getting relayer fee: ", destinationChain);
      setRelayerFeeLoading(true);
      fee = await connext?.sdkBase.estimateRelayerFee({
        originDomain: chainIdToDomain(walletClient!.chain.id).toString(),
        destinationDomain: chainIdToDomain(+destinationChain).toString(),
      });
    }
    console.log("relayer fee: ", fee);
    setRelayerFeeLoading(false);
    setRelayerFee((fee ?? "0").toString());
    return (fee ?? "0").toString();
  };

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
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletClient?.account?.address]);

  useEffect(() => {
    const run = async () => {
      if (destinationChain !== undefined && originChain !== undefined) {
        await getRelayerFee(destinationChain.toString());
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationChain, originChain]);

  const updateApprovals = async (amount: string, _chainId?: number) => {
    const chainId = walletClient?.chain.id ?? _chainId;
    if (asset === "zoomer") {
      if (chainId === base.id) {
        setApprovalNeeded(false);
      } else if (destinationChain === base.id) {
        if (allowanceIsError) {
          console.log("ALLOWANCE ERROR: ", error);
        }
        if (allowanceIsSuccess && allowance! < parseEther(amount)) {
          console.log("approval needed: ", allowance, parseEther(amount));
          setApprovalNeeded(true);
        } else {
          console.log("approval not needed: ", allowance, parseEther(amount));
          setApprovalNeeded(false);
        }
      } else {
        if (!chainId) {
          throw new Error("chainId is undefined");
        }
        console.log(
          "approveIfNeeded: ",
          chainIdToDomain(chainId).toString(),
          zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
          parseEther(amount)
        );
        const res = await connext!.sdkBase.approveIfNeeded(
          chainIdToDomain(chainId).toString(),
          zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
          parseEther(amount).toString(),
          true,
          {
            originProviderUrl: chainId ? getRPCForChain(chainId) : undefined,
          }
        );
        console.log("res: ", res);
        console.log("approvalNeeded: ", !!res);
        setApprovalNeeded(!!res);
      }
    } else if (asset === "grumpycat") {
      if (allowanceIsError) {
        console.log("ALLOWANCE ERROR: ", error);
      }
      if (allowanceIsSuccess && allowance! < parseEther(amount)) {
        console.log("approval needed: ", allowance, parseEther(amount));
        setApprovalNeeded(true);
      } else {
        console.log("approval not needed: ", allowance, parseEther(amount));
        setApprovalNeeded(false);
      }
    }
  };

  return (
    <>
      <Card
        bg={
          colorMode === "light" ? configByAsset[asset].color : "blackAlpha.100"
        }
        textColor={colorMode === "light" ? "black" : configByAsset[asset].color}
        borderColor={
          colorMode === "light" ? "blackAlpha.400" : configByAsset[asset].color
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
                  <ConnectButton label="/CONNECT_WALLET" />
                </Box>
                <Spacer />
              </Flex>
            ) : (
              <Flex direction={"column"}>
                <Box pb={4} pt={4}>
                  <Heading>/AHH_WE_BRIDGING</Heading>
                </Box>
                <BridgeDescription />
                {asset === "zoomer" ? (
                  <>
                    <Box pt={4} />
                    <CheckOldZoomer address={walletClient.account.address} />
                  </>
                ) : (
                  <></>
                )}
                <Box pt={4}>
                  <SelectAsset asset={asset} setAsset={setAsset} />
                </Box>
                <Flex pb={4} pt={4} width="100%" flexWrap="wrap">
                  <SelectOriginChain
                    asset={asset}
                    originChain={originChain}
                    setOriginChain={setOriginChain}
                    walletChain={walletClient.chain.id}
                  />
                  <Spacer />
                  <SelectDestinationChain
                    asset={asset}
                    destinationChain={destinationChain}
                    amountIn={amountIn}
                    getRelayerFee={getRelayerFee}
                    setDestinationChain={setDestinationChain}
                    setRelayerFee={setRelayerFee}
                    updateApprovals={updateApprovals}
                    walletChain={walletClient.chain.id}
                  />
                </Flex>
                {originChain === solana.id || destinationChain === solana.id ? (
                  <SolanaDescription />
                ) : (
                  <>
                    <Box pt={4}>
                      <AmountInInput
                        amountIn={_amountIn}
                        setAmountIn={setAmountIn}
                        updateApprovals={updateApprovals}
                        asset={asset}
                        destinationChain={destinationChain}
                        relayerFee={relayerFee}
                        getRelayerFee={getRelayerFee}
                      />
                    </Box>
                    <Box pb={4} pt={4}>
                      <AmountDisplay
                        setAmountIn={setAmountIn}
                        walletAddress={walletClient!.account!.address!}
                        asset={asset}
                        walletChain={walletClient!.chain!.id!}
                      />
                    </Box>
                    <Box pb={4}>
                      <RelayerFee
                        asset={asset}
                        relayerFee={relayerFee}
                        relayerFeeLoading={relayerFeeLoading}
                        walletChain={walletClient.chain.id}
                      />
                    </Box>

                    <Box pb={2} pt={4}>
                      {!connext || !destinationChain || !relayerFee ? (
                        <Button
                          isDisabled={true}
                          variant="outline"
                          backgroundColor={
                            colorMode === "light"
                              ? "black"
                              : configByAsset[asset].color
                          }
                          color={
                            colorMode === "light"
                              ? configByAsset[asset].color
                              : "black"
                          }
                          width={"100%"}
                        >
                          CHOOSE DESTINATION
                        </Button>
                      ) : (
                        <ActionButtons
                          amountIn={amountIn}
                          connext={connext}
                          destinationChain={destinationChain}
                          relayerFee={relayerFee}
                          walletAddress={walletClient.account.address}
                          walletChain={walletClient.chain.id}
                          approvalNeeded={approvalNeeded}
                          setApprovalNeeded={setApprovalNeeded}
                          asset={asset}
                          getRelayerFee={getRelayerFee}
                        />
                      )}
                    </Box>

                    {destinationChain === base.id ? (
                      <Text>bridging to base will take up to 10 min</Text>
                    ) : walletClient.chain.id === base.id ? (
                      <Text>
                        routes from base to other chains will be available soon!
                      </Text>
                    ) : (
                      <Text>
                        bridging will take up to 2 hours. check your wallet
                        later!
                      </Text>
                    )}
                  </>
                )}
              </Flex>
            )}
            <Flex>
              <Spacer />
              <Image
                src={
                  asset === "zoomer"
                    ? "/poweredzoomer.png"
                    : "/poweredgrumpy.png"
                }
                alt="Powered By Zoomer"
                height={109}
                width={156}
              />
              <Spacer />
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    </>
  );
};

type SelectAssetProps = {
  asset: Asset;
  setAsset: Dispatch<SetStateAction<Asset>>;
};
const SelectAsset = ({ asset, setAsset }: SelectAssetProps) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const pathname = usePathname();
  const handleChangeAsset = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log("event.target.value: ", event.target.value);
    setAsset(event.target.value as Asset);
    router.replace(`${pathname}?asset=${event.target.value}`);
  };

  return (
    <Select
      size="lg"
      onChange={handleChangeAsset}
      value={asset}
      borderColor={
        colorMode === "light" ? "blackAlpha.400" : configByAsset[asset].color
      }
    >
      <option value="zoomer">ZOOMER</option>
      <option value="grumpycat">GRUMPY CAT</option>
    </Select>
  );
};

type AmountInProps = {
  amountIn: string;
  setAmountIn: Dispatch<SetStateAction<string>>;
  updateApprovals: (amount: string) => Promise<void>;
  asset: Asset;
  relayerFee: string;
  destinationChain?: number;
  getRelayerFee: (destinationChain: string) => Promise<string>;
};
const AmountInInput = ({
  amountIn,
  setAmountIn,
  updateApprovals,
  asset,
  relayerFee,
  destinationChain,
  getRelayerFee,
}: AmountInProps) => {
  const { colorMode } = useColorMode();

  const handleAmountInChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setAmountIn(event.target.value);
    if (!event.target.value) {
      return;
    }
    console.log("UPDATING APPROVALS");
    await updateApprovals(event.target.value);
    console.log("UPDATED APPROVALS");
    if (
      BigInt(relayerFee) === BigInt(0) &&
      asset !== "zoomer" &&
      destinationChain !== base.id
    ) {
      console.log("Getting relayer fee");
      await getRelayerFee(destinationChain!.toString());
      console.log("Got relayer fee");
      return;
    }
  };

  return (
    <Box>
      <Input
        w="100%"
        isDisabled={!destinationChain}
        value={amountIn}
        onChange={handleAmountInChange}
        focusBorderColor="black"
        variant="outline"
        _placeholder={{
          opacity: 1,
          color:
            colorMode === "light"
              ? "blackAlpha.900"
              : configByAsset[asset].color,
        }}
        placeholder="amount to bridge"
        size="md"
        borderColor={
          colorMode === "light" ? "blackAlpha.400" : configByAsset[asset].color
        }
      />
    </Box>
  );
};

type AmountDisplayProps = {
  walletAddress: Address;
  walletChain: number;
  setAmountIn: Dispatch<SetStateAction<string>>;
  asset: Asset;
};
const AmountDisplay = ({
  walletChain,
  walletAddress,
  setAmountIn,
  asset,
}: AmountDisplayProps) => {
  const { data: balance, isSuccess: isSuccessBalance } = useErc20BalanceOf({
    address: getAddressByAsset(asset, walletChain),
    args: [walletAddress],
    watch: true,
  });
  return (
    <Flex direction="column">
      <Flex pb={2}>
        <Code width={400}>
          Balance: {isSuccessBalance ? formatEther(balance!) : "..."}{" "}
          {asset.toUpperCase()}
        </Code>
        <Button
          variant="outline"
          borderColor="black"
          size="xs"
          isDisabled={!isSuccessBalance}
          onClick={() => {
            setAmountIn(formatEther(balance!));
          }}
          ml={2}
        >
          /max
        </Button>
      </Flex>
    </Flex>
  );
};

type SelectOriginChainProps = {
  walletChain: number;
  asset: Asset;
  setOriginChain: Dispatch<SetStateAction<number | undefined>>;
  originChain?: number;
};
const SelectOriginChain = ({
  asset,
  setOriginChain,
  originChain,
}: SelectOriginChainProps) => {
  const { colorMode } = useColorMode();

  const handleSwitchOriginChain = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setOriginChain(+event.target.value);
    if (+event.target.value !== solana.id) {
      await switchNetwork({
        chainId: +event.target.value,
      });
    }
  };

  return (
    <VStack>
      <Heading size={"md"}>From</Heading>
      <Select
        placeholder="origin chain"
        variant="outline"
        size="sm"
        w="250px"
        borderColor={
          colorMode === "light" ? "blackAlpha.400" : configByAsset[asset].color
        }
        value={originChain}
        onChange={handleSwitchOriginChain}
      >
        {configByAsset[asset].chains
          .map((chain) => {
            return (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            );
          })
          .concat(
            asset === "zoomer"
              ? [
                  <option key={0} value={0}>
                    Solana
                  </option>,
                ]
              : []
          )}
      </Select>
    </VStack>
  );
};

type SelectDestinationChainProps = {
  destinationChain: number | undefined;
  setDestinationChain: Dispatch<SetStateAction<number | undefined>>;
  walletChain: number;
  getRelayerFee: (destinationChain: string) => Promise<string>;
  updateApprovals: (amount: string, chainId?: number) => Promise<void>;
  setRelayerFee: Dispatch<SetStateAction<string>>;
  amountIn: string;
  asset: Asset;
};
const SelectDestinationChain = ({
  destinationChain,
  walletChain,
  setDestinationChain,
  getRelayerFee,
  updateApprovals,
  setRelayerFee,
  amountIn,
  asset,
}: SelectDestinationChainProps) => {
  const { colorMode } = useColorMode();

  const handleSwitchDestinationChain = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setDestinationChain(+event.target.value);
    if (event.target.value === base.id.toString()) {
      setRelayerFee("0");
    } else {
      await getRelayerFee(event.target.value);
    }
    await updateApprovals(amountIn, walletChain);
  };

  return (
    <VStack>
      <Heading size={"md"}>To</Heading>
      <Select
        placeholder="destination chain"
        variant="outline"
        size="sm"
        w="250px"
        borderColor={
          colorMode === "light" ? "blackAlpha.400" : configByAsset[asset].color
        }
        value={destinationChain}
        onChange={handleSwitchDestinationChain}
      >
        {configByAsset[asset].chains
          .filter((chain) => {
            if (walletChain === base.id) {
              return chain.id === mainnet.id;
            } else if (walletChain === mainnet.id) {
              return chain.id !== walletChain;
            } else {
              return chain.id !== base.id && chain.id !== walletChain;
            }
          })
          .map((chain) => {
            return (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            );
          })
          .concat(
            asset === "zoomer" && walletChain !== base.id
              ? [
                  <option key={0} value={0}>
                    Solana
                  </option>,
                ]
              : []
          )}
      </Select>
    </VStack>
  );
};

type RelayerFeeProps = {
  relayerFee: string;
  relayerFeeLoading: boolean;
  walletChain: number;
  asset: Asset;
};
const RelayerFee = ({
  relayerFeeLoading,
  walletChain,
  relayerFee,
  asset,
}: RelayerFeeProps) => {
  return (
    <Code>
      Relayer fee: {relayerFeeLoading ? "..." : formatEther(BigInt(relayerFee))}{" "}
      {walletChain
        ? configByAsset[asset].chains.find((chain) => chain.id === walletChain)
            ?.nativeCurrency.symbol
        : "???"}
    </Code>
  );
};

type ActionButtonsProps = {
  amountIn: string;
  destinationChain: number;
  walletChain: number;
  walletAddress: Address;
  connext: { sdkBase: SdkBase; sdkUtils: SdkUtils };
  relayerFee: string;
  approvalNeeded: boolean;
  setApprovalNeeded: Dispatch<SetStateAction<boolean>>;
  getRelayerFee: (destinationChain: string) => Promise<string>;
  asset: Asset;
};
const ActionButtons = ({
  amountIn,
  destinationChain,
  walletChain,
  connext,
  relayerFee,
  walletAddress,
  approvalNeeded,
  setApprovalNeeded,
  asset,
  getRelayerFee,
}: ActionButtonsProps) => {
  return (
    <Flex>
      {approvalNeeded ? (
        <ApproveButton
          amountIn={amountIn}
          approvalNeeded={approvalNeeded}
          connext={connext}
          destinationChain={destinationChain}
          setApprovalNeeded={setApprovalNeeded}
          walletChain={walletChain}
          asset={asset}
        />
      ) : (
        <BridgeButton
          amountIn={amountIn}
          connext={connext}
          destinationChain={destinationChain}
          relayerFee={relayerFee}
          walletAddress={walletAddress}
          walletChain={walletChain}
          asset={asset}
          getRelayerFee={getRelayerFee}
        />
      )}
    </Flex>
  );
};

type ApproveButtonProps = {
  amountIn: string;
  destinationChain: number;
  walletChain: number;
  connext: { sdkBase: SdkBase; sdkUtils: SdkUtils };
  approvalNeeded: boolean;
  setApprovalNeeded: Dispatch<SetStateAction<boolean>>;
  asset: Asset;
};
const ApproveButton = ({
  amountIn,
  destinationChain,
  walletChain,
  connext,
  approvalNeeded,
  setApprovalNeeded,
  asset,
}: ApproveButtonProps) => {
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [infinite, setInfinite] = useState(false);
  const { sendTransactionAsync } = useSendTransaction();
  const addRecentTransaction = useAddRecentTransaction();
  const { waitForTransactionReceipt } = usePublicClient();
  const { colorMode } = useColorMode();

  const { config } = usePrepareContractWrite({
    enabled: !!getApproveToByAsset(asset, walletChain, destinationChain),
    chainId: walletChain,
    abi: erc20ABI,
    address: getAddressByAsset(asset, walletChain),
    functionName: "approve",
    args: [
      getApproveToByAsset(asset, walletChain, destinationChain) ??
        "0x0000000000000000000000000000000000000000",
      infinite
        ? BigInt(
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          )
        : parseEther(amountIn),
    ],
  });
  const { writeAsync: approveWrite } = useContractWrite(config);

  const handleApprove = async (infinite: boolean) => {
    setApprovalLoading(true);
    try {
      let tx: Hash;
      if (asset === "zoomer") {
        if (destinationChain === base.id) {
          if (!approveWrite) {
            throw new Error("approveWrite is undefined");
          }
          const data = await approveWrite();
          tx = data.hash;
        } else {
          console.log(
            "approveIfNeeded: ",
            chainIdToDomain(walletChain).toString(),
            getAddressByAsset(asset, walletChain),
            parseEther(amountIn).toString(),
            infinite
          );
          const res = await connext!.sdkBase.approveIfNeeded(
            chainIdToDomain(walletChain).toString(),
            getAddressByAsset(asset, walletChain),
            parseEther(amountIn).toString(),
            infinite,
            { originProviderUrl: getRPCForChain(walletChain) }
          );
          if (!res) {
            console.log("approval not needed");
            setApprovalNeeded(false);
            return;
          }
          console.log("res: ", res);
          const data = await sendTransactionAsync({
            to: res.to! as Address,
            value: BigInt(0),
            data: res.data! as Hex,
          });
          tx = data.hash;
        }
      } else if (asset === "grumpycat") {
        console.log("config: ", config);
        if (!approveWrite) {
          throw new Error("approveWrite is undefined");
        }
        const data = await approveWrite();
        tx = data.hash;
      } else {
        throw new Error("invalid asset");
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

  return (
    <Button
      variant="outline"
      borderColor="black"
      mr={2}
      isDisabled={!approvalNeeded || !amountIn}
      size="md"
      onClick={() => handleApprove(false)}
      isLoading={approvalLoading}
      loadingText="/CHECK_WALLET"
      width="100%"
      backgroundColor={
        colorMode === "light" ? "black" : configByAsset[asset].color
      }
      color={colorMode === "light" ? configByAsset[asset].color : "black"}
    >
      /APPROVE
    </Button>
  );
};

type BridgeButtonProps = {
  amountIn: string;
  destinationChain: number;
  walletChain: number;
  connext: { sdkBase: SdkBase; sdkUtils: SdkUtils };
  relayerFee: string;
  walletAddress: Address;
  asset: Asset;
  getRelayerFee: (destinationChain: string) => Promise<string>;
};
const BridgeButton = ({
  walletChain,
  relayerFee,
  amountIn,
  destinationChain,
  walletAddress,
  connext,
  asset,
  getRelayerFee,
}: BridgeButtonProps) => {
  const { colorMode } = useColorMode();
  const [xcallLoading, setXCallLoading] = useState(false);
  const [xcallTxHash, setXCallTxHash] = useState<Hash | undefined>();
  const addRecentTransaction = useAddRecentTransaction();
  const { sendTransactionAsync } = useSendTransaction();
  const { isLoading } = useWaitForTransaction({
    hash: xcallTxHash,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { writeAsync: depositWriteZoomerLockbox } =
    useZoomerXerc20LockboxBaseDepositAndBridgeToL2({
      args: [parseEther(amountIn)],
      chainId: walletChain,
    });

  console.log(
    "getCalldataByAsset(asset, destinationChain, walletAddress): ",
    getCalldataByAsset(asset, destinationChain, walletAddress)
  );
  const { writeAsync: sendThroughBridgeWrite } = useBridgeSendThroughBridge({
    args: [
      getAddressByAsset(asset, walletChain),
      getRecipientByAsset(asset, destinationChain, walletAddress),
      destinationChain,
      parseEther(amountIn),
      getCalldataByAsset(asset, destinationChain, walletAddress),
      0,
      encodeAbiParameters(
        [{ type: "address" }, { type: "uint256" }],
        [walletAddress, BigInt(10)]
      ),
    ],
    value: BigInt(relayerFee),
  });

  const handleXCall = async () => {
    console.log(`amountIn: ${parseEther(amountIn)}`);
    console.log("relayerFee: ", relayerFee);
    setXCallLoading(true);
    let _relayerFee = relayerFee;
    try {
      let tx: Hash;
      if (asset === "zoomer") {
        if (destinationChain === base.id) {
          if (!depositWriteZoomerLockbox) {
            throw new Error("depositWriteZoomerLockbox is undefined");
          }
          const data = await depositWriteZoomerLockbox();
          tx = data.hash;
        } else {
          if (relayerFee === "0") {
            _relayerFee = await getRelayerFee(destinationChain.toString());
            if (_relayerFee === "0") {
              throw new Error("relayerFee is 0");
            }
          }
          const sdkParams = {
            origin: chainIdToDomain(walletChain).toString(),
            destination: chainIdToDomain(destinationChain!).toString(),
            to: walletAddress,
            asset: getAddressByAsset(asset, walletChain),
            delegate: walletAddress,
            amount: parseEther(amountIn).toString(),
            slippage: "300",
            callData: "0x",
            relayerFee: _relayerFee,
          };
          console.log("sdkParams: ", sdkParams);
          const res = await connext!.sdkBase.xcall(sdkParams);
          console.log("res: ", res);
          const data = await sendTransactionAsync({
            to: res.to! as Address,
            value: BigInt(_relayerFee),
            data: res.data! as Hex,
          });
          tx = data.hash;
        }
      } else if (asset === "grumpycat") {
        if (!sendThroughBridgeWrite) {
          throw new Error("sendThroughBridgeWrite is undefined");
        }
        const data = await sendThroughBridgeWrite();
        tx = data.hash;
      } else {
        throw new Error("invalid asset");
      }
      addRecentTransaction({ hash: tx, description: "XCall" });
      console.log("tx: ", tx);
      setXCallLoading(false);
      setXCallTxHash(tx);
      onOpen();
    } catch (e) {
      console.log("error: ", e);
      setXCallLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        borderColor="black"
        isDisabled={
          (destinationChain !== base.id && BigInt(relayerFee) === BigInt(0)) ||
          (asset === "grumpycat" && BigInt(relayerFee) === BigInt(0)) ||
          walletChain === base.id ||
          !amountIn
        }
        isLoading={xcallLoading || isLoading}
        onClick={handleXCall}
        loadingText="/CHECK_WALLET"
        backgroundColor={
          colorMode === "light" ? "black" : configByAsset[asset].color
        }
        color={colorMode === "light" ? configByAsset[asset].color : "black"}
        width="100%"
      >
        {walletChain === base.id ? "/ROUTE_COMING_SOON" : "/BRIDGE"}
      </Button>
      <BridgedModal
        isOpen={isOpen}
        onClose={onClose}
        txHash={xcallTxHash!}
        asset={asset}
        destinationChain={destinationChain}
      />
    </>
  );
};

type BridgedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  asset: Asset;
  destinationChain: number;
};
const BridgedModal = ({
  isOpen,
  onClose,
  txHash,
  asset,
  destinationChain,
}: BridgedModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent backgroundColor={configByAsset[asset].color}>
        <ModalHeader>Bridging Initiated!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <video autoPlay loop src={require("../../public/dab.mp4")} muted />
        </ModalBody>
        <ModalFooter>
          Bridging will take some time. You can close this page and check your
          wallet later.{" "}
          {destinationChain !== base.id ? (
            <Link
              href={`https://connextscan.io/tx/${txHash}`}
              isExternal
              color="whiteAlpha.900"
            >
              Check Tx
            </Link>
          ) : (
            <></>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
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
            Based crosschain memecoin bridge.
            <br />
            <br />
            1. Choose your asset.
            <br />
            2. Select your chains.
            <br />
            3. Approve.
            <br />
            4. Bridge.
            <br />
            5. Bridging takes time! After your transaction is sent, you can
            close the window and check your wallet later.
            <br />
            6. Wait at least 4 hours before contacting support.
            <br />
            <br />
            Still need support? Interested in taking your coin cross-chain? Join
            the Zoomer{" "}
            <Link
              href="https://t.me/zoomercoinofficial"
              isExternal
              color="blue.400"
            >
              Telegram
            </Link>
            .
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const SolanaDescription = () => {
  return (
    <Text as="b">
      Bridging to and from Solana requires using Wormhole Portal Bridge (for
      now).
      <br />
      You will need to use an external website to bridge your coins!
      <br />
      Use the following instructions to use the Portal Bridge:
      <br />
      <br />
      1. Navigate to the{" "}
      <Link
        href="https://portalbridge.com/advanced-tools/#/transfer"
        isExternal
        color="blue.400"
      >
        Wormhole Portal Bridge
      </Link>
      .
      <br />
      2. Select your chains, ONLY selecting Ethereum and Solana as
      source/target.
      <br />
      3. Connect your source wallet.
      <br />
      3. If Ethereum is source, paste the address{" "}
      <Link
        href="https://etherscan.io/token/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676"
        isExternal
        color="blue.400"
      >
        0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676
      </Link>
      .
      <br />
      4. If Solana is source, paste the address{" "}
      <Link
        href="https://solscan.io/token/nBZEcHSG771mRbi4y2sSgKjfDUH8jsM2Eo5fNcASLeU"
        isExternal
        color="blue.400"
      >
        nBZEcHSG771mRbi4y2sSgKjfDUH8jsM2Eo5fNcASLeU
      </Link>
      <br />
      5. Connect your target wallet. Verify that the addresses match the above!
      <br />
      6. Use the {"Next"} dialog button to proceed and send the tokens through
      the bridge. There will be a few transactions and long confirmation times,
      so make sure you keep the page open and complete the process!
      <br />
      <br />
      Still need support? Join the Zoomer{" "}
      <Link href="https://t.me/zoomercoinofficial" isExternal color="blue.400">
        Telegram
      </Link>{" "}
      and contact the mods.
    </Text>
  );
};

type CheckOldZoomerProps = {
  address: Address;
};
const CheckOldZoomer = ({ address }: CheckOldZoomerProps) => {
  const { data: balance, isSuccess: isSuccessBalance } =
    useZoomerXerc20OldBalanceOf({ args: [address], watch: true, chainId: 137 });

  return isSuccessBalance && balance! > BigInt(0) ? (
    <Alert status="error">
      <AlertIcon />
      <AlertDescription>
        You have the old Zoomer on Polygon! Please visit the{" "}
        <Link as={NextLink} href="/migrate" color="blue.400">
          MIGRATION UI
        </Link>{" "}
        to migrate!
      </AlertDescription>
    </Alert>
  ) : (
    <></>
  );
};
