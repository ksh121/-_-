import React, { useState, useEffect, useContext } from 'react';
import { Plus, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../GlobalContext'; // loginUser에서 schoolno 얻기 위해

function PlaceSideBar({ setSelectedCategory, selectedCategory }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [internalCategories, setInternalCategories] = useState([]); // PlaceSideBar 내부에서 사용할 카테고리 상태
  const navigate = useNavigate();
  const { loginUser } = useContext(GlobalContext);  // 로그인 사용자 정보

  let currentDisplayName = '';
  if (selectedCategory && selectedCategory.categoryId) { // selectedCategory와 categoryId가 존재하는지 확인
    // 메인 카테고리로 찾기 시도
    const mainCat = internalCategories.find(cat => cat.id === selectedCategory.categoryId);
    if (mainCat) {
      currentDisplayName = mainCat.name;
    }
  }

  const handleClearCategory = () => {
    setSelectedCategory({ categoryId: null });
    setOpenCategory(null);
  };

  const handleCategoryClick = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId); // Toggle dropdown
    setSelectedCategory({ categoryId }); // 메인 카테고리 ID 설정
  };

  const VerticalLineIcon = ({ height = 16, color = '#999' }) => (
    <svg
      width="2"
      height={height}
      viewBox={`0 0 2 ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="2" height={height} fill={color} rx="1" />
    </svg>
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const schoolno = loginUser?.schoolno;
        if (!schoolno) return;

        const res = await axios.get(`/places/list-by-school/${schoolno}`);
        const gwanList = res.data;

        const categoryResult = gwanList.map(gwan => ({
            id: gwan.schoolgwanno,
            name: gwan.schoolgwanname,
            icon: <VerticalLineIcon height={16} color="#999" />,
        }));

        const uniqueCategories = Array.from(new Map(categoryResult.map(item => [item.id, item])).values());

        setInternalCategories(uniqueCategories);
      } catch (error) {
        console.error('카테고리 불러오기 실패', error);
        setInternalCategories([]);
      }
    };

    if (loginUser?.schoolno) {
        fetchCategories();
    }
  }, [loginUser]);

  return (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 상단 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          fontSize: '30px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {loginUser?.schoolname}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          <button style={buttonStyle} onClick={() => navigate('/components/Main')}>
            <Menu size={20} />
            <span>카테고리 보기</span>
          </button>
        </div>
      </div>

      {/* 구분선 */}
      <div style={{
        height: '1px',
        backgroundColor: '#e5e7eb'
      }}></div>

      {/* 카테고리 */}
      <div style={categoryBoxStyle}>
        {selectedCategory && selectedCategory.categoryId && (
          <div style={{ marginBottom: '10px', textAlign: 'left' }}>
            <button
              onClick={handleClearCategory}
              style={{
                padding: '5px 10px',
                fontSize: '14px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              {currentDisplayName} X
            </button>
          </div>
        )}

        <h3 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          장소 카테고리
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {internalCategories.map((category) => (
            <div
              key={category.id}
              style={{ position: 'relative' }}
            >
              <div
                onClick={() => handleCategoryClick(category.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, border-radius 0.2s',
                  gap: '12px',
                  backgroundColor: openCategory === category.id ? '#f0f0f0' : 'transparent',
                  borderRadius: '5px',
                }}
              >
                <span style={{ fontSize: '16px' }}>{category.icon}</span>
                <span style={{ fontWeight: '500' }}>{category.name}</span>
              </div>

              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlaceSideBar;

// 스타일 분리
const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: '#007bff',
  color: 'white',
  padding: '8px 8px',
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  outline: 'none'
};

const categoryBoxStyle = {
  backgroundColor: 'white',
  padding: '30px',
  boxSizing: 'border-box',
  position: 'relative'
};

const dropdownStyle = {
  position: 'absolute',
  left: 0,
  top: '100%',
  marginLeft: '12px',
  width: '180px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  border: '1px solid #e1e5e9',
  zIndex: 100,
  overflow: 'hidden'
};

const subCategoryStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 16px',
  fontSize: '13px',
  color: '#555',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  textAlign: 'left'
};