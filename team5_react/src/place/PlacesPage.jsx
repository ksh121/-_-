import React, { useState, useEffect, useContext } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import PlaceSideBar from '../components/sidebar/PlaceSideBar';
import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext';
import { useNavigate } from 'react-router-dom';

const PlacePage = ({place}) => {
  const navigate = useNavigate();
  const { loginUser } = useContext(GlobalContext); // 로그인 유저 정보 (schoolno 등)
  const [selectedCategory, setSelectedCategory] = useState(); // {categoryId}
  const [places, setPlaces] = useState([]);  // 장소 목록 (API에서 받아옴)
  const [categories, setCategories] = useState([]); // 학교 관 + 장소 카테고리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태

  const searchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1); // 검색 시 1페이지로 리셋
      // fetchPlaces 함수가 searchQuery를 의존성으로 가지므로, 상태 변경만으로 재호출됨
    }
  };

  // 학교 관 + 장소 카테고리 불러오기 (PlaceSideBar가 사용하는 카테고리)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const schoolno = loginUser?.schoolno;
        if (!schoolno) return;

        // 학교 '관' 목록을 직접 가져오는 API 호출
        const res = await axios.get(`/places/list-by-school/${schoolno}`);
        const gwanList = res.data; // 응답이 '관' 목록 배열이라고 가정

        // '관' 목록을 카테고리 형식으로 변환
        const categoryResult = gwanList.map(gwan => ({
            id: gwan.schoolgwanno,
            name: gwan.schoolgwanname,
            icon: '🏫',
        }));

        // 중복 제거 (혹시 모를 중복 데이터 대비)
        const uniqueCategories = Array.from(new Map(categoryResult.map(item => [item.id, item])).values());

        setCategories(uniqueCategories);
      } catch (error) {
        //console.error('카테고리 불러오기 실패', error);
        setCategories([]); // 에러 발생 시 카테고리 목록 비우기
      }
    };

    if (loginUser?.schoolno) {
        fetchCategories();
    }
  }, [loginUser]);

  // 카테고리가 변경되면 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);


  // selectedCategory or currentPage가 바뀔 때마다 장소 목록 다시 불러오기
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        
        const schoolno = loginUser?.schoolno;
        const schoolgwanno= selectedCategory?.categoryId;
        if (!schoolno) return;

        let res;

        const commonParams = {
          page: currentPage - 1,
          size: 10, // 기본 사이즈
          keyword: searchQuery // 검색어 추가
        };

        if (selectedCategory?.categoryId) {
          // '관'(카테고리) 선택 시, 해당 관의 장소 목록을 조회하는 API 호출
          const params = {
            ...commonParams,
            schoolno: schoolno,
            schoolgwanno: selectedCategory.categoryId, // 선택된 카테고리 ID를 schoolgwanno로 사용
            size: 5 // 카테고리 선택 시 사이즈
          };
          res = await axios.get(`/places/places/list-by-school-and-gwan`, { params });
            //console.log('관선택->',res.data);
            //console.log('API 호출 파라미터 (관 선택):', params);
        } else {
          // 카테고리 선택이 없을 경우, 특정 학교의 모든 장소 조회 API 사용
          const params = {
            ...commonParams,
            schoolno: schoolno,
          };
          res = await axios.get(`/places/places/list-by-school/${schoolno}`, { params });
            console.log('전부->',res.data);
            //console.log('API 호출 파라미터 (전체):', params);
        }
        
        console.log('API 응답 데이터:', res.data);

        // API 응답이 페이징 구조(content, totalPages)를 포함한다고 가정하고 상태 업데이트
        if (res.data && res.data.content) {
          setPlaces(res.data.content);
          setTotalPages(res.data.totalPages || 0);
        } else {
          // 페이징 구조가 아닌 단순 배열일 경우 처리
          setPlaces(res.data || []);
          setTotalPages(1); // 페이지는 1개만 있다고 가정
        }

      } catch (error) {
        //console.error('장소 데이터를 불러오는 데 실패했습니다.', error);
        setPlaces([]); // 에러 발생 시 장소 목록 비우기
        setTotalPages(0); // 에러 발생 시 페이지 수 0으로 설정
      }
    };

    if (loginUser?.schoolno) {
        fetchPlaces();
    }
    console.log(categories);
    console.log(selectedCategory);
  }, [selectedCategory, loginUser, currentPage, searchQuery]);

  
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
  
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', gap: '8px' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: currentPage === 1 ? '#f0f0f0' : 'white',
            color: currentPage === 1 ? '#aaa' : '#333',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s, color 0.2s'
          }}
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              width: '36px',
              height: '36px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: currentPage === page ? '#3498db' : 'white',
              color: currentPage === page ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s, color 0.2s'
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: currentPage === totalPages ? '#f0f0f0' : 'white',
            color: currentPage === totalPages ? '#aaa' : '#333',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s, color 0.2s'
          }}
        >
          다음
        </button>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>


      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '50px',
        padding: '30px 20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>

        <PlaceSideBar 
          setSelectedCategory={setSelectedCategory} 
          selectedCategory={selectedCategory}
        />

        {/* 중앙 컨텐츠 영역 */}
        <div style={{ flex: 1, maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 헤더 */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#333', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={32} />

              {selectedCategory && (
              <span>
                {(categories.find(c => c.id === selectedCategory.categoryId)?.name)}
              </span>
            )}
            강의실
            </h1>


          <div style={{ position: 'relative' }}>
            <div style={{textAlign: 'left', marginBottom: '20px'}} >
              </div>
              <div style={{ position: 'relative' }}>
                <Search style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  zIndex: 1
                }} size={20} />
                <input
                  type="text"
                  placeholder="게시물을 검색하세요..."  
                  style={{
                    width: '100%',
                    padding: '15px 20px 15px 50px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    boxSizing: 'border-box'
                  }}
                  value={searchQuery}
                  onChange={searchChange}
                  onKeyDown={handleSearch}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
              </div>
            </div>
          </div>

          {/* 장소 목록 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {Array.isArray(places) && places.length > 0 ? (
              places.map(place => (
                <div
                  key={place.placeno}
                  onClick={() => navigate(`/place/detail/${place.placeno}`)} // ✅ 이 부분
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  <div style={{
                    height: '200px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    backgroundImage: `url("/gang.jpg")`,
                    
                    
                  }}
                  >

                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Navigation size={14} />
                    </div>
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', margin: '0 0 8px 0' }}>{place.placename}</h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>{place.address || ''}</span>
                    </div>

                    <p style={{ fontSize: '14px', color: '#777', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                      {place.description || ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                padding: '60px',
                textAlign: 'center'
              }}>
                <MapPin size={48} color="#ccc" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', color: '#666', margin: 0 }}>
                  장소를 불러오는 중이거나, 해당하는 장소가 없습니다.
                </h3>
              </div>
            )}
          </div>
          
          {/* 페이지네이션 */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>
      </div>
    </div>
  );
};

export default PlacePage;