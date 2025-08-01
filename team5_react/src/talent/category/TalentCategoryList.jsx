import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TalentCategoryItem from './TalentCategoryItem';

const TalentCategoryList = ({ refresh }) => {
  const [listData, setListData] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const size = 10;
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/talent_category/list', {
        params: { keyword, page, size, sort: 'categoryno,desc' },
      });
      setListData(res.data);
    } catch (error) {
      console.error('목록 조회 실패', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, [refresh, page, keyword]);

  const totalPages = listData ? listData.totalPages : 0;

  return (
    <div className="talentcate-list-container">
      <input
        className="talent-search-input"
        placeholder="검색어 입력"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      {loading && <p>로딩 중...</p>}
      {listData && (
        <>
          <div className="talentcate-list">
            {listData.content.map(item => (
              <TalentCategoryItem
                key={item.categoryno}
                category={item}
                onDeleted={fetchList}
                onUpdated={fetchList}
              />
            ))}
          </div>
          <div className="pagination">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className="page-btn"
                disabled={page === idx}
                onClick={() => setPage(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TalentCategoryList;