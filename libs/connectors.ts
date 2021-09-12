import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { ChainConfig } from "constants/chain";

const { defaultChainId, supportedChainIds, networkRpcUrls } = ChainConfig;

export const injected = new InjectedConnector({
  supportedChainIds,
});

export const network = new NetworkConnector({
  urls: networkRpcUrls,
  defaultChainId,
});

export const walletConnect = new WalletConnectConnector({
  supportedChainIds,
  rpc: networkRpcUrls,
  qrcode: true,
});

export const walletLink = new WalletLinkConnector({
  url: networkRpcUrls[defaultChainId],
  appName: "Template Starter",
  appLogoUrl: "",
});

export const switchInjectedNetwork = async (
  chainId: number = defaultChainId
): Promise<boolean> => {
  const { ethereum } = window as any;
  if (!ethereum) {
    return false;
  }

  const switchToChainId = `0x${chainId.toString(16)}`;
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: switchToChainId }],
    });
    return true;
  } catch (err: any) {
    if (err.code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: switchToChainId,
            rpcUrl: networkRpcUrls[chainId],
          },
        ],
      });
      return true;
    }
  }
  return false;
};
