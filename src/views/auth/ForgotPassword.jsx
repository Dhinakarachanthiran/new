import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleForgotPassword = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    // Simulate API call for password reset (replace with real logic)
    toast({
      title: "Success",
      description: "A reset link has been sent to your email address.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Box maxW="sm" mx="auto" mt="100px" p="4" borderWidth="1px" borderRadius="lg">
      <FormControl>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button mt="4" w="full" colorScheme="blue" onClick={handleForgotPassword}>
        Reset Password
      </Button>
    </Box>
  );
};

export default ForgotPassword;
