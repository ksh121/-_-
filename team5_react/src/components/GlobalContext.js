import React, { createContext, useState, useEffect } from 'react'

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // const [sw, setSw] = useState(false);         // 로그인 여부
  // const [userno, setUserno] = useState(0);     // 사용자 고유번호
  // const [loginUser, setLoginUser] = useState(null); // 로그인한 유저 정보 (객체)
  const [sw, setSw] = useState(() => sessionStorage.getItem('sw') === 'true');
  const [userno, setUserno] = useState(() => parseInt(sessionStorage.getItem('userno') || 0));
  const [selectedCategoryNo, setSelectedCategoryNo] = useState(null);
  const [selectedCateGrpno, setSelectedCateGrpno] = useState(null); // ⭐ 대분류 선택 상태 추가 ⭐
  const [refreshTalentList, setRefreshTalentList] = useState(false); 
  const [loginUser, setLoginUser] = useState(() => {
  const storedUser = sessionStorage.getItem('loginUser');
  

return storedUser ? JSON.parse(storedUser) : null;
  });
  // sw 상태가 바뀔 때마다 sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem('sw', sw ? 'true' : 'false');
  }, [sw]);

  // employeeno가 바뀔 때마다 sessionStorage에 저장/삭제
  useEffect(() => {
    if (userno) {
      sessionStorage.setItem('userno', userno);
    } else {
      sessionStorage.removeItem('userno');
    }}, [userno]);

  // loginUser session에 저장
  useEffect(() => {
  if (loginUser) {
    sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
  } else {
    sessionStorage.removeItem('loginUser');
  }
}, [loginUser]);

  const triggerTalentListRefresh = () => { // 정의된 함수
        setRefreshTalentList(prev => !prev);
    };


  // useEffect(() => {
  //   fetch('/user/session', {
  //     method: 'GET',
  //     credentials: 'include',
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.sw && data.user) {
  //         setSw(true);
  //         setUserno(data.user.userno);
  //         setLoginUser(data.user);
  //         //localStorage.setItem('loginUser', JSON.stringify(data.user)); // 선택
  //       } else {
  //         setSw(false);
  //         setUserno(0);
  //         setLoginUser(null);
  //       }
  //     })
  //     .catch(err => {
  //       console.error('세션 확인 실패:', err);
  //     });
  // }, []);

  return (
    <GlobalContext.Provider value={{ sw, setSw, userno, setUserno, loginUser, setLoginUser,selectedCategoryNo, setSelectedCategoryNo,selectedCateGrpno, // ⭐ 추가 ⭐
            setSelectedCateGrpno, // ⭐ 추가 ⭐
            refreshTalentList,
            triggerTalentListRefresh }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
