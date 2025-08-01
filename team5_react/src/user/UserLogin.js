import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../components/GlobalContext';

function enter_chk(event, nextTag) {
  if (event.keyCode === 13) {
    document.getElementById(nextTag).focus();
  }
}

function UserLogin({ isModalOpen = true, closeModal = () => {} }) {
  const [id, setId] = useState('');
  const [saveId, setSaveId] = useState(false);
  const [passwd, setPasswd] = useState('');
  const [savePasswd, setSavePasswd] = useState(false);
  const navigate = useNavigate();
  const { sw, setSw, userno, setUserno, loginUser, setLoginUser } = useContext(GlobalContext);

  useEffect(() => {
    const storedId = localStorage.getItem('savedUserId');
    const storedPasswd = localStorage.getItem('savedUserPasswd');

    if (storedId) {
      setId(storedId);
      setSaveId(true);
    }

    if (storedPasswd) {
      setPasswd(storedPasswd);
      setSavePasswd(true);
    }
  }, []);

  const idChange = (e) => {
    const value = e.target.value;
    setId(value);
    if (saveId) {
      localStorage.setItem('savedUserId', value);
    }
  };

  const passwdChange = (e) => {
    const value = e.target.value;
    setPasswd(value);
    if (savePasswd) {
      localStorage.setItem('savedUserPasswd', value);
    }
  };

  const saveIdChange = (e) => {
    const checked = e.target.checked;
    setSaveId(checked);
    if (checked) {
      localStorage.setItem('savedUserId', id);
    } else {
      localStorage.removeItem('savedUserId');
    }
  };

  const savePasswdChange = (e) => {
    const checked = e.target.checked;
    setSavePasswd(checked);
    if (checked) {
      localStorage.setItem('savedUserPasswd', passwd);
    } else {
      localStorage.removeItem('savedUserPasswd');
    }
  };

  const send = (event) => {
    event.preventDefault();
    if (!id || !passwd) {
      alert('아이디와 패스워드를 입력해주세요.');
      return;
    }

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
            //localStorage.setItem('loginUser', JSON.stringify(data.user)); // 선택
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
          console.log(id)
          console.log(passwd)
          alert('로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.');
          setSw(false);
          setUserno(null);
        }
      })
      .catch((err) => {
        console.error('로그인 오류:', err);
        alert('서버 오류가 발생했습니다.');
      });
  };


  const test = () => {
    setId('kimgyuhwa123');
    setPasswd('1234');
  };

  const adminTest = () => {
    setId('testId');
    setPasswd('1234');
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    } 
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
      onClick={handleModalClick}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl w-11/12 max-w-md">
        <button
          onClick={closeModal}
          className="absolute top-4 right-6 text-2xl text-slate-500 hover:text-blue-600 cursor-pointer"
        >
          &times;
        </button>

        {sw === true ? (
          // 로그인 성공 화면
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3
                className="text-blue-600 mb-2 text-2xl font-semibold"
                style={{
                  fontFamily:
                    "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
                }}
              >
                로그인 성공!
              </h3>
              <p
                className="text-slate-500"
                style={{
                  fontFamily:
                    "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
                }}
              >
                환영합니다! 메인 페이지로 이동합니다.
              </p>
            </div>
            <button
                onClick={() => {
                  closeModal(); // 모달 닫기
                  navigate('/components/Main'); // 페이지 이동
                }}
              className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              확인
            </button>
          </div>
        ) : (
          // 기존 로그인 폼
          <>
            <h3
              className="text-blue-600 mb-4 text-2xl font-semibold text-center"
              style={{
                fontFamily:
                  "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
              }}
            >
              로그인
            </h3>

            <p
              className="text-slate-500 mb-6 text-center"
              style={{
                fontFamily:
                  "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
              }}
            >
              대학생 재능 교환을 시작해보세요!
            </p>

            <form onSubmit={send}>
              <div className="mb-4">
                <input
                  type="text"
                  id="id"
                  placeholder="아이디"
                  name="id"
                  autoFocus={true}
                  onKeyDown={(e) => enter_chk(e, 'passwd')}
                  onChange={idChange}
                  value={id}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id="saveId"
                  checked={saveId}
                  onChange={saveIdChange}
                  className="mr-2"
                />
                <label
                  htmlFor="saveId"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  아이디 저장
                </label>
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  id="passwd"
                  placeholder="패스워드"
                  name="passwd"
                  onKeyDown={(e) => enter_chk(e, 'btnSend')}
                  onChange={passwdChange}
                  value={passwd}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="savePasswd"
                  checked={savePasswd}
                  onChange={savePasswdChange}
                  className="mr-2"
                />
                <label
                  htmlFor="savePasswd"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  패스워드 저장
                </label>
              </div>

              <button
                id="btnSend"
                type="submit"
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg hover:bg-blue-700 transition-all duration-300 mb-3"
              >
                로그인
              </button>
            </form>

            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={test}
                className="flex-1 bg-slate-500 text-white p-3 rounded-xl text-sm font-semibold hover:bg-slate-600 transition-all duration-300"
              >
                사용자 계정
              </button>
              <button
                type="button"
                onClick={adminTest}
                className="flex-1 bg-slate-500 text-white p-3 rounded-xl text-sm font-semibold hover:bg-slate-600 transition-all duration-300"
              >
                관리자 계정
              </button>
            </div>

            <div className="text-center text-sm text-slate-500 mb-4">
              <Link
                to="/user/findId"
                style={{ marginRight: '10px' }}
                onClick={() => closeModal()}
              >
                아이디 찾기
              </Link>
              <Link to="/user/findPwd"
              onClick={() => closeModal()}>  
                비밀번호 찾기  
              </Link>
            </div>

            <p className="text-slate-500 text-center text-sm">
              아직 계정이 없으신가요?{' '}
              <span
                onClick={() => {
                  navigate('/user/univCert');
                  closeModal();
                }}
                className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
              >
                회원가입
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default UserLogin;

