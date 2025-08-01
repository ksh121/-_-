import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import CreateRoomModal from './CreateRoomModal';
import ChatProfileCard from '../user/profile/ChatProfileCard';

const ChatLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      {/* 왼쪽 사이드바 */}
      <div className="w-64 h-[55vh] bg-white rounded-xl shadow-md p-4 flex flex-col justify-between">

        {/* 상단: 카테고리 + 프로필 */}
        <div>
          <h2 className="text-lg font-bold mb-4">채팅 카테고리</h2>
          <ul className="space-y-2 text-m mb-6">
            <li>
              <NavLink to="/chat/my" className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:underline'}>
                내 채팅방
              </NavLink>
            </li>
            <li>
              <NavLink to="/chat/public" className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:underline'}>
                공개 채팅방
              </NavLink>
            </li>
          </ul>

          
        </div>

        {/* 하단: 채팅방 만들기 */}
        <div className="mt-6">
          <div className="mb-18">
          {/* ✅ 여기에 프로필 삽입 */}
          <ChatProfileCard />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600"
          >
            + 채팅방 만들기
          </button>
        </div>

        <CreateRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={() => {}}
        />
      </div>

      {/* 오른쪽 내용 */}
      <div className="flex-1 bg-gray-50 rounded-xl shadow-sm p-6 min-h-[400px] max-h-[80vh] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
