import React, { useContext, useEffect } from 'react';
import '../App.css';
import { GlobalContext } from '../components/GlobalContext';
import { getIP } from '../components/Tool';

function UserLogout() {
  const { setSw, setUserno, setLoginUser } = useContext(GlobalContext);

  useEffect(() => {
    fetch(`/user/logout`, {
      method: 'GET'
    })
      .then(result => result.text())
      .then(text => {
        console.log('->', text);
        setSw(false);
        setUserno(0);
        setLoginUser(null);
        sessionStorage.removeItem('sw');
        sessionStorage.removeItem('userno');
        sessionStorage.removeItem("loginUser");
      })
      .catch(err => console.error(err));
  }, [setSw, setUserno]);

  return (
    <>
      <h5>이용해 주셔서 감사합니다. 즐거운 하루 되세요~</h5>
    </>
  );
}

export default UserLogout;