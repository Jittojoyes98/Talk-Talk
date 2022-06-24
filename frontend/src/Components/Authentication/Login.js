import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const toast = useToast();
  const submitHandler = async () => {
    setLoad(true);
    if (!password || !email) {
      toast({
        title: "Please enter all fields",
        description: "All the fields are not entered",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }

    try {
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };

      const result = await axios.post(
        "api/user/login",
        { email, password },
        config
      );
      console.log(result);
      setLoad(false);
    } catch (error) {
      toast({
        title: "Invalid credentials",
        description: "Please check the email and password and try again",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
    }
  };
  const submitGuest = () => {};
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="Enter your Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="password">Password</FormLabel>
        <InputGroup>
          <Input
            id="password"
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        variant="solid"
        colorScheme={"teal"}
        minW="100%"
        onClick={submitHandler}
        style={{ marginTop: "20px" }}
        isLoading={load}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme={"red"}
        minW="100%"
        onClick={submitGuest}
        style={{ marginTop: "10px" }}
      >
        Login as Guest
      </Button>
    </VStack>
  );
}
