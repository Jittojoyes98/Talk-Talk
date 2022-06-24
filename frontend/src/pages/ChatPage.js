import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatPage() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const result = await axios.get("/chats");
    setData(result.data);
    console.log(result.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>ChatPage</div>
      <h1>Hello there </h1>
      {data.map((eachData, id) => {
        return <div key={id}>{eachData.chatName}</div>;
      })}
    </>
  );
}
