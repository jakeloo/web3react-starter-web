import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useGreeterContract } from "hooks/useContract";

export const Greeter: React.FC = () => {
  const [greet, setGreet] = useState<string>("");
  const greeter = useGreeterContract();

  useEffect(() => {
    greeter?.greet().then((greeting: string) => setGreet(greeting));
  }, [greeter]);

  return (
    <>
      <Box marginY={2}>
        <Text>Greet Contract: {greeter?.address}</Text>
        <Text>Greet: {greet}</Text>
      </Box>
    </>
  );
};
