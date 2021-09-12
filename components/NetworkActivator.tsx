import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { injected, network } from "libs/connectors";
import { ChainConfig } from "constants/chain";

export const NetworkActivator: React.FC = () => {
  const { active, error, activate } = useWeb3React();
  const { supportedChainIds } = ChainConfig;

  useEffect(() => {
    const eagerConnect = async () => {
      let activated = false;

      if (await injected.isAuthorized()) {
        const injectedChainId = parseInt(
          (await injected.getChainId()).toString()
        );

        if (supportedChainIds.includes(injectedChainId)) {
          await activate(injected);
          activated = true;
        }
      }

      // if metamask fails we fallback to network connector
      if (!activated) {
        await activate(network);
        activated = true;
      }
    };

    eagerConnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { ethereum } = window as any;

    if (ethereum && ethereum.on && !active && !error) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error("Failed to activate after chain changed", error);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error("Failed to activate after accounts changed", error);
          });
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, activate]);

  return <></>;
};
