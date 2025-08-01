import React, { useState } from 'react';
import '../App.css';

function FindUserPwd() {
   const [username, setUsername] = useState(''); // 이름
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState('');

  const sendCode = async () => {
    if (!userId || !email) {
      alert('아이디와 이메일을 입력하세요.');
      return;
    }

    try {
      const res = await fetch('/user/sendCodePwd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, userId, email }),
      });
      const data = await res.json();
      if (data.sw) {
        setStep(2);
        setMsg('인증번호를 이메일로 발송했습니다.');
      } else {
        setError(data.msg || '인증번호 전송 실패');
      }
    } catch (err) {
      setError('네트워크 오류');
    }
  };

  const verifyCode = async () => {
    try {
      const res = await fetch('/user/verifyCodePwd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username,userId ,email, code }),
      });
      const data = await res.json();
      if (data.sw) {
        setStep(3);
        setMsg('인증 성공! 새 비밀번호를 입력하세요.');
      } else {
        setError(data.msg || '인증 실패');
      }
    } catch (err) {
      setError('네트워크 오류');
    }
  };

  const resetPwd = async () => {
    if (!newPwd) {
      alert('새 비밀번호를 입력하세요.');
      return;
    }

    try {
      const res = await fetch('/user/resetPwd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, userId, email, newPassword: newPwd }),
      });
      const data = await res.json();
      if (data.sw) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        window.location.href = '/user/login';
      } else {
        setError(data.msg || '비밀번호 변경 실패');
      }
    } catch (err) {
      setError('네트워크 오류');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>비밀번호 재설정</h2>
      {msg && <div style={{ color: 'green', marginBottom: '10px' }}>{msg}</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {step === 1 && (
        <>
          <label>이름:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이름 입력"
          />
          <br />
          <label>아이디:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디 입력"
          />
          <br />
          <label>이메일:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
          />
          <br />
          <button onClick={sendCode}>인증번호 받기</button>
        </>
      )}

      {step === 2 && (
        <>
          <label>인증번호:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증번호 입력"
          />
          <br />
          <button onClick={verifyCode}>인증번호 확인</button>
        </>
      )}

      {step === 3 && (
        <>
          <label>새 비밀번호:</label>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="새 비밀번호 입력"
          />
          <br />
          <button onClick={resetPwd}>비밀번호 변경</button>
        </>
      )}
    </div>
  );
}

export default FindUserPwd;