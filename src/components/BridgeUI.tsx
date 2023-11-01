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
} from "@chakra-ui/react";
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
  useWalletClient,
} from "wagmi";
import { arbitrum, base, mainnet, polygon } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Address,
  Hash,
  Hex,
  encodePacked,
  formatEther,
  parseEther,
} from "viem";
import { SdkBase, SdkConfig, SdkUtils, create } from "@connext/sdk-core";
import { chainIdToDomain } from "@connext/nxtp-utils";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

import { useDebounce } from "../hooks/useDebounce";
import {
  grumpyCatCoinAddress,
  useBridgeSendThroughBridge,
  useErc20BalanceOf,
  usePrepareBridgeSendThroughBridge,
  usePrepareZoomerCoinApprove,
  usePrepareZoomerXerc20LockboxDepositAndBridgeToL2,
  useZoomerCoinAllowance,
  useZoomerCoinApprove,
  useZoomerXerc20LockboxDepositAndBridgeToL2,
  zoomerCoinAddress,
  zoomerXerc20LockboxAddress,
} from "../generated";
import {
  Assets,
  configByAsset,
  getAddressByAsset,
  getApproveToByAsset,
} from "../utils/asset";

type BridgeUIProps = {
  asset: Assets;
  setAsset: Dispatch<SetStateAction<Assets>>;
};

export const BridgeUI = ({ asset, setAsset }: BridgeUIProps) => {
  const { colorMode } = useColorMode();
  const [_amountIn, setAmountIn] = useState("");
  const amountIn = useDebounce(_amountIn, 500);
  const [relayerFee, setRelayerFee] = useState("0");
  const [relayerFeeLoading, setRelayerFeeLoading] = useState(false);
  const [approvalNeeded, setApprovalNeeded] = useState(true);
  const [destinationChain, setDestinationChain] = useState<number | undefined>(
    undefined
  );
  const [connext, setConnext] = useState<
    { sdkBase: SdkBase; sdkUtils: SdkUtils } | undefined
  >();
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { refetch } = useZoomerCoinAllowance({
    chainId: 1,
    args: [
      walletClient?.account.address ??
        "0x0000000000000000000000000000000000000000",
      zoomerXerc20LockboxAddress[1],
    ],
    enabled: false,
  });

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
  }, [walletClient?.account?.address]);

  const getRelayerFee = async (destinationChain: string) => {
    console.log("getting relayer fee: ", destinationChain);
    setRelayerFeeLoading(true);
    const fee = await connext?.sdkBase.estimateRelayerFee({
      originDomain: chainIdToDomain(walletClient!.chain.id).toString(),
      destinationDomain: chainIdToDomain(+destinationChain).toString(),
    });
    console.log("relayer fee: ", fee);
    setRelayerFeeLoading(false);
    setRelayerFee((fee ?? "0").toString());
  };

  const updateApprovals = async (amount: string) => {
    if (destinationChain === base.id) {
      const res = await refetch();
      if (res.isSuccess && res.data < parseEther(amount)) {
        console.log("approval needed");
        setApprovalNeeded(true);
      }
    } else {
      if (!walletClient?.chain.id) {
        throw new Error("walletClient?.chain.id is undefined");
      }
      console.log(
        "approveIfNeeded: ",
        chainIdToDomain(walletClient?.chain.id).toString(),
        zoomerCoinAddress[
          walletClient?.chain.id as keyof typeof zoomerCoinAddress
        ],
        parseEther(amount)
      );
      const res = await connext!.sdkBase.approveIfNeeded(
        chainIdToDomain(walletClient?.chain.id).toString(),
        zoomerCoinAddress[
          walletClient?.chain.id as keyof typeof zoomerCoinAddress
        ],
        parseEther(amount).toString(),
        true
      );
      console.log("res: ", res);
      console.log("approvalNeeded: ", !!res);
      setApprovalNeeded(!!res);
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
          <VStack spacing={4} align="stretch" p={4}>
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
                <Box pt={4}>
                  <SelectAsset asset={asset} setAsset={setAsset} />
                </Box>
                <Box pt={4}>
                  <AmountInInput
                    amountIn={_amountIn}
                    setAmountIn={setAmountIn}
                    updateApprovals={updateApprovals}
                    asset={asset}
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
                <Box pb={4} pt={4}>
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
                    />
                  )}
                </Box>
                <Text width={500}>
                  {destinationChain === base.id
                    ? `(bridging to base will take up to 10 min)`
                    : `(bridging will take 1-2 hours until we onboard instant-fill LPs)`}
                </Text>
              </Flex>
            )}
          </VStack>
        </CardBody>
      </Card>
    </>
  );
};

