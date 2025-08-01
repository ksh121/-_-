// src/pages/MyPageSideBar.jsx
import React, { useContext } from 'react';
import { User, Edit3 } from 'lucide-react';
import { GlobalContext } from '../components/GlobalContext';
import { useNavigate } from 'react-router-dom';

const MyPageSideBar = ({ currentPage }) => {
  const { loginUser } = useContext(GlobalContext);
  const navigate = useNavigate();
   const baseUrl = '/uploads/user/';

  const handleTabClick = (tabName) => {
    navigate(`/mypage/Mypage?tab=${tabName}`);
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px 20px',
      height: 'fit-content',
      boxShadow: '0 8px 8px rgba(0, 0, 0, 0.1)',
    }}>
      {/* 프로필 섹션 */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#e5e7eb',
          borderRadius: '50%',
          margin: '0 auto 15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {loginUser?.profileImage
            ? <img
                src={loginUser.profileImage.startsWith('blob:')
                  ? loginUser.profileImage
                  : baseUrl + loginUser.profileImage}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            : <User style={{ width: '40px', height: '40px', color: '#9ca3af' }} />}
          <div style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '24px',
            height: '24px',
            backgroundColor: '#4b5563',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Edit3 style={{ width: '12px', height: '12px', color: 'white' }} />
          </div>
        </div>
        {/* loginUser가 없으면 빈 문자열 처리 */}
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
          {loginUser?.username || ''}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '30px' }}>
          {loginUser?.email || ''}
        </div>
      </div>

      {/* 구분선 */}
      <div style={{
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '20px 0'
      }}></div>

      {/* 메뉴 섹션 */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'inline-block',
            borderBottom: currentPage === 'profile' ? '2px solid black' : 'none',
            paddingBottom: '5px'
          }}
          onClick={() => handleTabClick('profile')}
        >
          내 프로필
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '18px',
          borderBottom: currentPage === 'mytalent' ? '2px solid black' : 'none',
          display: 'inline-block',
          paddingBottom: '5px'
        }}
        onClick={() => handleTabClick('mytalent')}
      >
        내 게시물
      </div>
    </div>


      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            paddingBottom: '5px',
            display: 'inline-block',
            borderBottom: currentPage === 'mySell' ? '2px solid black' : 'none',
            cursor: 'pointer'
          }}
          onClick={() => handleTabClick('mySell')}
        >
          거래내역
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '18px',
            borderBottom: currentPage === 'reservation' ? '2px solid black' : 'none',
            display: 'inline-block',
            paddingBottom: '5px'

          }}
          onClick={() => handleTabClick('reservation')}
        >
          예약 확인
        </div>
      </div>


    {/* 구분선 */}
      <div style={{
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '20px 0'
      }}></div>


    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '18px',
          borderBottom: currentPage === 'block' ? '2px solid black' : 'none',
          display: 'inline-block',
          paddingBottom: '5px'
        }}
        onClick={() => handleTabClick('block')}
      >
        차단 목록
      </div>
    </div>

    </aside>
  );
};

export default MyPageSideBar;
