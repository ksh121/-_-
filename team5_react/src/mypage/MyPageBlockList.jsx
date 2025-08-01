import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext';

export default function BlockedUserList({ userno }) {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const { loginUser } = useContext(GlobalContext);

  const fetchBlockedUsers = async () => {
    try {
      const res = await axios.get(`/blocks/list/${loginUser?.userno}`);
      setBlockedUsers(res.data);
    } catch (error) {
      console.error('차단 목록 불러오기 실패', error);
    }
  };

  const handleUnblock = async (blockedUserno) => {
    const confirmUnblock = window.confirm('정말 이 사용자를 차단 해제하시겠습니까?');
    if (confirmUnblock) {
        try {
        await axios.delete(`/blocks/unblock`, {
            params: {
            blockerUserno: loginUser?.userno,
            blockedUserno: blockedUserno,
            },
        });
        // 해제 후 다시 목록 불러오기
        fetchBlockedUsers();
        } catch (error) {
        console.error('차단 해제 실패', error);
        }
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>차단한 사용자 목록</h2>
      {blockedUsers.length === 0 ? (
        <p>차단한 사용자가 없습니다.</p>
      ) : (
        <ul>
          {blockedUsers.map((user) => (
            <li key={user.userno} style={{ marginBottom: '10px' }}>
              <strong>{user.username}</strong> ({user.email})
              <button onClick={() => handleUnblock(user.userno)} style={{ marginLeft: '10px', color: 'red' }}>
                차단 해제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
