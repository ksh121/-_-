import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const SOCKET_URL = "http://192.168.12.141:9093/ws-chat";
const SESSION_API = "http://192.168.12.141:9093/user/session";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null); // 로그인된 유저 정보 저장
  const stompClient = useRef(null);

  useEffect(() => {
    // 세션에서 로그인 유저 정보 받아오기
    axios.get(SESSION_API, { withCredentials: true })
      .then(res => {
        if (res.data.sw) {
          setUser({
            userno: res.data.userno,
            username: res.data.username,
          });
        } else {
          alert("로그인 필요");
        }
      });

    // WebSocket 연결
    const socket = new SockJS(SOCKET_URL);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("웹소켓 연결됨");

        stompClient.current.subscribe("/topic/public", (msg) => {
          const message = JSON.parse(msg.body);
          setMessages(prev => [...prev, message]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP 오류", frame);
      }
    });
    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !user) return;

    const message = {
      chatRoomno: 21,             // 임시 채팅방 번호 (테스트용)
      senderno: user.userno,      // 로그인 유저 번호
      content: input
    };

    stompClient.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message)
    });

    setInput("");
  };

  return (
    <div>
      <h3>채팅방 (User: {user?.username})</h3>
      <div style={{ height: 300, overflowY: "auto", border: "1px solid black", marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.senderno}</b>: {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="메시지 입력"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatRoom;
