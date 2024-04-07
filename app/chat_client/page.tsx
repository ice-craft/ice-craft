"use client";

import React, { useEffect, useState } from "react";
import { socket } from "@/app/_utils/socket/socket";

const ChatClient = () => {
  const [eventName, setEventName] = useState("");
  const [message, setMessage] = useState("");
  const [display, setDisplay] = useState("");

  const sendHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };

  useEffect(() => {}, []);

  socket.on("connect", () => {
    setDisplay((prev) => `${prev}\n서버와 연결 됨`);
  });

  socket.on("disconnect", () => {
    setDisplay((prev) => `${prev}\n서버와 연결 끊김`);
  });

  return (
    <>
      <textarea
        value={display}
        onChange={(e) => setDisplay(e.target.value)}
        id="message"
        className="w-2/3 border-2 border-black border-solid h-3/3"
      ></textarea>
      <form id="form" action="">
        <input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          id="input"
          autoComplete="off"
          className="border-2 border-black border-solid"
        />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="input"
          autoComplete="off"
          maxLength={100}
          className="border-2 border-black border-solid"
        />
        <button className="border-2 border-black border-solid" onClick={(e) => sendHandler(e)}>
          보내기
        </button>
      </form>
    </>
  );
};

export default ChatClient;