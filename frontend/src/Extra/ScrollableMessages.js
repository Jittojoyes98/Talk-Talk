import { Avatar, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  isSameUser,
  isSenderMargin,
  lastMessage,
  sameSender,
} from "../config/ChatLogics";
import { ChatContext } from "../Context/ChatProvider";

const ScrollableMessages = ({ messages }) => {
  const { user } = useContext(ChatContext);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {messages &&
        messages.map((m, i) => (
          <div
            style={{
              display: "flex",
            }}
          >
            {(sameSender(messages, m, i, user) ||
              lastMessage(messages, m, i, user)) && (
              <>
                <Tooltip label={m.sender.name} hasArrow>
                  <Avatar
                    mr={1}
                    mt="7px"
                    name={m.sender.name}
                    src={m.sender.pic}
                    cursor="pointer"
                    size="sm"
                  />
                </Tooltip>
              </>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSenderMargin(messages, m, i, user),
                marginTop: isSameUser(messages, m, i, user) ? 3 : 7,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableMessages;
