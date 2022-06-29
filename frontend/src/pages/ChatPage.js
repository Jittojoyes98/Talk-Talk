import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ChatContext } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Miscellaneous/SideDrawer";
import MyChat from "../Miscellaneous/MyChat";
import ChatArea from "../Miscellaneous/ChatArea";
import { useHistory } from "react-router-dom";

export default function ChatPage() {
  // console.log(user);
  const [user, setUser] = useState();
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userInfo);
    setUser(userInfo);
    if (userInfo === null) {
      history.push("/");
    }
  }, [history]);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer user={user} />}
      <Box display="flex" justifyContent="space-around" h="91vh">
        {user && <MyChat user={user} />}
        {user && <ChatArea user={user} />}
      </Box>
    </div>
  );
}
