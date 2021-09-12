/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { Greeter, GreeterInterface } from "../Greeter";

const _abi = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      {
        name: "_greeting",
        type: "string",
      },
    ],
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "greet",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    gas: 12690,
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    name: "setGreeting",
    inputs: [
      {
        name: "_greeting",
        type: "string",
      },
    ],
    outputs: [],
    gas: 108314,
  },
];

export class Greeter__factory {
  static readonly abi = _abi;
  static createInterface(): GreeterInterface {
    return new utils.Interface(_abi) as GreeterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Greeter {
    return new Contract(address, _abi, signerOrProvider) as Greeter;
  }
}
