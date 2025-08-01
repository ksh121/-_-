// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './components/GlobalContext';
import Menu from './components/Menu';
import Home from './components/Home';
import UserLogin from './user/UserLogin';
import UserLogout from './user/UserLogout';
import UserSession from './user/UserSession';
import UserRegister from './user/UserRegister';
import UserProfile from './user/UserProfile';
import FindUserId from './user/FindUserId';
import FindUserPwd from './user/FindUserPwd';
import ChatRoom from './chat/ChatRoom';
import TalentCateGrp from './talent/categrp/TalentCateGrp';
import TalentCreateForm from './talent/post/TalentCreateForm';
import TalentCategory from './talent/category/TalentCategory';
import TalentDetailPage from './talent/post/TalentDetailPage';
import TalentType from './talent/type/TalentType';
import Talent from './talent/post/Talent';
import TalentUpdate from './talent/post/TalentUpdate'
import ReservationsManager from './reservation/Reservation';
import MainPage from './components/Main';
import UnivCertPage from './user/UnivCertPage';
import ReviewPage from './review/ReviewPage';
import ProfileReviewPage from './review/ProfileReviewPage';

import PlacesPage from './place/PlacesPage';
import MyPage from './mypage/MyPage';
import MyPageSetting from './mypage/MyPageSetting';
import MyPageSurvey from './mypage/MyPageSurvey';
import MyPageProfile from './mypage/MyPageProfile';
import MyPageReservation from './mypage/MyPageReservation';
import MyChatBotListPage from './mypage/MyChatBotListPage';
import AdminUserList from './admin/AdminUserList';
import Header from './components/header/Header'
import PlaceDetailPage from './place/PlaceDetailPage';
import AdminReportList from './admin/AdminReportList';
import ReportCreate from './components/report/ReportCreate';
// ----채팅
import ChatLayout from './chat/ChatLayout'; // ← 레이아웃
import ChatListPage from './chat/ChatListPage'; // 내 채팅방 목록
import OpenChatListPage from './chat/OpenChatListPage'; // 공개 채팅방 목록
//--------
import AdminActivityList from './admin/AdminActivityList';
import SellList from './mypage/SellList'
import UserProfilePage from './user/profile/UserProfilePage';


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <GlobalProvider>
      <div className="App">
        <BrowserRouter>
          {/* <Menu /> */}
          {/* Header에 로그인 모달 열기 함수 전달 */}
          <Header openLoginModal={() => setIsModalOpen(true)} />
          <hr />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* 관리자 페이지 */}
            <Route path="/admin/user" element={<AdminUserList />} />
            <Route path="/admin/report" element={<AdminReportList />} />
            <Route path="/admin/activity" element={<AdminActivityList />} />
            {/* 회원 */}
            <Route path="/mypage/MyPage" element={<MyPage />} />
            <Route path="/mypage/MyPageSetting" element={<MyPageSetting />} />
            <Route path="/mypage/MyPageSurvey" element={<MyPageSurvey />} />
            <Route path="/mypage/MyPageProfile" element={<MyPageProfile />} />
            <Route path="/mypage/MyPageReservation" element={<MyPageReservation />} />
            <Route path="/components/Main" element={<MainPage />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/logout" element={<UserLogout />} />
            <Route path="/user/session" element={<UserSession />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/findId" element={<FindUserId />} />
            <Route path="/user/findPwd" element={<FindUserPwd />} />
            <Route path="/user/univCert" element={<UnivCertPage />} />
            <Route path="/review/review" element={<ReviewPage />} />
            <Route path="/review/profilereview" element={<ProfileReviewPage />} />
            <Route path="/profile/:userno" element={<UserProfilePage />} />
            {/* 재능 */}
            <Route path="/talent/post" element={<Talent />} />
            <Route path="/talent/type" element={<TalentType />} />
            <Route path="/talent/category" element={<TalentCategory />} />
            <Route path="/talent/categrp" element={<TalentCateGrp />} />
            <Route path="/talent/TalentCreateForm" element={<TalentCreateForm />} />
            <Route path="/mypage/MyPage/list" element={<SellList />} />
            <Route path="/talent/update/:talentno" element={<TalentUpdate />} />
            {/* 장소 */}
            <Route path="/place/PlacesPage" element={<PlacesPage />} />
            <Route path="/place/detail/:placeno" element={<PlaceDetailPage />} />
            <Route path="/reservation/Reservation" element={<ReservationsManager />} />
            {/* 채팅 */}
            <Route path="/chat" element={<ChatLayout />}>
              <Route path="my" element={<ChatListPage />} />
              <Route path="public" element={<OpenChatListPage />} />
              <Route path=":chatRoomno" element={<ChatRoom />} />
            </Route>
            {/* 챗봇 */}
            <Route path="/mypage/chatbot-list" element={<MyChatBotListPage />} />
            <Route path="/talent/detail/:talentno" element={<TalentDetailPage />} />
            <Route path="/mypage/MyPage" element={<MyPage />} />
            {/* 신고 */}
            <Route path="/report/create" element={<ReportCreate />} />
          </Routes>
          <hr />
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            &copy; 2025 My User System
          </div>
          {/* 로그인 모달 조건부 렌더링 */}
          {isModalOpen && (
            <UserLogin
              isModalOpen={isModalOpen}
              closeModal={() => setIsModalOpen(false)}
            />
          )}
        </BrowserRouter>
      </div>
    </GlobalProvider>
  );
}

export default App;