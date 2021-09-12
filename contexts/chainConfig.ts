import { createContext, useContext } from "react";
import { ChainId } from "constants/chain";

export type NodeUrls = {
  [chainId: number]: string;
};

export type FullChainConfig = {
  supportedChainIds: number[];
  defaultChainId?: ChainId;
  networkRpcUrls?: NodeUrls;
};

export type ChainConfig = Partial<FullChainConfig>;

export const ChainConfigContext = createContext<{
  chainConfig: FullChainConfig;
  updateChainConfig: (config: ChainConfig) => void;
}>({
  chainConfig: {
    supportedChainIds: [
      ChainId.Mainnet,
      ChainId.Rinkeby,
      ChainId.Ropsten,
      ChainId.Polygon,
      ChainId.Mumbai,
    ],
  },
  updateChainConfig: () => undefined,
});

export function useChainConfig(): FullChainConfig {
  const { chainConfig } = useContext(ChainConfigContext);
  return chainConfig;
}

export function useUpdateChainConfig(): (config: ChainConfig) => void {
  const { updateChainConfig } = useContext(ChainConfigContext);
  return updateChainConfig;
}
