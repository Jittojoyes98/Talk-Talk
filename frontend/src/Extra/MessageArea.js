import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import animationData from "../animation/animationData.json";
import React, { useContext, useEffect } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatContext } from "../Context/ChatProvider";
import ProfileModal from "../Miscellaneous/ProfileModal";
import UpdateGroupChatModel from "../Miscellaneous/UpdateGroupChatModel";
import { useState } from "react";
import axios from "axios";
import ScrollableMessages from "./ScrollableMessages";
import Lottie from "react-lottie";

import io from "socket.io-client";

var socket, selectedChatCompare;
const ENDPOINT = "http://localhost:5000";

const MessageArea = ({ fetchAgain, setFetchAgain }) => {
  const { user, setSelectedChat, selectedChat, notification, setNotification } =
    useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io.connect(ENDPOINT);
    socket.emit("setup", user);
  }, []);

  const renderMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      socket.emit("join_chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Cannot fetch chat",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    renderMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);
        setMessages([...messages, data]);
        socket.emit("new message", data);
      } catch (error) {
        toast({
          title: "Cannot send the message",
          description: error.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };
  console.log(notification);
  useEffect(() => {
    socket.on("message recieved", (data) => {
      // console.log("The message recieved is " + data);
      if (!selectedChatCompare || selectedChat._id !== data.chat._id) {
        // show notifications
        if (!notification.includes(data)) {
          setNotification([data, ...notification]);
          setFetchAgain(!fetchAgain);
        }
        return;
      }
      setMessages([...messages, data]);
    });
    socket.on("typing", (data) => {
      setIsTyping(true);
    });
    socket.on("stop typing", (data) => {
      setIsTyping(false);
    });
  });

  const typingMessage = async (e) => {
    setNewMessage(e.target.value);
    // typing indicator logic
    // forget the logic of socket
    if (!socket) {
      return;
    }

    socket.emit("typing", selectedChat._id);
    const timeNow = new Date().getTime();
    const timePeriod = 3000;
    setTimeout(() => {
      const timeThen = new Date().getTime();
      if (timeThen - timeNow >= 3000) {
        socket.emit("stop typing", selectedChat._id);
      }
    }, timePeriod);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            overflowY="hidden"
            borderRadius="lg"
            w="100%"
            h="100%"
          >
            {loading ? (
              <>
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  margin="auto"
                  alignSelf="center"
                />
              </>
            ) : (
              <>
                <ScrollableMessages messages={messages} />
              </>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    height={40}
                    style={{ marginLeft: 0, marginBottom: 15 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                placeholder="Enter a message"
                value={newMessage}
                onChange={typingMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontFamily="Work sans" fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default MessageArea;
