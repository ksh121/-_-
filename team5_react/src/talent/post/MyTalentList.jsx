import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalContext } from '../../components/GlobalContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../searchBar/MyPage_SearchBar'; 

const MyTalentList = () => {
  const [talents, setTalents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [keyword, setKeyword] = useState(''); 
  const [avgRatings, setAvgRatings] = useState({});

  const { loginUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const goToPage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
  };

  const handleSearchChange = (e) => setKeyword(e.target.value);
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setPage(0); // ✅ 검색 시 페이지 초기화
    }
  };

  useEffect(() => {
    if (!loginUser) return;

    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (keyword.trim() !== '') {
      params.append('keyword', keyword.trim());
    }

    axios.get(`/talent/my-talents?${params.toString()}`, { withCredentials: true })
      .then(res => {
        setTalents(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(err => {
        console.error('마이페이지 목록 불러오기 실패:', err);
        alert('마이페이지 불러오기 실패: ' + err.message);
      });
  }, [loginUser, page, size, keyword]); // ✅ keyword 변화 시 재요청

  const handleGoDetail = (talentno) => {
    navigate(`/talent/detail/${talentno}`);
  };

  useEffect(() => {
  const fetchAvgRatings = async () => {
    const ratingMap = {};
    await Promise.all(talents.map(async (t) => {
      try {
        const res = await axios.get(`/reviews/average-rating/${t.talentno}`);
        ratingMap[t.talentno] = parseFloat(res.data).toFixed(1);
      } catch (e) {
        console.error(`평점 가져오기 실패: talentno=${t.talentno}`, e);
        ratingMap[t.talentno] = null;
      }
    }));
    setAvgRatings(ratingMap);
  };

  if (talents.length > 0) fetchAvgRatings();
}, [talents]);

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-6 text-center">내 재능 게시물</h2>

      {/* ✅ 검색창 */}
      <div className="mb-6">
        <SearchBar
          searchQuery={keyword}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      {talents.length === 0 ? (
        <div className="text-center text-gray-500">작성한 게시물이 없습니다.</div>
      ) : (
        talents.map(t => (
          <article key={t.talentno}
            onClick={() => handleGoDetail(t.talentno)}
            className="relative flex items-center justify-between gap-4 border px-5 py-4 rounded-lg mb-4 hover:shadow cursor-pointer">
            {t.fileInfos && t.fileInfos.length > 0 && (
              <img src={`/uploads/talent/${t.fileInfos[0].storedFileName}`}
                alt={t.fileInfos[0].originalFileName}
                className="w-24 h-24 object-cover rounded shadow"
                onClick={(e) => e.stopPropagation()} />
            )}
            {/* 오른쪽 상단 카테고리 */}
              <div className="absolute top-4 right-6 text-xs text-gray-500">
                {t.cateGrpName} &gt; {t.categoryName}
              </div>
              <div className="flex-1 text-left px-4 overflow-hidden">                
              <h3 className="font-semibold text-lg">
              {t.title.length > 30 ? t.title.slice(0, 30) + '...' : t.title}
            </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{t.description}</p>
              <p className="text-sm text-gray-500 mt-1">작성자: {t.userName}</p>

              {/* ⭐ 평점 + 조회수 한 줄로 정렬 */}
              {avgRatings[t.talentno] !== null && avgRatings[t.talentno] !== undefined && (
                <div className="flex justify-between items-center text-sm mt-1">
                  <p className="text-yellow-600">⭐ {avgRatings[t.talentno]} / 5</p>
                  <p className="text-xs text-gray-400">조회수 : {t.viewCount}</p>
                </div>
              )}
              </div>
          </article>
        ))
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button onClick={() => goToPage(page - 1)} disabled={page <= 0}
          className="px-4 py-1 rounded bg-gray-200 disabled:opacity-50">이전</button>
        <span>{page + 1} / {totalPages}</span>
        <button onClick={() => goToPage(page + 1)} disabled={page + 1 >= totalPages}
          className="px-4 py-1 rounded bg-gray-200 disabled:opacity-50">다음</button>
      </div>
    </div>
  );
};

export default MyTalentList;
