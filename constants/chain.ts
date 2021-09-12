export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  BSC = 56,
  Polygon = 137,
  Mumbai = 80001,
  Localhost = 1337,
  Hardhat = 31337,
}

export const ChainNames: Record<number, string> = {
  [ChainId.Mainnet]: "Mainnet",
  [ChainId.Ropsten]: "Ropsten",
  [ChainId.Kovan]: "Kovan",
  [ChainId.Rinkeby]: "Rinkeby",
  [ChainId.Goerli]: "Goerli",
  [ChainId.BSC]: "BSC",
  [ChainId.Polygon]: "Polygon",
  [ChainId.Mumbai]: "Mumbai",
  [ChainId.Localhost]: "Localhost",
  [ChainId.Hardhat]: "Hardhat",
};

// configurable
type IChainConfig = {
  defaultChainId: number;
  supportedChainIds: number[];
  networkRpcUrls: Record<number, string>;
};
export const ChainConfig: IChainConfig = {
  defaultChainId: ChainId.Ropsten,
  supportedChainIds: [ChainId.Ropsten],
  networkRpcUrls: {
    [ChainId.Mainnet]: `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    [ChainId.Ropsten]: `https://eth-ropsten.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    [ChainId.Rinkeby]: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    [ChainId.Polygon]: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    [ChainId.Mumbai]: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  },
};
