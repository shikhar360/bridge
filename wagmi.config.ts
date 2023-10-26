import { defineConfig, loadEnv } from "@wagmi/cli";
import { erc, etherscan, react } from "@wagmi/cli/plugins";
import { arbitrum, base, bsc, mainnet, optimism, polygon } from "wagmi/chains";

export default defineConfig(() => {
  const env = loadEnv({
    mode: process.env.NODE_ENV,
    envDir: process.cwd(),
  });
  return {
    out: "src/generated.ts",
    contracts: [
      {
        name: "ZoomerCoin",
        address: {
          [mainnet.id]: "0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676",
          [polygon.id]: "0xb2588731d8f6F854037936d6ffac4c13d0b6bd62",
          [base.id]: "0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2",
        },
        abi: [
          {
            inputs: [],
            name: "IXERC20_NotFactory",
            type: "error",
          },
          {
            inputs: [],
            name: "IXERC20_NotHighEnoughLimits",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "_mintingLimit",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_burningLimit",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "_bridge",
                type: "address",
              },
            ],
            name: "BridgeLimitsSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [],
            name: "EIP712DomainChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint8",
                name: "version",
                type: "uint8",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "_lockbox",
                type: "address",
              },
            ],
            name: "LockboxSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
          {
            inputs: [],
            name: "DOMAIN_SEPARATOR",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "FACTORY",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "bridges",
            outputs: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "ratePerSecond",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxLimit",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "currentLimit",
                    type: "uint256",
                  },
                ],
                internalType: "struct IXERC20.BridgeParameters",
                name: "minterParams",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "ratePerSecond",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxLimit",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "currentLimit",
                    type: "uint256",
                  },
                ],
                internalType: "struct IXERC20.BridgeParameters",
                name: "burnerParams",
                type: "tuple",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "burn",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_bridge",
                type: "address",
              },
            ],
            name: "burningCurrentLimitOf",
            outputs: [
              {
                internalType: "uint256",
                name: "_limit",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_bridge",
                type: "address",
              },
            ],
            name: "burningMaxLimitOf",
            outputs: [
              {
                internalType: "uint256",
                name: "_limit",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "decimals",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "subtractedValue",
                type: "uint256",
              },
            ],
            name: "decreaseAllowance",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "eip712Domain",
            outputs: [
              {
                internalType: "bytes1",
                name: "fields",
                type: "bytes1",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "version",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "chainId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "verifyingContract",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
              },
              {
                internalType: "uint256[]",
                name: "extensions",
                type: "uint256[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "addedValue",
                type: "uint256",
              },
            ],
            name: "increaseAllowance",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "_name",
                type: "string",
              },
              {
                internalType: "string",
                name: "_symbol",
                type: "string",
              },
              {
                internalType: "address",
                name: "_factory",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "lockbox",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_bridge",
                type: "address",
              },
            ],
            name: "mintingCurrentLimitOf",
            outputs: [
              {
                internalType: "uint256",
                name: "_limit",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_bridge",
                type: "address",
              },
            ],
            name: "mintingMaxLimitOf",
            outputs: [
              {
                internalType: "uint256",
                name: "_limit",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "name",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
            ],
            name: "nonces",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
            ],
            name: "permit",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_bridge",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "_mintingLimit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_burningLimit",
                type: "uint256",
              },
            ],
            name: "setLimits",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_lockbox",
                type: "address",
              },
            ],
            name: "setLockbox",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "symbol",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "transfer",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "transferFrom",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
      },
      {
        name: "ZoomerXERC20Lockbox",
        address: { [mainnet.id]: "0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87" },
        abi: [
          {
            inputs: [],
            name: "IXERC20Lockbox_Native",
            type: "error",
          },
          {
            inputs: [],
            name: "IXERC20Lockbox_NotNative",
            type: "error",
          },
          {
            inputs: [],
            name: "IXERC20Lockbox_WithdrawFailed",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "Deposit",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint8",
                name: "version",
                type: "uint8",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "Withdraw",
            type: "event",
          },
          {
            inputs: [],
            name: "ERC20",
            outputs: [
              {
                internalType: "contract IERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "IS_NATIVE",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "OWNER",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "OpL1XERC20BRIDGE",
            outputs: [
              {
                internalType: "contract OpL1XERC20Bridge",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "XERC20",
            outputs: [
              {
                internalType: "contract IXERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "deposit",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "deposit",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "depositAndBridgeToL2",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_xerc20",
                type: "address",
              },
              {
                internalType: "address",
                name: "_erc20",
                type: "address",
              },
              {
                internalType: "bool",
                name: "_isNative",
                type: "bool",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes[]",
                name: "data",
                type: "bytes[]",
              },
            ],
            name: "multicall",
            outputs: [
              {
                internalType: "bytes[]",
                name: "results",
                type: "bytes[]",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_opL1XERC20Bridge",
                type: "address",
              },
            ],
            name: "setOpL1XERC20Bridge",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "withdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            stateMutability: "payable",
            type: "receive",
          },
        ],
      },
    ],
    plugins: [
      erc({ "20": true, "721": false }),
      etherscan({
        apiKey: env.ETHERSCAN_API_KEY!,
        chainId: mainnet.id,
        contracts: [
          {
            name: "GrumpyCatCoin",
            address: {
              [mainnet.id]: "0xd8E2D95C8614F28169757cD6445a71c291dEc5bF",
              [polygon.id]: "0x3B350F202473932411772C8Cb76DB7975f42397E",
              [optimism.id]: "0x3B350F202473932411772C8Cb76DB7975f42397E",
              [bsc.id]: "0x3B350F202473932411772C8Cb76DB7975f42397E",
              [arbitrum.id]: "0x3B350F202473932411772C8Cb76DB7975f42397E",
            },
          },
        ],
      }),
      react(),
    ],
  };
});
