// src/components/Menu.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from './GlobalContext';

function Menu() {
  const { loginUser } = useContext(GlobalContext);
  const { sw } = useContext(GlobalContext);
  console.log("loginUser:", loginUser);

  return (
   <nav>
  <Link to="/">홈</Link> |{" "}

  {sw ? (
    <>
      <Link to="/components/main">메인창</Link> |{" "}
      <Link to="/user/profile">회원정보</Link> |{" "}
      {loginUser && (
        <>
         <Link to="/user/logout">로그아웃</Link> |{" "}
        </>
      )}
      <Link to="/reservation/Reservation">예약ex</Link> |{" "}
      <Link to="/user/session">Session Info</Link> |{" "}
      <Link to="/chat">Chat</Link> |{" "}
      <Link to="/talent/post">게시물</Link> |{" "}
      <Link to="/review/review">리뷰</Link> |{" "}
      <Link to="/mypage/chatbot-list">챗봇리스트 |</Link>
      <Link to="/reservation/Reservation"> 예약 ex</Link>{" "}

      {loginUser && loginUser.role === "admin" && (
        <>
          {" | "}<Link to="/talent/categrp">CateGrp(대분류)</Link>
          {" | "}<Link to="/talent/category">Category(소분류)</Link>
          {" | "}<Link to="/talent/type">Type</Link>
          {" | "}<Link to="/admin/user">유저 목록</Link>
          {" | "}<Link to="/admin/report">신고 목록</Link>
        </>
      )}
    </>
  ) : (
    <>
      <Link to="/user/login">로그인</Link> |{" "}
      <Link to="/user/register">회원가입</Link>
    </>
  )}
</nav>
  );
}

export default Menu;