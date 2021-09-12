import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { ConnectWalletList } from "components/connect/ConnectWalletList";
import { injected } from "libs/connectors";
import { ChainConfig } from "constants/chain.ts";

interface ConnectorError {
  connector: any;
  error: Error;
}

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestError) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

const Unconnected: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Connect Wallet</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ConnectWalletList />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const Connected: React.FC = () => {
  const { account, deactivate } = useWeb3React();
  return <Button onClick={deactivate}>{account}</Button>;
};

const Connecting: React.FC = () => {
  return <Button>Connecting....</Button>;
};

const WrongNetwork: React.FC = () => {
  return <Button>Wrong Network</Button>;
};

export const ConnectWalletButton: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const { library, account } = useWeb3React();

  useEffect(() => {
    const checkInjectedChain = async () => {
      const isAuthorized = await injected.isAuthorized();
      if (isAuthorized) {
        const injectedChainId = parseInt(
          (await injected.getChainId()).toString()
        );
        if (!ChainConfig.supportedChainIds.includes(injectedChainId)) {
          setWrongNetwork(true);
        } else {
          setWrongNetwork(false);
        }
      }
    };

    checkInjectedChain();
  }, []);

  if (connecting) {
    return <Connecting />;
  }

  if (wrongNetwork) {
    return <WrongNetwork />;
  }

  if (account) {
    return <Connected />;
  }

  return <Unconnected />;
};
