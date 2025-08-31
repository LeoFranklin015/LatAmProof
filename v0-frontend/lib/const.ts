export const registry = {
  ARG: "0xe42cfac25e82e3b77fefc740a934e11f03957c17",
  BRA: "0x86dd241529ae8e05c7426789ec87e65903b95eab",
  MEX: "0xe42cfac25e82e3b77fefc740a934e11f03957c17",
  CHL: "0x86dd241529ae8e05c7426789ec87e65903b95eab",
};

export const available = [
  {
    inputs: [
      {
        internalType: "string",
        name: "label",
        type: "string",
      },
      {
        internalType: "address",
        name: "_registry",
        type: "address",
      },
    ],
    name: "available",
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
];

export const SelfRegistrar = "0xfcc8577f0e41ea33952be8ff71390edb61c03d00";
