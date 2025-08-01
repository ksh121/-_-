import React, { useState } from 'react';
import axios from 'axios';
import '../style/TalentCateGrp.css';

const TalentCateGrpCreateForm = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const dto = { name };
      const res = await axios.post('/talent_cate_grp/save', dto);
      setMessage(`등록 성공: ${res.data.name}`);
      setName('');
      setError(false);
      onCreated();
    } catch (err) {
      console.error('등록 실패', err);
      setMessage('등록 중 오류가 발생했습니다.');
      setError(true);
    }
  };

  return (
    <div className="talentcate-form-box">
      <h2 className="talentcate-form-title">카테고리 대분류 등록</h2>
      <form onSubmit={handleSubmit} className="talentcate-form">
        <input
          type="text"
          className="talentcate-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="대분류 이름 입력"
          required
        />
        <button type="submit" className="btn create-btn">등록</button>
      </form>
      {message && (
        <p className={error ? 'form-message error' : 'form-message success'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default TalentCateGrpCreateForm;
