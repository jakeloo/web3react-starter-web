import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Image,
  Flex,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { AbstractConnector } from "@web3-react/abstract-connector";
import {
  injected,
  walletConnect,
  walletLink,
  switchInjectedNetwork,
} from "libs/connectors";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ChainNames, ChainConfig } from "constants/chain";
import { useWeb3React } from "@web3-react/core";

const { supportedChainIds, defaultChainId } = ChainConfig;

interface ConnectorInfo {
  connector?: AbstractConnector;
  name: string;
  description?: string;
  iconUrl: string;
}

const Options: ConnectorInfo[] = [
  {
    connector: injected,
    name: "MetaMask",
    description: "Easy-to-use browser extension",
    iconUrl: "https://app.uniswap.org/static/media/metamask.02e3ec27.png",
  },
  {
    connector: walletConnect,
    name: "WalletConnect",
    description: "Connect to Trust Wallet, Rainbow Wallet and more",
    iconUrl:
      "https://app.uniswap.org/static/media/walletConnectIcon.304e3277.svg",
  },
  {
    connector: walletLink,
    name: "Coinbase Wallet",
    description: "Use Coinbase Wallet app on mobile device",
    iconUrl:
      "https://app.uniswap.org/static/media/coinbaseWalletIcon.a3a7d7fd.svg",
  },
];

interface WalletConnectorInfoProps {
  connector: ConnectorInfo;
}

function WalletConnectorInfo({
  connector,
}: WalletConnectorInfoProps): JSX.Element {
  return (
    <>
      <Image src={connector.iconUrl} maxHeight="24px" />
      <Box marginLeft={2}>
        <Text fontSize="sm" fontWeight="500">
          {connector.name}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {connector.description}
        </Text>
      </Box>
    </>
  );
}

interface WalletConnectorPendingProps {
  connector: ConnectorInfo;
}

function WalletConnectorPending({
  connector,
}: WalletConnectorPendingProps): JSX.Element {
  return (
    <Box>
      <Flex
        width="100%"
        border="1px"
        borderColor={"gray.200"}
        borderRadius="md"
        paddingY={4}
        paddingX={2}
        marginY={4}
        textAlign="left"
        alignItems="center"
      >
        <Spinner marginRight={2} />
        <Box>
          <Text>Connecting</Text>
          <Text fontSize="xs">Follow your wallet instruction to connect.</Text>
        </Box>
      </Flex>

      <Flex
        width="100%"
        border="1px"
        borderRadius="md"
        padding={2}
        textAlign="left"
        alignItems="center"
      >
        <WalletConnectorInfo connector={connector} />
      </Flex>
    </Box>
  );
}

interface WalletConnectorErrorProps {
  connectorInfo: ConnectorInfo;
  error: Error;
  handleNetworkSwitch?: (info: ConnectorInfo) => Promise<void>;
}

function WalletConnectorError({
  connectorInfo,
  error,
  handleNetworkSwitch,
}: WalletConnectorErrorProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  async function networkSwitch(): Promise<void> {
    setLoading(true);
    if (handleNetworkSwitch) {
      await handleNetworkSwitch(connectorInfo);
    }
    setLoading(false);
  }

  return (
    <Box>
      {error.message === "unsupported_network" ? (
        <Flex
          width="100%"
          border="1px"
          borderColor={"red.300"}
          borderRadius="md"
          paddingY={4}
          paddingX={2}
          marginY={4}
          textAlign="left"
          alignItems="center"
        >
          <Box width="100%">
            <Text fontWeight="bold">
              Switch to {ChainNames[defaultChainId]}
            </Text>
            <Text fontSize="xs" marginY={2}>
              The application doesn&apos;t support your connected network :(
            </Text>
            <Button onClick={networkSwitch}>
              {loading ? <Spinner /> : "Switch network"}
            </Button>
          </Box>
        </Flex>
      ) : (
        <Flex
          width="100%"
          border="1px"
          borderColor={"red.300"}
          borderRadius="md"
          paddingY={4}
          paddingX={2}
          marginY={4}
          textAlign="left"
          alignItems="center"
        >
          <Box width="100%">
            <Text>Error</Text>
            <Text fontSize="xs">{error.message}</Text>
          </Box>
        </Flex>
      )}

      <Flex
        width="100%"
        border="1px"
        borderRadius="md"
        padding={2}
        textAlign="left"
        alignItems="center"
      >
        <WalletConnectorInfo connector={connectorInfo} />
      </Flex>
    </Box>
  );
}

interface WalletConnectorListProps {
  onConnect?: () => void;
}

export const ConnectWalletList: React.FC<WalletConnectorListProps> = ({
  onConnect,
}) => {
  const { activate } = useWeb3React();
  const [connecting, setConnecting] = useState<ConnectorInfo | null>(null);
  const [error, setError] = useState<any>(null);

  const handleNetworkSwitch = async (info: ConnectorInfo) => {
    if (info.connector && info.connector instanceof InjectedConnector) {
      try {
        await switchInjectedNetwork();
        await activate(info.connector, () => {}, true);
        if (onConnect) {
          onConnect();
        }
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  const handleWalletConnect = async (info: ConnectorInfo) => {
    setConnecting(info);

    if (info.connector) {
      try {
        setError(null);
        await activate(info.connector, () => {}, true);
        setConnecting(null);
        if (onConnect) {
          onConnect();
        }
      } catch (e) {
        console.error(e);

        if (info.connector instanceof InjectedConnector) {
          const authorized = await info.connector.isAuthorized();
          const id: number = parseInt(
            (await info.connector.getChainId()).toString()
          );
          if (authorized && !supportedChainIds.includes(id)) {
            setError(new Error("unsupported_network"));
          } else {
            setError(e);
          }
        } else {
          setError(e);
        }
      }
    }
  };

  return (
    <>
      {connecting ? (
        <Box>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="link"
            size="xs"
            width=""
            colorScheme="black"
            onClick={() => setConnecting(null)}
          >
            Back
          </Button>

          {error ? (
            <WalletConnectorError
              connectorInfo={connecting}
              error={error}
              handleNetworkSwitch={handleNetworkSwitch}
            />
          ) : (
            <WalletConnectorPending connector={connecting} />
          )}
        </Box>
      ) : (
        <VStack>
          {Options.map((opt) => (
            <Flex
              as="button"
              key={opt.name}
              border="1px"
              borderRadius="md"
              padding={2}
              width="100%"
              textAlign="left"
              alignItems="center"
              _hover={{ background: "rgba(0, 0, 0, 0.2)" }}
              onClick={() => handleWalletConnect(opt)}
            >
              <WalletConnectorInfo connector={opt} />
            </Flex>
          ))}
        </VStack>
      )}
    </>
  );
};
