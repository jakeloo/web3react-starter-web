import React, { useRef } from "react";
import {
  Button,
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";

import { Wallet } from "components/Wallet";
import { Greeter } from "components/Greeter";
import { ConnectWalletButton } from "components/connect/ConnectWalletButton";

const HomePage: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { account } = useWeb3React();

  return (
    <Container minH="100vh" display="flex">
      <Flex flexDir="column" margin="auto">
        <Heading mb={8}>dApp Starter Template</Heading>

        <FormControl display="flex" align="center" mb={4}>
          <FormLabel htmlFor="darkMode" mb="0">
            Dark Mode
          </FormLabel>
          <Switch
            isChecked={colorMode === "dark"}
            onChange={() => toggleColorMode()}
            id="darkMode"
          />
        </FormControl>

        {account ? (
          <>
            <Wallet />
          </>
        ) : (
          <></>
        )}

        <Flex mt={4}>
          <ConnectWalletButton />
        </Flex>

        <Box>
          <Greeter />
        </Box>
      </Flex>
    </Container>
  );
};

export default HomePage;
