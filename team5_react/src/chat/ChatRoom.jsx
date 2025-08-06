
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { GlobalContext } from "../components/GlobalContext";
import RequestModal from "./components/RequestModal";
import { getIP } from '../components/Tool';

const SOCKET_URL = `${getIP()}/ws-chat`;

export default function ChatRoom({ chatRoomno: propChatRoomno }) {
  const { chatRoomno: paramChatRoomno } = useParams();
  const chatRoomno = propChatRoomno || paramChatRoomno;
  const { loginUser } = useContext(GlobalContext);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef(null);
  const scrollRef = useRef(null);
  const [talentTitle, setTalentTitle] = useState("");
  const [pendingRequest, setPendingRequest] = useState(null);
  const [members, setMembers] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [isPublicRoom, setIsPublicRoom] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [receiverno, setReceiverno] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [talentPrice, setTalentPrice] = useState(null);

  useEffect(() => {
    const url = `${getIP()}/chatroom/${chatRoomno}?loginUserno=${loginUser.userno}`;
    axios.get(url, { withCredentials: true })
      .then(res => {
        const data = res.data;
        setIsPublicRoom(data.publicRoom);
        if (data.publicRoom) {
          setRoomName(data.roomName);
          setMembers(data.members || []);
        } else {
          setTalentTitle(data.title);
          setTalentPrice(data.price);
          setReceiverName(data.receiverName);
          setReceiverno(data.receiverno);
        }
      })
      .catch(console.error);
  }, [chatRoomno]);

  useEffect(() => {
    if (!chatRoomno || !loginUser?.userno) return;
    const socket = new SockJS(SOCKET_URL);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        stompClient.current.subscribe(`${getIP()}/topic/chatroom/${chatRoomno}`, msg => {
          const message = JSON.parse(msg.body);
          if (message?.type === "REQUEST" && message?.status === "pending") {
            if (Number(message.receiverno) === Number(loginUser.userno)) {
              setPendingRequest(message);
            }
          } else if (message?.type === "SYSTEM") {
            setMessages(prev => [...prev, {
              userName: message.userName,
              content: message.content,
              senderno: null,
              type: "SYSTEM"
            }]);
          } else {
            setMessages(prev => [...prev, message]);
          }
        });
      },
    });
    stompClient.current.activate();

    axios.get(`${getIP()}/message/chatroom/${chatRoomno}`, { withCredentials: true })
      .then(res => setMessages(res.data))
      .catch(console.error);

    return () => {
      stompClient.current?.deactivate();
    };
  }, [chatRoomno, loginUser?.userno]);

  useEffect(() => {
    axios.get(`${getIP()}/request/chatroom/${chatRoomno}`, { withCredentials: true })
      .then(res => {
        if (res.status === 204) return;
        const req = res.data;
        if (req?.status === "pending") {
          setPendingRequest(req);
        }
      })
      .catch(console.warn);
  }, [chatRoomno, loginUser?.userno]);

  useEffect(() => {
    axios.get(`${getIP()}/chatmember/chatroom/${chatRoomno}/members`, { withCredentials: true })
      .then(res => setMembers(res.data))
      .catch(console.error);
  }, [chatRoomno]);

  const handleAccept = async () => {
    try {
      await axios.patch(`${getIP()}/request/${pendingRequest.requestno}/accept`, null, {
        withCredentials: true
      });
      alert("요청을 수락했습니다!");
      setPendingRequest(null);
    } catch (err) {
      alert("요청 수락 실패");
    }
  };

  const handleReject = async () => {
    try {
      await axios.patch(`${getIP()}/request/${pendingRequest.requestno}/reject`, null, {
        withCredentials: true
      });
      alert("요청을 거절했습니다.");
      setPendingRequest(null);
    } catch (err) {
      alert("요청 거절 실패");
    }
  };

  const openRequestModal = () => {
    if (talentPrice == null) {
      alert("가격 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    setShowRequestModal(true);
  };

  const submitRequest = async ({ message, price }) => {
    try {
      const res = await axios.get(`${getIP()}/chatroom/${chatRoomno}?loginUserno=${loginUser.userno}`, { withCredentials: true });
      const room = res.data;
      if (!room.talentno) return alert("요청 가능한 게시물이 없습니다.");

      const dto = {
        talentno: room.talentno,
        giverno: loginUser.userno,
        receiverno: room.receiverno,
        message,
        price,
        chatRoomno: chatRoomno,
      };

      await axios.post(`${getIP()}/request/save`, dto, {
        withCredentials: true
      });

      // ✅ 요청 메시지를 로컬에도 즉시 추가
      setMessages(prev => [
        ...prev,
        {
          chatRoomno,
          senderno: loginUser.userno,
          userName: loginUser.username,
          content: message,
          type: "REQUEST",
          price,
          receiverno: room.receiverno,
        }
      ]);

      alert("요청이 전송되었습니다!");
      setShowRequestModal(false);
    } catch (error) {
      alert("요청 전송 실패");
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      chatRoomno: Number(chatRoomno),
      senderno: loginUser.userno,
      userName: loginUser.username,
      content: input,
    };

    stompClient.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message),
    });

    setMessages(prev => [...prev, message]);
    setInput("");
  };

  return (
    <div className="max-w-md mx-auto flex flex-col max-h-[800px] border shadow-lg rounded-lg">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold">
          💬 {isPublicRoom ? roomName : `${receiverName}님과의 채팅`}
        </div>

        {isPublicRoom && (
          <div className="flex flex-col ml-4">
            <div className="text-sm text-white mb-1">👥 참여 인원: {members.length}명</div>
            <div className="flex items-center gap-2 max-w-[300px] overflow-hidden">
              {members.slice(0, 2).map(member => (
                <div key={member.userno} className="bg-white text-blue-600 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
                  👤 {member.username}
                </div>
              ))}
              {members.length > 2 && (
                <button onClick={() => setShowAllMembers(true)} className="bg-white text-blue-600 rounded-full px-3 py-1 text-xs font-semibold">
                  +{members.length - 2}명
                </button>
              )}
            </div>
          </div>
        )}

        {!isPublicRoom && receiverName && loginUser.userno !== receiverno && (
          <button onClick={openRequestModal} className="ml-auto text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
            요청하기
          </button>
        )}
      </div>

      {/* 게시물 제목 */}
      {talentTitle && (
        <div className="px-4 py-1 text-sm text-gray-600 bg-blue-50 border-b">
          📌 게시물: <span className="font-semibold">{talentTitle}</span>
        </div>
      )}

      {/* 메시지 영역 */}
      <div ref={scrollRef} className="overflow-y-auto bg-gray-50 p-4 h-[560px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            아직 메시지가 없습니다. 대화를 시작해보세요!
          </div>
        ) : (
          messages.map((msg, idx) => {
            if (msg.type === "SYSTEM") {
              return (
                <div key={idx} className="text-center text-xs text-gray-500 my-2">
                  📢 {msg.content}
                </div>
              );
            } else if (msg.type === "REQUEST") {
              return (
                <div key={idx} className={`flex ${msg.senderno === loginUser.userno ? "justify-end" : "justify-start"} mb-2`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg border bg-yellow-100 text-gray-800`}>
                    <div className="text-sm font-semibold">{msg.userName}님의 요청</div>
                    <div className="mt-1">{msg.content}</div>
                    <div className="mt-1 text-sm text-gray-700">💰 {msg.price?.toLocaleString()}원</div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={idx} className={`flex ${msg.senderno === loginUser?.userno ? "justify-end" : "justify-start"} mb-2`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderno === loginUser?.userno ? "bg-blue-500 text-white" : "bg-white border"}`}>
                    <span className="block text-sm font-semibold">{msg.userName}</span>
                    <span>{msg.content}</span>
                  </div>
                </div>
              );
            }
          })
        )}
      </div>

      {/* 입력창 */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          전송
        </button>
      </div>

      {/* 요청 수락/거절 알림 */}
      {pendingRequest && pendingRequest.receiverno === loginUser.userno && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative my-2 mx-4">
          <strong className="font-bold">📩 요청 알림: </strong>
          <div className="mt-1">
            <span className="block sm:inline">{pendingRequest.message}</span>
            {pendingRequest.price != null && (
              <span className="block sm:inline ml-1 text-sm font-semibold text-gray-800">
                💰 {pendingRequest.price.toLocaleString()}원
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={handleAccept} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              수락
            </button>
            <button onClick={handleReject} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              거절
            </button>
          </div>
        </div>
      )}

      {/* 전체 멤버 목록 모달 */}
      {showAllMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-800">전체 참여자 목록</h2>
              <button onClick={() => setShowAllMembers(false)} className="text-gray-500 hover:text-red-500 text-xl font-bold">
                ×
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {members.map(member => (
                <div key={member.userno} className="text-sm text-gray-800 border-b py-1 px-1">
                  👤 {member.username}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 요청 모달 */}
      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={submitRequest}
        defaultMessage={`${talentTitle} 요청을 보냅니다.`}
        defaultPrice={talentPrice}
      />
    </div>
  );
}
