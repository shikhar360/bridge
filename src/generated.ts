import {
  useNetwork,
  useChainId,
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  Address,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bridge
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export const bridgeABI = [
  {
    type: 'error',
    inputs: [
      {
        name: '_bridgeType',
        internalType: 'enum Bridge.BridgeType',
        type: 'uint8',
      },
    ],
    name: 'BridgeContractNotSet',
  },
  {
    type: 'error',
    inputs: [
      { name: '_destinationChainId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'DestinationChainNotSupported',
  },
  {
    type: 'error',
    inputs: [{ name: '_fee', internalType: 'uint32', type: 'uint32' }],
    name: 'FeeOutOfBounds',
  },
  { type: 'error', inputs: [], name: 'InvalidBridgeType' },
  {
    type: 'error',
    inputs: [
      { name: '_length1', internalType: 'uint256', type: 'uint256' },
      { name: '_length2', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'LengthsMustMatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'enum Bridge.BridgeType', type: 'uint8' },
    ],
    name: 'bridges',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    name: 'connextChainIdToDomain',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_fee', internalType: 'uint32', type: 'uint32' },
      {
        name: '_bridgeTypes',
        internalType: 'enum Bridge.BridgeType[]',
        type: 'uint8[]',
      },
      { name: '_bridges', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_destinationChainId', internalType: 'uint32', type: 'uint32' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
      {
        name: '_bridgeType',
        internalType: 'enum Bridge.BridgeType',
        type: 'uint8',
      },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'sendThroughBridge',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: '_bridgeType',
        internalType: 'enum Bridge.BridgeType',
        type: 'uint8',
      },
      { name: '_bridge', internalType: 'address', type: 'address' },
    ],
    name: 'setBridge',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_chainId', internalType: 'uint32[]', type: 'uint32[]' },
      { name: '_connextDomain', internalType: 'uint32[]', type: 'uint32[]' },
    ],
    name: 'setDomains',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_fee', internalType: 'uint32', type: 'uint32' }],
    name: 'setFee',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export const bridgeAddress = {
  1: '0xDDFC70d9932ea7297724b621CcCb17bFF96995DD',
  10: '0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A',
  56: '0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393',
  137: '0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A',
  8453: '0x0000000000000000000000000000000000000000',
  42161: '0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export const bridgeConfig = { address: bridgeAddress, abi: bridgeABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20ABI = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GrumpyCatCoin
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export const grumpyCatCoinABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_maxWalletTimer', internalType: 'uint256', type: 'uint256' },
      { name: '_airdropLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_CEXWallet', internalType: 'address', type: 'address' },
      { name: '_end', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Airdropped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'toPair', internalType: 'address', type: 'address' }],
    name: 'addPair',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipients', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'airdrop',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'airdropLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'burntGrumpyCat',
    outputs: [
      { name: '', internalType: 'contract BurntGrumpyCat', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'maxWallet',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'maxWalletTimer',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export const grumpyCatCoinAddress = {
  1: '0xd8E2D95C8614F28169757cD6445a71c291dEc5bF',
  10: '0x3B350F202473932411772C8Cb76DB7975f42397E',
  56: '0x3B350F202473932411772C8Cb76DB7975f42397E',
  137: '0x3B350F202473932411772C8Cb76DB7975f42397E',
  42161: '0x3B350F202473932411772C8Cb76DB7975f42397E',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export const grumpyCatCoinConfig = {
  address: grumpyCatCoinAddress,
  abi: grumpyCatCoinABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZoomerCoin
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export const zoomerCoinABI = [
  { type: 'error', inputs: [], name: 'IXERC20_NotFactory' },
  { type: 'error', inputs: [], name: 'IXERC20_NotHighEnoughLimits' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_mintingLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_burningLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_bridge',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BridgeLimitsSet',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_lockbox',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'LockboxSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'FACTORY',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'bridges',
    outputs: [
      {
        name: 'minterParams',
        internalType: 'struct IXERC20.BridgeParameters',
        type: 'tuple',
        components: [
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'ratePerSecond', internalType: 'uint256', type: 'uint256' },
          { name: 'maxLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'currentLimit', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'burnerParams',
        internalType: 'struct IXERC20.BridgeParameters',
        type: 'tuple',
        components: [
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'ratePerSecond', internalType: 'uint256', type: 'uint256' },
          { name: 'maxLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'currentLimit', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_bridge', internalType: 'address', type: 'address' }],
    name: 'burningCurrentLimitOf',
    outputs: [{ name: '_limit', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_bridge', internalType: 'address', type: 'address' }],
    name: 'burningMaxLimitOf',
    outputs: [{ name: '_limit', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_factory', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'lockbox',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_bridge', internalType: 'address', type: 'address' }],
    name: 'mintingCurrentLimitOf',
    outputs: [{ name: '_limit', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_bridge', internalType: 'address', type: 'address' }],
    name: 'mintingMaxLimitOf',
    outputs: [{ name: '_limit', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_bridge', internalType: 'address', type: 'address' },
      { name: '_mintingLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_burningLimit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setLimits',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_lockbox', internalType: 'address', type: 'address' }],
    name: 'setLockbox',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export const zoomerCoinAddress = {
  1: '0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676',
  10: '0x0000000000000000000000000000000000000000',
  56: '0x0000000000000000000000000000000000000000',
  137: '0xb2588731d8f6F854037936d6ffac4c13d0b6bd62',
  8453: '0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2',
  42161: '0x0000000000000000000000000000000000000000',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export const zoomerCoinConfig = {
  address: zoomerCoinAddress,
  abi: zoomerCoinABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZoomerXERC20Lockbox
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export const zoomerXerc20LockboxABI = [
  { type: 'error', inputs: [], name: 'IXERC20Lockbox_Native' },
  { type: 'error', inputs: [], name: 'IXERC20Lockbox_NotNative' },
  { type: 'error', inputs: [], name: 'IXERC20Lockbox_WithdrawFailed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdraw',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ERC20',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'IS_NATIVE',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'OWNER',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'OpL1XERC20BRIDGE',
    outputs: [
      { name: '', internalType: 'contract OpL1XERC20Bridge', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'XERC20',
    outputs: [{ name: '', internalType: 'contract IXERC20', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'depositAndBridgeToL2',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_xerc20', internalType: 'address', type: 'address' },
      { name: '_erc20', internalType: 'address', type: 'address' },
      { name: '_isNative', internalType: 'bool', type: 'bool' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_opL1XERC20Bridge', internalType: 'address', type: 'address' },
    ],
    name: 'setOpL1XERC20Bridge',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export const zoomerXerc20LockboxAddress = {
  1: '0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87',
  10: '0x0000000000000000000000000000000000000000',
  56: '0x0000000000000000000000000000000000000000',
  137: '0x0000000000000000000000000000000000000000',
  8453: '0x0000000000000000000000000000000000000000',
  42161: '0x0000000000000000000000000000000000000000',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export const zoomerXerc20LockboxConfig = {
  address: zoomerXerc20LockboxAddress,
  abi: zoomerXerc20LockboxABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bridgeABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof bridgeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    ...config,
  } as UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"bridges"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeBridges<
  TFunctionName extends 'bridges',
  TSelectData = ReadContractResult<typeof bridgeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'bridges',
    ...config,
  } as UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"connextChainIdToDomain"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeConnextChainIdToDomain<
  TFunctionName extends 'connextChainIdToDomain',
  TSelectData = ReadContractResult<typeof bridgeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'connextChainIdToDomain',
    ...config,
  } as UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"fee"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeFee<
  TFunctionName extends 'fee',
  TSelectData = ReadContractResult<typeof bridgeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'fee',
    ...config,
  } as UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"owner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof bridgeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"paused"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgePaused<
  TFunctionName extends 'paused',
  TSelectData = ReadContractResult<typeof bridgeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'paused',
    ...config,
  } as UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"pendingOwner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgePendingOwner<
  TFunctionName extends 'pendingOwner',
  TSelectData = ReadContractResult<typeof bridgeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'pendingOwner',
    ...config,
  } as UseContractReadConfig<typeof bridgeABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof bridgeABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof bridgeABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, TFunctionName, TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"acceptOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeAcceptOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bridgeABI,
          'acceptOwnership'
        >['request']['abi'],
        'acceptOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'acceptOwnership'
      }
    : UseContractWriteConfig<typeof bridgeABI, 'acceptOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'acceptOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, 'acceptOwnership', TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'acceptOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bridgeABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof bridgeABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, 'initialize', TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bridgeABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      }
    : UseContractWriteConfig<typeof bridgeABI, 'renounceOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, 'renounceOwnership', TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"sendThroughBridge"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeSendThroughBridge<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bridgeABI,
          'sendThroughBridge'
        >['request']['abi'],
        'sendThroughBridge',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'sendThroughBridge'
      }
    : UseContractWriteConfig<typeof bridgeABI, 'sendThroughBridge', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'sendThroughBridge'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, 'sendThroughBridge', TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'sendThroughBridge',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"setBridge"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeSetBridge<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bridgeABI,
          'setBridge'
        >['request']['abi'],
        'setBridge',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setBridge' }
    : UseContractWriteConfig<typeof bridgeABI, 'setBridge', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setBridge'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, 'setBridge', TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'setBridge',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"setDomains"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeSetDomains<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bridgeABI,
          'setDomains'
        >['request']['abi'],
        'setDomains',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setDomains' }
    : UseContractWriteConfig<typeof bridgeABI, 'setDomains', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setDomains'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, 'setDomains', TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'setDomains',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"setFee"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeSetFee<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bridgeABI,
          'setFee'
        >['request']['abi'],
        'setFee',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setFee' }
    : UseContractWriteConfig<typeof bridgeABI, 'setFee', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setFee'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, 'setFee', TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'setFee',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bridgeABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferOwnership'
      }
    : UseContractWriteConfig<typeof bridgeABI, 'transferOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, 'transferOwnership', TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeWithdraw<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof bridgeAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bridgeABI,
          'withdraw'
        >['request']['abi'],
        'withdraw',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof bridgeABI, 'withdraw', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdraw'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof bridgeABI, 'withdraw', TMode>({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"acceptOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeAcceptOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, 'acceptOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'acceptOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, 'acceptOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"sendThroughBridge"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeSendThroughBridge(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, 'sendThroughBridge'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'sendThroughBridge',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, 'sendThroughBridge'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"setBridge"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeSetBridge(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, 'setBridge'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'setBridge',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, 'setBridge'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"setDomains"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeSetDomains(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, 'setDomains'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'setDomains',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, 'setDomains'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"setFee"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeSetFee(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, 'setFee'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'setFee',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, 'setFee'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bridgeABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function usePrepareBridgeWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bridgeABI, 'withdraw'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bridgeABI, 'withdraw'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bridgeABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof bridgeABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    ...config,
  } as UseContractEventConfig<typeof bridgeABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bridgeABI}__ and `eventName` set to `"Initialized"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeInitializedEvent(
  config: Omit<
    UseContractEventConfig<typeof bridgeABI, 'Initialized'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    eventName: 'Initialized',
    ...config,
  } as UseContractEventConfig<typeof bridgeABI, 'Initialized'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bridgeABI}__ and `eventName` set to `"OwnershipTransferStarted"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeOwnershipTransferStartedEvent(
  config: Omit<
    UseContractEventConfig<typeof bridgeABI, 'OwnershipTransferStarted'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    eventName: 'OwnershipTransferStarted',
    ...config,
  } as UseContractEventConfig<typeof bridgeABI, 'OwnershipTransferStarted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bridgeABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof bridgeABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof bridgeABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bridgeABI}__ and `eventName` set to `"Paused"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgePausedEvent(
  config: Omit<
    UseContractEventConfig<typeof bridgeABI, 'Paused'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    eventName: 'Paused',
    ...config,
  } as UseContractEventConfig<typeof bridgeABI, 'Paused'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bridgeABI}__ and `eventName` set to `"Unpaused"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDDFC70d9932ea7297724b621CcCb17bFF96995DD)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0xF9479E3DB37F75Dc2f6B1d51a5D2dbE40eBF5393)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x64d80a46C4183A3B9CBca6dAEA8B3397C43FA13A)
 */
export function useBridgeUnpausedEvent(
  config: Omit<
    UseContractEventConfig<typeof bridgeABI, 'Unpaused'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof bridgeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: bridgeABI,
    address: bridgeAddress[chainId as keyof typeof bridgeAddress],
    eventName: 'Unpaused',
    ...config,
  } as UseContractEventConfig<typeof bridgeABI, 'Unpaused'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: erc20ABI, ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useErc20Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc20BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useErc20Decimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"name"`.
 */
export function useErc20Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc20Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc20TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc20ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, TFunctionName, TMode>({
    abi: erc20ABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc20Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof erc20ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'approve', TMode>({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useErc20Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof erc20ABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'transfer', TMode>({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc20TransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof erc20ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'transferFrom', TMode>({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useErc20IncreaseAllowance<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'increaseAllowance'
        >['request']['abi'],
        'increaseAllowance',
        TMode
      > & { functionName?: 'increaseAllowance' }
    : UseContractWriteConfig<typeof erc20ABI, 'increaseAllowance', TMode> & {
        abi?: never
        functionName?: 'increaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'increaseAllowance', TMode>({
    abi: erc20ABI,
    functionName: 'increaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useErc20DecreaseAllowance<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'decreaseAllowance'
        >['request']['abi'],
        'decreaseAllowance',
        TMode
      > & { functionName?: 'decreaseAllowance' }
    : UseContractWriteConfig<typeof erc20ABI, 'decreaseAllowance', TMode> & {
        abi?: never
        functionName?: 'decreaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'decreaseAllowance', TMode>({
    abi: erc20ABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function usePrepareErc20Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc20Approve(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareErc20Transfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc20TransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareErc20IncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'increaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'increaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'increaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareErc20DecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'decreaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'decreaseAllowance'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: erc20ABI,
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Approval"`.
 */
export function useErc20ApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Transfer"`.
 */
export function useErc20TransferEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"airdropLimit"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinAirdropLimit<
  TFunctionName extends 'airdropLimit',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'airdropLimit',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"allowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"balanceOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"burntGrumpyCat"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinBurntGrumpyCat<
  TFunctionName extends 'burntGrumpyCat',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'burntGrumpyCat',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"decimals"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"maxWallet"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinMaxWallet<
  TFunctionName extends 'maxWallet',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'maxWallet',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"maxWalletTimer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinMaxWalletTimer<
  TFunctionName extends 'maxWalletTimer',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'maxWalletTimer',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"name"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"owner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"symbol"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"totalSupply"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof grumpyCatCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof grumpyCatCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<
    typeof grumpyCatCoinABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof grumpyCatCoinABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, TFunctionName, TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"addPair"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinAddPair<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'addPair'
        >['request']['abi'],
        'addPair',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'addPair' }
    : UseContractWriteConfig<typeof grumpyCatCoinABI, 'addPair', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addPair'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'addPair', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'addPair',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"airdrop"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinAirdrop<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'airdrop'
        >['request']['abi'],
        'airdrop',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'airdrop' }
    : UseContractWriteConfig<typeof grumpyCatCoinABI, 'airdrop', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'airdrop'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'airdrop', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'airdrop',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"approve"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinApprove<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'approve' }
    : UseContractWriteConfig<typeof grumpyCatCoinABI, 'approve', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'approve'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'approve', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"burn"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinBurn<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'burn'
        >['request']['abi'],
        'burn',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'burn' }
    : UseContractWriteConfig<typeof grumpyCatCoinABI, 'burn', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'burn'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'burn', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"decreaseAllowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinDecreaseAllowance<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'decreaseAllowance'
        >['request']['abi'],
        'decreaseAllowance',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'decreaseAllowance'
      }
    : UseContractWriteConfig<
        typeof grumpyCatCoinABI,
        'decreaseAllowance',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'decreaseAllowance'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'decreaseAllowance', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'decreaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"increaseAllowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinIncreaseAllowance<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'increaseAllowance'
        >['request']['abi'],
        'increaseAllowance',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'increaseAllowance'
      }
    : UseContractWriteConfig<
        typeof grumpyCatCoinABI,
        'increaseAllowance',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'increaseAllowance'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'increaseAllowance', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'increaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      }
    : UseContractWriteConfig<
        typeof grumpyCatCoinABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'renounceOwnership', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinTransfer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transfer' }
    : UseContractWriteConfig<typeof grumpyCatCoinABI, 'transfer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transfer'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'transfer', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"transferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferFrom'
      }
    : UseContractWriteConfig<typeof grumpyCatCoinABI, 'transferFrom', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferFrom'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'transferFrom', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof grumpyCatCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof grumpyCatCoinABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferOwnership'
      }
    : UseContractWriteConfig<
        typeof grumpyCatCoinABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof grumpyCatCoinABI, 'transferOwnership', TMode>({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"addPair"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinAddPair(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'addPair'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'addPair',
    ...config,
  } as UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'addPair'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"airdrop"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinAirdrop(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'airdrop'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'airdrop',
    ...config,
  } as UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'airdrop'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"approve"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'approve'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"burn"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinBurn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'burn'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"decreaseAllowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinDecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'decreaseAllowance'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'decreaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof grumpyCatCoinABI,
    'decreaseAllowance'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"increaseAllowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinIncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'increaseAllowance'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'increaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof grumpyCatCoinABI,
    'increaseAllowance'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof grumpyCatCoinABI,
    'renounceOwnership'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'transfer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"transferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'transferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function usePrepareGrumpyCatCoinTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof grumpyCatCoinABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof grumpyCatCoinABI,
    'transferOwnership'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link grumpyCatCoinABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof grumpyCatCoinABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    ...config,
  } as UseContractEventConfig<typeof grumpyCatCoinABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `eventName` set to `"Airdropped"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinAirdroppedEvent(
  config: Omit<
    UseContractEventConfig<typeof grumpyCatCoinABI, 'Airdropped'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    eventName: 'Airdropped',
    ...config,
  } as UseContractEventConfig<typeof grumpyCatCoinABI, 'Airdropped'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `eventName` set to `"Approval"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof grumpyCatCoinABI, 'Approval'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof grumpyCatCoinABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof grumpyCatCoinABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof grumpyCatCoinABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link grumpyCatCoinABI}__ and `eventName` set to `"Transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xd8E2D95C8614F28169757cD6445a71c291dEc5bF)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x3B350F202473932411772C8Cb76DB7975f42397E)
 */
export function useGrumpyCatCoinTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof grumpyCatCoinABI, 'Transfer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof grumpyCatCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: grumpyCatCoinABI,
    address: grumpyCatCoinAddress[chainId as keyof typeof grumpyCatCoinAddress],
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof grumpyCatCoinABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinDomainSeparator<
  TFunctionName extends 'DOMAIN_SEPARATOR',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'DOMAIN_SEPARATOR',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"FACTORY"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinFactory<
  TFunctionName extends 'FACTORY',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'FACTORY',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"allowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"balanceOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"bridges"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinBridges<
  TFunctionName extends 'bridges',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'bridges',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"burningCurrentLimitOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinBurningCurrentLimitOf<
  TFunctionName extends 'burningCurrentLimitOf',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'burningCurrentLimitOf',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"burningMaxLimitOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinBurningMaxLimitOf<
  TFunctionName extends 'burningMaxLimitOf',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'burningMaxLimitOf',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"decimals"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"eip712Domain"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinEip712Domain<
  TFunctionName extends 'eip712Domain',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'eip712Domain',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"lockbox"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinLockbox<
  TFunctionName extends 'lockbox',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'lockbox',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"mintingCurrentLimitOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinMintingCurrentLimitOf<
  TFunctionName extends 'mintingCurrentLimitOf',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'mintingCurrentLimitOf',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"mintingMaxLimitOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinMintingMaxLimitOf<
  TFunctionName extends 'mintingMaxLimitOf',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'mintingMaxLimitOf',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"name"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"nonces"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinNonces<
  TFunctionName extends 'nonces',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'nonces',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"owner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"symbol"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"totalSupply"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof zoomerCoinABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof zoomerCoinABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof zoomerCoinABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, TFunctionName, TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"approve"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinApprove<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'approve' }
    : UseContractWriteConfig<typeof zoomerCoinABI, 'approve', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'approve'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'approve', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"burn"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinBurn<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'burn'
        >['request']['abi'],
        'burn',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'burn' }
    : UseContractWriteConfig<typeof zoomerCoinABI, 'burn', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'burn'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'burn', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"decreaseAllowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinDecreaseAllowance<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'decreaseAllowance'
        >['request']['abi'],
        'decreaseAllowance',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'decreaseAllowance'
      }
    : UseContractWriteConfig<
        typeof zoomerCoinABI,
        'decreaseAllowance',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'decreaseAllowance'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'decreaseAllowance', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'decreaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"increaseAllowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinIncreaseAllowance<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'increaseAllowance'
        >['request']['abi'],
        'increaseAllowance',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'increaseAllowance'
      }
    : UseContractWriteConfig<
        typeof zoomerCoinABI,
        'increaseAllowance',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'increaseAllowance'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'increaseAllowance', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'increaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof zoomerCoinABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'initialize', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"mint"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinMint<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'mint'
        >['request']['abi'],
        'mint',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'mint' }
    : UseContractWriteConfig<typeof zoomerCoinABI, 'mint', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'mint'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'mint', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"permit"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinPermit<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'permit'
        >['request']['abi'],
        'permit',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'permit' }
    : UseContractWriteConfig<typeof zoomerCoinABI, 'permit', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'permit'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'permit', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'permit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      }
    : UseContractWriteConfig<
        typeof zoomerCoinABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'renounceOwnership', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"setLimits"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinSetLimits<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'setLimits'
        >['request']['abi'],
        'setLimits',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setLimits' }
    : UseContractWriteConfig<typeof zoomerCoinABI, 'setLimits', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setLimits'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'setLimits', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'setLimits',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"setLockbox"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinSetLockbox<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'setLockbox'
        >['request']['abi'],
        'setLockbox',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setLockbox' }
    : UseContractWriteConfig<typeof zoomerCoinABI, 'setLockbox', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setLockbox'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'setLockbox', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'setLockbox',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinTransfer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transfer' }
    : UseContractWriteConfig<typeof zoomerCoinABI, 'transfer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transfer'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'transfer', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"transferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferFrom'
      }
    : UseContractWriteConfig<typeof zoomerCoinABI, 'transferFrom', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferFrom'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'transferFrom', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerCoinAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerCoinABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferOwnership'
      }
    : UseContractWriteConfig<
        typeof zoomerCoinABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerCoinABI, 'transferOwnership', TMode>({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"approve"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'approve'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"burn"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinBurn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'burn'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"decreaseAllowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinDecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'decreaseAllowance'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'decreaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'decreaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"increaseAllowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinIncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'increaseAllowance'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'increaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'increaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"mint"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'mint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"permit"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinPermit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'permit'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'permit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'permit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"setLimits"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinSetLimits(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'setLimits'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'setLimits',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'setLimits'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"setLockbox"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinSetLockbox(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'setLockbox'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'setLockbox',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'setLockbox'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'transfer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"transferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'transferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerCoinABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerCoinTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerCoinABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerCoinABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof zoomerCoinABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    ...config,
  } as UseContractEventConfig<typeof zoomerCoinABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerCoinABI}__ and `eventName` set to `"Approval"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerCoinABI, 'Approval'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof zoomerCoinABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerCoinABI}__ and `eventName` set to `"BridgeLimitsSet"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinBridgeLimitsSetEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerCoinABI, 'BridgeLimitsSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    eventName: 'BridgeLimitsSet',
    ...config,
  } as UseContractEventConfig<typeof zoomerCoinABI, 'BridgeLimitsSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerCoinABI}__ and `eventName` set to `"EIP712DomainChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinEip712DomainChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerCoinABI, 'EIP712DomainChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    eventName: 'EIP712DomainChanged',
    ...config,
  } as UseContractEventConfig<typeof zoomerCoinABI, 'EIP712DomainChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerCoinABI}__ and `eventName` set to `"Initialized"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinInitializedEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerCoinABI, 'Initialized'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    eventName: 'Initialized',
    ...config,
  } as UseContractEventConfig<typeof zoomerCoinABI, 'Initialized'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerCoinABI}__ and `eventName` set to `"LockboxSet"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinLockboxSetEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerCoinABI, 'LockboxSet'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    eventName: 'LockboxSet',
    ...config,
  } as UseContractEventConfig<typeof zoomerCoinABI, 'LockboxSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerCoinABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerCoinABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof zoomerCoinABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerCoinABI}__ and `eventName` set to `"Transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0D505C03d30e65f6e9b4Ef88855a47a89e4b7676)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xb2588731d8f6F854037936d6ffac4c13d0b6bd62)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1dB4851bcF5B41442cAA32025Ce0Afe6B8EabC2)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerCoinTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerCoinABI, 'Transfer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerCoinAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerCoinABI,
    address: zoomerCoinAddress[chainId as keyof typeof zoomerCoinAddress],
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof zoomerCoinABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof zoomerXerc20LockboxABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof zoomerXerc20LockboxABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    ...config,
  } as UseContractReadConfig<
    typeof zoomerXerc20LockboxABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"ERC20"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxErc20<
  TFunctionName extends 'ERC20',
  TSelectData = ReadContractResult<
    typeof zoomerXerc20LockboxABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof zoomerXerc20LockboxABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'ERC20',
    ...config,
  } as UseContractReadConfig<
    typeof zoomerXerc20LockboxABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"IS_NATIVE"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxIsNative<
  TFunctionName extends 'IS_NATIVE',
  TSelectData = ReadContractResult<
    typeof zoomerXerc20LockboxABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof zoomerXerc20LockboxABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'IS_NATIVE',
    ...config,
  } as UseContractReadConfig<
    typeof zoomerXerc20LockboxABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"OWNER"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxOwner<
  TFunctionName extends 'OWNER',
  TSelectData = ReadContractResult<
    typeof zoomerXerc20LockboxABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof zoomerXerc20LockboxABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'OWNER',
    ...config,
  } as UseContractReadConfig<
    typeof zoomerXerc20LockboxABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"OpL1XERC20BRIDGE"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxOpL1Xerc20Bridge<
  TFunctionName extends 'OpL1XERC20BRIDGE',
  TSelectData = ReadContractResult<
    typeof zoomerXerc20LockboxABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof zoomerXerc20LockboxABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'OpL1XERC20BRIDGE',
    ...config,
  } as UseContractReadConfig<
    typeof zoomerXerc20LockboxABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"XERC20"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxXerc20<
  TFunctionName extends 'XERC20',
  TSelectData = ReadContractResult<
    typeof zoomerXerc20LockboxABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof zoomerXerc20LockboxABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'XERC20',
    ...config,
  } as UseContractReadConfig<
    typeof zoomerXerc20LockboxABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerXerc20LockboxAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerXerc20LockboxABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<
        typeof zoomerXerc20LockboxABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerXerc20LockboxABI, TFunctionName, TMode>({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"deposit"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxDeposit<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerXerc20LockboxAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerXerc20LockboxABI,
          'deposit'
        >['request']['abi'],
        'deposit',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'deposit' }
    : UseContractWriteConfig<
        typeof zoomerXerc20LockboxABI,
        'deposit',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'deposit'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerXerc20LockboxABI, 'deposit', TMode>({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'deposit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"depositAndBridgeToL2"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxDepositAndBridgeToL2<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerXerc20LockboxAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerXerc20LockboxABI,
          'depositAndBridgeToL2'
        >['request']['abi'],
        'depositAndBridgeToL2',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'depositAndBridgeToL2'
      }
    : UseContractWriteConfig<
        typeof zoomerXerc20LockboxABI,
        'depositAndBridgeToL2',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'depositAndBridgeToL2'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<
    typeof zoomerXerc20LockboxABI,
    'depositAndBridgeToL2',
    TMode
  >({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'depositAndBridgeToL2',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerXerc20LockboxAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerXerc20LockboxABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<
        typeof zoomerXerc20LockboxABI,
        'initialize',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerXerc20LockboxABI, 'initialize', TMode>({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"multicall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxMulticall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerXerc20LockboxAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerXerc20LockboxABI,
          'multicall'
        >['request']['abi'],
        'multicall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'multicall' }
    : UseContractWriteConfig<
        typeof zoomerXerc20LockboxABI,
        'multicall',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'multicall'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerXerc20LockboxABI, 'multicall', TMode>({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'multicall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"setOpL1XERC20Bridge"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxSetOpL1Xerc20Bridge<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerXerc20LockboxAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerXerc20LockboxABI,
          'setOpL1XERC20Bridge'
        >['request']['abi'],
        'setOpL1XERC20Bridge',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setOpL1XERC20Bridge'
      }
    : UseContractWriteConfig<
        typeof zoomerXerc20LockboxABI,
        'setOpL1XERC20Bridge',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setOpL1XERC20Bridge'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<
    typeof zoomerXerc20LockboxABI,
    'setOpL1XERC20Bridge',
    TMode
  >({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'setOpL1XERC20Bridge',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxWithdraw<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zoomerXerc20LockboxAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zoomerXerc20LockboxABI,
          'withdraw'
        >['request']['abi'],
        'withdraw',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'withdraw' }
    : UseContractWriteConfig<
        typeof zoomerXerc20LockboxABI,
        'withdraw',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdraw'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zoomerXerc20LockboxABI, 'withdraw', TMode>({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerXerc20LockboxWrite<
  TFunctionName extends string,
>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerXerc20LockboxABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoomerXerc20LockboxABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"deposit"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerXerc20LockboxDeposit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerXerc20LockboxABI, 'deposit'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'deposit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerXerc20LockboxABI, 'deposit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"depositAndBridgeToL2"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerXerc20LockboxDepositAndBridgeToL2(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof zoomerXerc20LockboxABI,
      'depositAndBridgeToL2'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'depositAndBridgeToL2',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoomerXerc20LockboxABI,
    'depositAndBridgeToL2'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerXerc20LockboxInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerXerc20LockboxABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoomerXerc20LockboxABI,
    'initialize'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"multicall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerXerc20LockboxMulticall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerXerc20LockboxABI, 'multicall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'multicall',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoomerXerc20LockboxABI,
    'multicall'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"setOpL1XERC20Bridge"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerXerc20LockboxSetOpL1Xerc20Bridge(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof zoomerXerc20LockboxABI,
      'setOpL1XERC20Bridge'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'setOpL1XERC20Bridge',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zoomerXerc20LockboxABI,
    'setOpL1XERC20Bridge'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function usePrepareZoomerXerc20LockboxWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zoomerXerc20LockboxABI, 'withdraw'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zoomerXerc20LockboxABI, 'withdraw'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof zoomerXerc20LockboxABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    ...config,
  } as UseContractEventConfig<typeof zoomerXerc20LockboxABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `eventName` set to `"Deposit"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxDepositEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerXerc20LockboxABI, 'Deposit'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    eventName: 'Deposit',
    ...config,
  } as UseContractEventConfig<typeof zoomerXerc20LockboxABI, 'Deposit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `eventName` set to `"Initialized"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxInitializedEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerXerc20LockboxABI, 'Initialized'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    eventName: 'Initialized',
    ...config,
  } as UseContractEventConfig<typeof zoomerXerc20LockboxABI, 'Initialized'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zoomerXerc20LockboxABI}__ and `eventName` set to `"Withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf16C4F1c3cff5E2C2CB2591456E891aad7FFC87)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Bnb Smart Chain Bsc Scan__](https://bscscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x0000000000000000000000000000000000000000)
 */
export function useZoomerXerc20LockboxWithdrawEvent(
  config: Omit<
    UseContractEventConfig<typeof zoomerXerc20LockboxABI, 'Withdraw'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zoomerXerc20LockboxAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zoomerXerc20LockboxABI,
    address:
      zoomerXerc20LockboxAddress[
        chainId as keyof typeof zoomerXerc20LockboxAddress
      ],
    eventName: 'Withdraw',
    ...config,
  } as UseContractEventConfig<typeof zoomerXerc20LockboxABI, 'Withdraw'>)
}
