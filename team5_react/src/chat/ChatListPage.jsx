import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext';

const ChatListPage = () => {
  const { loginUser } = useContext(GlobalContext);
  const userId = loginUser?.userno;

  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRoomCreated = (newRoom) => {
    setChatRooms((prev) => [...prev, newRoom]);
  };

  const handleDeleteRoom = async (chatRoomno) => {
    if (!window.confirm('정말 이 채팅방을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/chatroom/${chatRoomno}`);
      setChatRooms((prev) => prev.filter((room) => room.chatRoomno !== chatRoomno));
    } catch (err) {
      console.error('채팅방 삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (!userId) return;
    axios.get(`/chatroom/user/${userId}/chatlist`)
      .then(res => setChatRooms(res.data))
      .catch(err => {
        console.error('채팅방 목록 가져오기 실패:', err);
        setChatRooms([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="p-6 min-h-[700px] bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">내 채팅방</h1>
        </div>
        {loading ? (
          <div className="text-gray-600">로딩 중...</div>
        ) : chatRooms.length === 0 ? (
          <div className="text-gray-600">참여 중인 채팅방이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chatRooms.map(room => (
              <div key={room.chatRoomno}
                   className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 relative">
                <h2 className="text-lg font-semibold text-gray-800">{room.roomName || '채팅방'}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  생성일: {new Date(room.createdAt).toLocaleString()}
                </p>
                {room.title && (
                  <p className="text-sm text-blue-500 mt-1">관련 게시물: {room.title}</p>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={`/chat/${room.chatRoomno}`}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                  >
                    입장하기
                  </a>
                  <button
                    onClick={() => handleDeleteRoom(room.chatRoomno)}
                    className="ml-2 text-red-500 text-sm hover:underline"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListPage;
