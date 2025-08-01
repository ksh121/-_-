import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TalentTypeUpdate from './TalentTypeUpdate';
import TalentDelete from './TalentDelete';

export default function TalentTypeList() {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState('');

  const fetchData = async () => {
    const res = await axios.get(`/talent_type/list?keyword=${keyword}`);
    setData(res.data.content);
  };

  useEffect(() => {
    fetchData();
  }, [keyword]);

  return (
    <div>
      <input
        className="talent-search-input"
        placeholder="검색어 입력"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div className="talentcate-list">
        {data.map((item) => (
          <div className="talentcate-item" key={item.typeno}>
            <span className="item-name">{item.name}</span>
            <div className="item-actions">
              <TalentTypeUpdate typeno={item.typeno} currentName={item.name} />
              <TalentDelete typeno={item.typeno} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
