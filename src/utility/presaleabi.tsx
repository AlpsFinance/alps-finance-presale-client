export const preSaleAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_presaleReceiver",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "presaleAmountOverdemand",
    type: "error",
  },
  {
    inputs: [],
    name: "presaleMaximumPresaleAmountInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "presaleMimumumUSDPurchaseInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "presaleNativeTokenPaymentNotSufficient",
    type: "error",
  },
  {
    inputs: [],
    name: "presaleNonZeroAddressInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "presaleRoundClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "presaleStartingTimeInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "presaleTokenNotAvailable",
    type: "error",
  },
  {
    inputs: [],
    name: "presaleUSDPriceInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "presaleUSDPurchaseNotSufficient",
    type: "error",
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
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "tokenAvailability",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "address",
        name: "aggregatorAddress",
        type: "address",
      },
    ],
    name: "PresalePaymentTokenUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "receiverAddress",
        type: "address",
      },
    ],
    name: "PresaleReceiverUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "presaleRound",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startingTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minimumUSDPurchase",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maximumPresaleAmount",
        type: "uint256",
      },
    ],
    name: "PresaleRoundUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "PresaleTokenUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "paymentTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paymentTokenamount",
        type: "uint256",
      },
    ],
    name: "TokenPresold",
    type: "event",
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
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "presaleAmountByRoundMapping",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "presaleDetailsMapping",
    outputs: [
      {
        internalType: "uint256",
        name: "startingTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "usdPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minimumUSDPurchase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maximumPresaleAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "presalePaymentTokenMapping",
    outputs: [
      {
        internalType: "bool",
        name: "available",
        type: "bool",
      },
      {
        internalType: "address",
        name: "aggregatorAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "presaleReceiver",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "totalPresaleRound",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
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
  {
    inputs: [],
    name: "getTotalPresaleRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_presaleRound",
        type: "uint256",
      },
    ],
    name: "getPresaleAmountByRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getTotalPresaleAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getCurrentPresaleRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getCurrentPresaleDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_paymentTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "presaleTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_newPresaleReceiver",
        type: "address",
      },
    ],
    name: "setPresaleReceiver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newTokenAddress",
        type: "address",
      },
    ],
    name: "setPresaleTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_tokenAvailability",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_aggregatorAddress",
        type: "address",
      },
    ],
    name: "setPresalePaymentToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_presaleRound",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startingTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_usdPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minimumUSDPurchase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maximumPresaleAmount",
        type: "uint256",
      },
    ],
    name: "setPresaleRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