type SelectAssetProps = {
  asset: Assets;
  setAsset: Dispatch<SetStateAction<Assets>>;
};
const SelectAsset = ({ asset, setAsset }: SelectAssetProps) => {
  const handleChangeAsset = (event: ChangeEvent<HTMLSelectElement>) => {
    setAsset(event.target.value as Assets);
  };

  return (
    <Select
      placeholder="SELECT ASSET"
      size="lg"
      onChange={handleChangeAsset}
      value={asset}
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
  asset: Assets;
};
const AmountInInput = ({
  amountIn,
  setAmountIn,
  updateApprovals,
  asset,
}: AmountInProps) => {
  const { colorMode } = useColorMode();

  const handleAmountInChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setAmountIn(event.target.value);
    if (!event.target.value) {
      return;
    }
    await updateApprovals(event.target.value);
  };

  return (
    <Box>
      <Input
        w="100%"
        value={amountIn}
        onChange={handleAmountInChange}
        focusBorderColor="black"
        variant="outline"
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
  asset: Assets;
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
  });
  return (
    <Flex direction="column">
      <Flex pb={2}>
        <Code colorScheme="yellow" width={400}>
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

type SelectDestinationChainProps = {
  destinationChain: number | undefined;
  setDestinationChain: Dispatch<SetStateAction<number | undefined>>;
  walletChain: number;
  getRelayerFee: (destinationChain: string) => Promise<void>;
  updateApprovals: (amount: string) => Promise<void>;
  setRelayerFee: Dispatch<SetStateAction<string>>;
  amountIn: string;
  asset: Assets;
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

  return (
    <Select
      placeholder="destination chain"
      variant="outline"
      size="sm"
      w="250px"
      focusBorderColor="black"
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
        })}
    </Select>
  );
};

type RelayerFeeProps = {
  relayerFee: string;
  relayerFeeLoading: boolean;
  walletChain: number;
  asset: Assets;
};
const RelayerFee = ({
  relayerFeeLoading,
  walletChain,
  relayerFee,
  asset,
}: RelayerFeeProps) => {
  return (
    <Code colorScheme="yellow">
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
  asset: Assets;
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
  asset: Assets;
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
    abi: erc20ABI,
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
            infinite
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
  asset: Assets;
};
const BridgeButton = ({
  walletChain,
  relayerFee,
  amountIn,
  destinationChain,
  walletAddress,
  connext,
  asset,
}: BridgeButtonProps) => {
  const [xcallLoading, setXCallLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [xcallTxHash, setXCallTxHash] = useState("");
  const addRecentTransaction = useAddRecentTransaction();
  const { sendTransactionAsync } = useSendTransaction();
  const { config: zoomerBaseConfig } =
    usePrepareZoomerXerc20LockboxDepositAndBridgeToL2({
      args: [parseEther(amountIn)],
      enabled: !(
        asset === "zoomer" &&
        walletChain === mainnet.id &&
        destinationChain === base.id
      ),
    });
  const { writeAsync: depositWriteZoomerLockbox } =
    useZoomerXerc20LockboxDepositAndBridgeToL2(zoomerBaseConfig);
  const { colorMode } = useColorMode();
  const { config: sendThroughBridge } = usePrepareBridgeSendThroughBridge({
    enabled: asset === "grumpycat",
    args: [
      getAddressByAsset(asset, walletChain),
      walletAddress,
      destinationChain,
      BigInt(amountIn),
      "0x",
      0,
      encodePacked(["address", "uint256"], [walletAddress, BigInt(10)]),
    ],
  });
  const { writeAsync: sendThroughBridgeWrite } =
    useBridgeSendThroughBridge(sendThroughBridge);

  const handleXCall = async () => {
    console.log(`amountIn: ${parseEther(amountIn)}`);
    console.log("relayerFee: ", relayerFee);
    setXCallLoading(true);
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
          const sdkParams = {
            origin: chainIdToDomain(walletChain).toString(),
            destination: chainIdToDomain(destinationChain!).toString(),
            to: walletAddress,
            asset: getAddressByAsset(asset, walletChain),
            delegate: walletAddress,
            amount: parseEther(amountIn).toString(),
            slippage: "300",
            callData: "0x",
            relayerFee,
          };
          console.log("sdkParams: ", sdkParams);
          const res = await connext!.sdkBase.xcall(sdkParams);
          console.log("res: ", res);
          const data = await sendTransactionAsync({
            to: res.to! as Address,
            value: BigInt(0),
            data: res.data! as Hex,
          });
          tx = data.hash;
          startMonitoringTx();
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
    <Button
      variant="outline"
      borderColor="black"
      isDisabled={
        (walletChain === base.id && BigInt(relayerFee) == BigInt(0)) ||
        !amountIn
      }
      isLoading={xcallLoading}
      onClick={handleXCall}
      loadingText="/CHECK_WALLET"
      backgroundColor={
        colorMode === "light" ? "black" : configByAsset[asset].color
      }
      color={colorMode === "light" ? configByAsset[asset].color : "black"}
      width="100%"
    >
      /BRIDGE
    </Button>
  );
};
