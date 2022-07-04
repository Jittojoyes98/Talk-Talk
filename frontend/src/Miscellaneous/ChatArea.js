import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ChatContext } from "../Context/ChatProvider";
import MessageArea from "../Extra/MessageArea";

export default function ChatArea({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = useContext(ChatContext);
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      w={{ base: "100%", md: "68%" }}
    >
      <MessageArea fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}
