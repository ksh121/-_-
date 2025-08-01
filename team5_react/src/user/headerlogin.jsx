import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { GlobalContext } from '../components/GlobalContext';

function enter_chk(event, nextTag) {
  if (event.keyCode === 13) {
    document.getElementById(nextTag).focus();
  }
}

function UserLogin() {
  const [id, setId] = useState('');
  const [saveId, setSaveId] = useState(false);
  const [passwd, setPasswd] = useState('');
  const [savePasswd, setSavePasswd] = useState(false);
  // const navigate = useNavigate();
  
  // 실제 프로젝트에서는 GlobalContext를 사용하세요
  // const { sw, setSw, userno, setUserno, loginUser, setLoginUser } = useContext(GlobalContext);
  
  // 데모용 상태 (실제 프로젝트에서는 제거하세요)
  const [sw, setSw] = useState(false);
  const [userno, setUserno] = useState(0);
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    // localStorage 대신 상태로만 관리 (데모용)
    // 실제 프로젝트에서는 localStorage를 사용하세요
    // const storedId = localStorage.getItem('savedUserId');
    // const storedPasswd = localStorage.getItem('savedUserPasswd');
    // if (storedId) {
    //   setId(storedId);
    //   setSaveId(true);
    // }
    // if (storedPasswd) {
    //   setPasswd(storedPasswd);
    //   setSavePasswd(true);
    // }
  }, []);

  const idChange = (e) => {
    const value = e.target.value;
    setId(value);
    // 실제 프로젝트에서는 localStorage를 사용하세요
    // if (saveId) {
    //   localStorage.setItem('savedUserId', value);
    // }
  };

  const passwdChange = (e) => {
    const value = e.target.value;
    setPasswd(value);
    // 실제 프로젝트에서는 localStorage를 사용하세요
    // if (savePasswd) {
    //   localStorage.setItem('savedUserPasswd', value);
    // }
  };

  const saveIdChange = (e) => {
    const checked = e.target.checked;
    setSaveId(checked);
    // 실제 프로젝트에서는 localStorage를 사용하세요
    // if (checked) {
    //   localStorage.setItem('savedUserId', id);
    // } else {
    //   localStorage.removeItem('savedUserId');
    // }
  };

  const savePasswdChange = (e) => {
    const checked = e.target.checked;
    setSavePasswd(checked);
    // 실제 프로젝트에서는 localStorage를 사용하세요
    // if (checked) {
    //   localStorage.setItem('savedUserPasswd', passwd);
    // } else {
    //   localStorage.removeItem('savedUserPasswd');
    // }
  };

  const send = () => {
    if (!id || !passwd) {
      alert('아이디와 패스워드를 입력해주세요.');
      return;
    }

    // 데모용 로그인 로직
    if ((id === 'kimgyuhwa123' && passwd === '1234') || (id === 'testId' && passwd === '1234')) {
      alert('로그인 성공!');
      setSw(true);
      setUserno(1);
      setLoginUser({ id: id, name: '사용자' });
    } else {
      alert('로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.');
      setSw(false);
      setUserno(0);
    }

    // 실제 프로젝트에서는 아래 코드를 사용하세요
    /*
    fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: id, password: passwd }),
    })
      .then((res) => res.text())
      .then((text) => {
        if (text.includes('성공')) {
          fetch('/user/session', {
            method: 'GET',
            credentials: 'include',
          })
            .then(res => res.json())
            .then(data => {
              if (data.sw && data.user) {
                setSw(true);
                setUserno(data.user.userno);
                setLoginUser(data.user);
                navigate('/'); // 로그인 후 홈으로 이동
              } else {
                setSw(false);
                setUserno(0);
                setLoginUser(null);
              }
            })
            .catch(err => {
              console.error('세션 확인 실패:', err);
            });
        } else {
          alert('로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.');
          setSw(false);
          setUserno(null);
        }
      })
      .catch((err) => {
        console.error('로그인 오류:', err);
        alert('서버 오류가 발생했습니다.');
      });
    */
  };

  const test = () => {
    setId('kimgyuhwa123');
    setPasswd('1234');
  };

  const adminTest = () => {
    setId('testId');
    setPasswd('1234');
  };

  const handleSignup = () => {
    // 실제 프로젝트에서는 navigate('/user/univCert')를 사용하세요
    alert('회원가입 페이지로 이동');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 border border-blue-100">
        
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold text-blue-600 mb-2"
            style={{
              fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
            }}
          >
            환영합니다!
          </h1>
          <p 
            className="text-slate-500 text-lg"
            style={{
              fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
            }}
          >
            대학생 재능 교환을 시작해보세요!
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="space-y-6">
          {/* 아이디 입력 */}
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-slate-700 mb-2">
              아이디
            </label>
            <input
              type="text"
              id="id"
              placeholder="아이디를 입력하세요"
              name="id"
              autoFocus={true}
              onKeyDown={(e) => enter_chk(e, 'passwd')}
              onChange={idChange}
              value={id}
              className="w-full p-4 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
            <div className="mt-3 flex items-center">
              <input
                type="checkbox"
                id="saveId"
                checked={saveId}
                onChange={saveIdChange}
                className="mr-2 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="saveId"
                className="text-sm text-slate-600 cursor-pointer"
              >
                아이디 저장
              </label>
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="passwd" className="block text-sm font-medium text-slate-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="passwd"
              placeholder="비밀번호를 입력하세요"
              name="passwd"
              onKeyDown={(e) => enter_chk(e, 'btnSend')}
              onChange={passwdChange}
              value={passwd}
              className="w-full p-4 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
            <div className="mt-3 flex items-center">
              <input
                type="checkbox"
                id="savePasswd"
                checked={savePasswd}
                onChange={savePasswdChange}
                className="mr-2 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="savePasswd"
                className="text-sm text-slate-600 cursor-pointer"
              >
                비밀번호 저장
              </label>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            id="btnSend"
            type="button"
            onClick={send}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-semibold hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            로그인
          </button>
        </div>

        {/* 테스트 버튼들 */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={test}
            className="flex-1 bg-slate-500 text-white p-3 rounded-xl text-sm font-semibold hover:bg-slate-600 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
          >
            사용자 계정
          </button>
          <button
            type="button"
            onClick={adminTest}
            className="flex-1 bg-slate-500 text-white p-3 rounded-xl text-sm font-semibold hover:bg-slate-600 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
          >
            관리자 계정
          </button>
        </div>

        {/* 하단 링크들 */}
        <div className="mt-8 space-y-4">
          <div className="text-center text-sm text-slate-500">
            <span className="hover:text-blue-600 cursor-pointer transition-colors duration-200 mr-4">
              아이디 찾기
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors duration-200">
              비밀번호 찾기
            </span>
          </div>
          
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              아직 계정이 없으신가요?{' '}
              <span
                onClick={handleSignup}
                className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors duration-200"
              >
                회원가입
              </span>
            </p>
          </div>
        </div>

        {/* 현재 로그인 상태 표시 (데모용) */}
        {sw && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 text-sm font-medium">
              로그인됨: {loginUser?.name || id} (번호: {userno})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLogin;