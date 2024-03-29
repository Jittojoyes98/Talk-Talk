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
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const toast = useToast();
  const history = useHistory();
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
        "https://talk-talk-api.onrender.com/api/user/login",
        { email, password },
        config
      );
      const { data } = result;
      // console.log(data);
      setLoad(false);
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/chats");
      toast({
        title: "Login successful",
        description: "",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
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
  const submitGuest = () => {
    setIsGuest(true);
    if (!email || !password) {
      setEmail("guest123@gmail.com");
      setPassword("Guest@123");
    }
  };

  useEffect(() => {
    if (isGuest && email && password) {
      submitHandler();
      setIsGuest(false);
    }
  }, [isGuest, email, password]);
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="Enter your Email"
          required
          value={email}
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
            value={password}
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
