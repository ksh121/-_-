import React, { useState, useContext,  } from 'react';
import axios from 'axios';
import { GlobalContext } from "../components/GlobalContext";

const CreateRoomModal = ({ isOpen, onClose, onCreated }) => {
  const [roomName, setRoomName] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(GlobalContext);
  

  const handleCreate = async () => {
    if (!roomName.trim()) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }

    if (usePassword && !password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        roomName,
        password: usePassword ? password : null,
        publicRoom: true, // 오픈채팅방 생성이므로 true 고정
        creatorId: loginUser?.userno, // 또는 loginUser.userno 등
      };

      const response = await axios.post('/chatroom/open', payload);

      onCreated(response.data);
      onClose();
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      alert('채팅방 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">오픈채팅방 생성</h2>

        <label className="block mb-4">
          <span className="text-sm text-gray-700">채팅방 이름</span>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={usePassword}
            onChange={() => setUsePassword(prev => !prev)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">비밀번호 설정</span>
        </label>

        {usePassword && (
          <label className="block mb-4">
            <span className="text-sm text-gray-700">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </label>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={loading}
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
