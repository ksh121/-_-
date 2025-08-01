import React, { useState, useEffect } from 'react';

function UserSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/user/session`, {
      method: 'GET',
      credentials: 'include',  // 세션 쿠키 포함
    })
      .then(res => res.json())
      .then(data => {
        console.log("세션 정보 응답 data:", data);
        if (!data.sw) {
          throw new Error(data.msg || '로그인 상태가 아닙니다.');
        }
        setUser(data.user);   // 여기를 data.user로 변경
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩중...</div>;

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>사용자 세션 정보</h3>
      <p>회원번호: {user?.userno}</p>   {/* 안전하게 optional chaining 사용 */}
      <p>이름: {user?.username}</p>
    </div>
  );
}

export default UserSession;
