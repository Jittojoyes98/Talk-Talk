import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [chat, setChat] = useState([]);
  const [notification, setNotification] = useState([]);
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chat,
        setChat,
        user,
        setUser,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// export const chatState=()=>{
//     return useContext(ChatContext)
// }
export default ChatProvider;
