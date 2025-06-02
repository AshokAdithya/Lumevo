import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import styled, { createGlobalStyle } from "styled-components";
import useAuth from "../hooks/TokenManagement";
import axios from "axios";
import { api } from "../utils/useAxiosInstance";

const server = process.env.REACT_APP_API_SERVER;
const socket = io(server);

const Heading = styled.div`
  border-bottom: 2px solid var(--color-two);
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 16px;
    color: var(--color-three);
    margin: 0px 10px;
  }

  span {
    cursor: pointer;
    margin: 0px 10px;
    font-size: 25px;
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: 400px;
  background-color: var(--color-one);
  border: 2px solid var(--color-two);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  display: ${({ show }) => (show ? "flex" : "none")};
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 10px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  display: flex;
  border-top: 1px solid var(--color-two);
`;

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 10px;
  outline: none;
`;

const Message = styled.h1`
  max-width: 70%;
  padding: 7px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 400;
  background-color: ${({ isSelf }) =>
    isSelf ? "var(--color-three)" : "var(--color-four)"};
  color: ${({ isSelf }) => (isSelf ? "white" : "black")};
  align-self: ${({ isSelf }) => (isSelf ? "flex-end" : "flex-start")};
  word-wrap: break-word;
  text-align: ${({ isSelf }) => (isSelf ? "right" : "left")};
`;

const SendButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: var(--color-three);
  color: var(--color-one);
  cursor: pointer;

  &:hover {
    background-color: var(--color-four);
  }
`;

function Chat({ show, onClose, name, id }) {
  const { loading, user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (message.trim()) {
      const roomId = id;

      let data = {
        roomId: roomId,
        userId: user.id,
        message: message,
      };

      socket.emit("send_message", { roomId, userId: user.id, message });
      setMessages((prevMessages) => [...prevMessages, data]);
      setMessage("");
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await api.get(`/chats/${id}`);

        if (response.data) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();

    const roomId = id;
    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, show]);

  return (
    <ChatContainer show={show}>
      <Heading>
        <h1>{name}</h1>
        <span onClick={onClose}>&times;</span>
      </Heading>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} isSelf={msg.userId === user.id}>
            {msg.message}
          </Message>
        ))}
        <div ref={messagesEndRef} /> {/* Empty div for scrolling */}
      </MessagesContainer>
      <InputContainer>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default Chat;
