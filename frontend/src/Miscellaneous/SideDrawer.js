import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Avatar,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useContext, useRef, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { ChatContext } from "../Context/ChatProvider";
// import User from "../../../backend/models/UserModel";

export default function SideDrawer({ user }) {
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();
  const [searchResult, setSearchResult] = useState([]);
  const { selectedChat, setSelectedChat, chat, setChat, setUser } =
    useContext(ChatContext);
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    setUser(null);
    console.log("Bye...");
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something",
        description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
      console.log(searchResult);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load the search results",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("api/chat", { userId }, config);

      //  if there is an already existing chat, then update it.
      // haven't done this part
      if (!chat.find((c) => c._id === data._id)) setChat([data, ...chat]);
      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
      console.log(data);
    } catch (error) {
      toast({
        title: "Error fetching chat",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        bg="white"
        alignItems="center"
        padding="5px"
        borderWidth="5px"
        justifyContent="space-between"
      >
        <Tooltip placement="bottom" label="Search Users here" m={2} hasArrow>
          <Button
            display="flex"
            justifyContent="space-between"
            onClick={onOpen}
            ref={btnRef}
          >
            <i class="fas fa-search"></i>
            <Text
              p={1}
              fontFamily="Work Sans"
              ml={2}
              display={{ base: "none", md: "flex" }}
            >
              Search User to Chat
            </Text>
          </Button>
        </Tooltip>
        <Text fontFamily="Work Sans" fontSize="4xl">
          Talk-Talk
        </Text>
        <div>
          <Box m={2}>
            <Menu>
              <MenuButton>
                <BellIcon boxSize={7} m={1}></BellIcon>
              </MenuButton>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar name={user.name} src={user.pic} size="sm"></Avatar>
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>Profile</MenuItem>
                </ProfileModal>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Box display="flex" p={1}>
              <Input
                placeholder="search by name or email"
                mr={1}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
