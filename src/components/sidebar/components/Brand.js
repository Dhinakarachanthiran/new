import React from "react";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
// import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode for text color
  const textColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align="center" direction="column">
      {/* Replace logo with "Time Tracker" text */}
      <Text fontSize="35" fontWeight="bold" color={textColor} my="32px">
        Time Tracker
      </Text>
      {/* <HSeparator mb="20px" /> */}
    </Flex>
  );
}

export default SidebarBrand;
