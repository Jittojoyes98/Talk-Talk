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

export default function SignUp({ setIndex, index }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [load, setLoad] = useState(false);
  const toast = useToast();

  const submitHandler = async () => {
    setLoad(true);
    if (!name || !password || !email || !confirmpassword) {
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
    if (password !== confirmpassword) {
      toast({
        title: "Confirm password doesn't match",
        description: "Please make sure your password matches",
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

      const { data } = await axios.post(
        "https://talk-talk-api.onrender.com/api/user",
        { name, email, password, pic },
        config
      );
      console.log(data);
      setLoad(false);
      toast({
        title: "Registration successful",
        description: "",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIndex(0);
      console.log(index);
    } catch (error) {
      const { message } = error.response.data;
      toast({
        title: "Server error",
        description: message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
      setLoad(false);
    }
  };
  const uploadPic = (pic) => {
    setLoad(true);
    if (pic === undefined) {
      toast({
        title: "Please select an image",
        description: "You have to select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }
    // console.log(pic.type);
    if (pic.type === "image/png" || pic.type === "image/jpeg") {
      const formData = new FormData();
      formData.append("file", pic);
      formData.append("upload_preset", "talk-talk");
      fetch("https://api.cloudinary.com/v1_1/ddckdkjol/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.secure_url);
          // console.log(data.secure_url);
          setLoad(false);
          toast({
            title: "Upload successful",
            description: "Image added successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((err) => {
          console.log(err);
          setLoad(false);
          toast({
            title: "Uploading failed",
            description: "Please check the internet connection",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    } else {
      toast({
        title: "Not an Image ",
        description: "Please select the right type of file",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          id="name"
          type="name"
          placeholder="Enter your Name"
          required
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
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
      <FormControl isRequired>
        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
        <InputGroup>
          <Input
            id="confirmPassword"
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="confirmPassword">Upload your Picture</FormLabel>
        <Input
          id="picture"
          type="file"
          placeholder="Confirm Password"
          accept="images/*"
          p={1}
          onChange={(e) => uploadPic(e.target.files[0])}
        />
      </FormControl>
      <Button
        variant="solid"
        colorScheme={"teal"}
        minW="100%"
        onClick={submitHandler}
        style={{ marginTop: "20px" }}
        isLoading={load}
      >
        SignUp
      </Button>
    </VStack>
  );
}
