import { useState, useEffect, useMemo } from "react";
import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { ContractAddress } from "constants/contract";
import { Greeter, Greeter__factory } from "types/ethers-contracts";
import { useWeb3React } from "@web3-react/core";

function useContract(abi: Interface, address: string): Contract | null {
  const { library, account } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) {
      return null;
    }

    if (address === AddressZero) {
      return null;
    }

    if (!isAddress(address)) {
      throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    const provider = account
      ? library.getSigner(account).connectUnchecked()
      : library;

    return new Contract(address, abi, provider as any);
  }, [address, abi, library, account]);
}

function useContractAddress(contractName: string): string {
  const { library } = useWeb3React();
  const [address, setAddress] = useState(AddressZero);

  useEffect(() => {
    if (!library) {
      return;
    }
    console.log("address", library);

    library.getNetwork().then((network: any) => {
      setAddress(
        (ContractAddress as any)[network.chainId][contractName] || AddressZero
      );
    });
  }, [contractName, library]);

  return address;
}

export function useGreeterContract(): Greeter | null {
  return useContract(
    Greeter__factory.createInterface(),
    useContractAddress("Greeter")
  ) as Greeter;
}
