// src/chat/OpenChatListPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext';
import { useNavigate } from 'react-router-dom';

const OpenChatListPage = () => {
  const [publicRooms, setPublicRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loginUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleEnterRoom = async (roomId, hasPassword) => {
    if (!loginUser?.userno) {
      alert("로그인이 필요합니다.");
      return;
    }

    let password = null;
    if (hasPassword) {
      password = prompt("비밀번호를 입력하세요:");
      if (password === null) return; // 입력 취소 시 중단
    }

    try {
      await axios.post(
        `/chatroom/${roomId}/enter/${loginUser.userno}`,
        null,
        { params: { password } }
      );
      navigate(`/chat/${roomId}`, { state: { isOpenRoom: true } });
    } catch (err) {
      if (err.response?.status === 403) {
        alert("비밀번호가 틀렸습니다.");
      } else {
        alert("채팅방 입장 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    axios.get('/chatroom/public')
      .then(res => setPublicRooms(res.data))
      .catch(err => {
        console.error('공개 채팅방 목록 불러오기 실패:', err);
        setPublicRooms([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 min-h-[700px] bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">공개 채팅방</h1>

        {loading ? (
          <div className="text-gray-600">로딩 중...</div>
        ) : publicRooms.length === 0 ? (
          <div className="text-gray-600">등록된 공개 채팅방이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicRooms.map(room => (
              <div key={room.chatRoomno}
                   className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 relative">
                <h2 className="text-lg font-semibold text-gray-800">{room.roomName}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  생성일: {new Date(room.createdAt).toLocaleString()}
                </p>
                {room.creatorName && (
                  <p className="text-sm text-blue-500 mt-1">개설자: {room.creatorName}</p>
                )}
                {room.hasPassword && (
                  <p className="text-sm text-red-500 mt-2">🔒 비밀번호 있음</p>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleEnterRoom(room.chatRoomno, room.hasPassword)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                  >
                    입장하기
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

export default OpenChatListPage;
