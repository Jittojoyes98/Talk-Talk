import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";

export default function HomePage() {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(userInfo);
    if (userInfo !== null) {
      history.push("/chats");
    }
  }, [history]);
  return (
    <Container maxW="xl" mt="5" centerContent>
      <Box
        d="flex"
        bg={"white"}
        p={3}
        w="100%"
        borderRadius="lg"
        textAlign="center"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily={"Work sans"}>
          Talk-Talk
        </Text>
      </Box>
      <Box
        mt="2"
        bg={"white"}
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}
