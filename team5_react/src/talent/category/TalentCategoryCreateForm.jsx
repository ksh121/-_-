import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TalentCategoryCreateForm = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [cateGrpno, setCateGrpNo] = useState('');
  const [message, setMessage] = useState('');
  const [cateGrpList, setCateGrpList] = useState([]);

  useEffect(() => {
    axios.get('/talent_cate_grp/list')
      .then(res => setCateGrpList(res.data.content))
      .catch(err => console.error('대분류 목록 조회 실패', err));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!cateGrpno) {
      setMessage('대분류를 선택하세요.');
      return;
    }

    try {
      const dto = { name, cateGrpno: Number(cateGrpno) };
      const response = await axios.post('/talent_category/save', dto);
      setMessage(`등록 성공: ${response.data.name}`);
      setName('');
      setCateGrpNo('');
      if (onCreated) onCreated();
    } catch (error) {
      console.error('등록 실패', error);
      setMessage('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="talentcate-form-box">
      <h2 className="talentcate-form-title">카테고리 소분류 등록</h2>
      <form onSubmit={handleSubmit} className="talentcate-form">
        <select
          value={cateGrpno}
          onChange={e => setCateGrpNo(e.target.value)}
          className="talentcate-input"
          required
        >
          <option value="">-- 대분류 선택 --</option>
          {cateGrpList.map(grp => (
            <option key={grp.cateGrpno} value={grp.cateGrpno}>{grp.name}</option>
          ))}
        </select>
        <input
          type="text"
          className="talentcate-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="소분류 이름 입력"
          required
        />
        <button type="submit" className="btn create-btn">등록</button>
      </form>
      {message && (
        <p className={message.includes('성공') ? 'form-message success' : 'form-message error'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default TalentCategoryCreateForm;