import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // 쿼리 파라미터를 읽기 위한 훅
import Header from '../components/header/Header';
import MyPageSideBar from './MyPageSideBar';
import SecuritySettings from './MyPageSetting';
import MyPageProfile from './MyPageProfile';
import MyPageSurvey from './MyPageSurvey';
import MyPageReservation from './MyPageReservation';
import MyPageBlockList from './MyPageBlockList';
import MyTalentList from '../talent/post/MyTalentList';
import SellList from './SellList';


export default function MyPage() {
  

  
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tab = query.get('tab') || 'profile';

  const [currentPage, setCurrentPage] = useState(tab);
  const renderContent = () => {
    switch (currentPage) {
      case 'profile':
        return <MyPageProfile />;
      // case 'security':
      //   return <SecuritySettings />;
      case 'history':
        return <MyPageSurvey />;
      case 'block':
        return <MyPageBlockList />;
      case 'reservation':
        return <MyPageReservation />;  
      case 'mytalent':  // 내 게시물
        return <MyTalentList />;
      // case 'myBuy':
      //   return <MyBuy />
      case 'mySell':
        return <SellList />
    }
  };

    // URL의 tab 값이 바뀌면 상태도 같이 반영
    useEffect(() => {
      setCurrentPage(tab);
    }, [tab]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 메인 컨테이너 */}
      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px',
        gap: '20px'
      }}>

        {/* 사이드바 컴포넌트 */}
        <MyPageSideBar currentPage={currentPage} />
      
      
        {/* 메인 콘텐츠 */}
        <main style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {renderContent()}

        </main>
      </div>
    </div>
  );
}
