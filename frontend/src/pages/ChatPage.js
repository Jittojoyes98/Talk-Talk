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
  const { user, setUser } = useContext(ChatContext);
  const history = useHistory();
  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (userInfo === null) {
      history.push("/");
    }
  }, [history]);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" h="91vh" m={2}>
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <ChatArea fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}
