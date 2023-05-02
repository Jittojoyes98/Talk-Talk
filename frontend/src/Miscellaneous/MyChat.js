import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import { ChatContext } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";

export default function MyChat({ fetchAgain }) {
  const { setSelectedChat, selectedChat, chat, setChat, user } =
    useContext(ChatContext);
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  
  const fetchChat = async () => {
    console.log(user);
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("https://talk-talk-api.onrender.com/api/chat", config);
      setChat(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to load the chat try again",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("userInfo")),"PARSED DATA");
    const userInfo=JSON.parse(localStorage.getItem("userInfo"))
    setLoggedUser(userInfo);
    fetchChat();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      m={0}
      bg="white"
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        fontFamily="Work sans"
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chat ? (
          <Stack overflowY="scroll">
            {chat.map((singlechat) => (
              <Box
                onClick={() => setSelectedChat(singlechat)}
                bg={selectedChat === singlechat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === singlechat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={singlechat._id}
              >
                <Text>
                  {!singlechat.isGroupChat
                    ? getSender(loggedUser, singlechat.users)
                    : singlechat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}
