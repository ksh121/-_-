// TalentCateGrpList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TalentCateGrpItem from './TalentCateGrpItem';
import '../style/TalentCateGrp.css';

const TalentCateGrpList = ({ refresh }) => {
  const [listData, setListData] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const size = 10;
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/talent_cate_grp/list', {
        params: { keyword, page, size, sort: 'cateGrpno,desc' },
      });
      setListData(res.data);
    } catch (err) {
      alert('목록 조회 실패');
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
              <TalentCateGrpItem
                key={item.cateGrpno}
                item={item}
                onUpdated={fetchList}
                onDeleted={fetchList}
              />
            ))}
          </div>
          <div className="pagination">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                disabled={page === idx}
                onClick={() => setPage(idx)}
                className="page-btn"
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

export default TalentCateGrpList;
