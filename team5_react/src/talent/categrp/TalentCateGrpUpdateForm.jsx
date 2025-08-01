import React, { useState } from 'react';
import axios from 'axios';
import '../style/TalentCateGrp.css';

const TalentCateGrpUpdateForm = ({ grp, onUpdated, onCancel }) => {
  const [name, setName] = useState(grp.name);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      const dto = { cateGrpno: grp.cateGrpno, name };
      await axios.put('/talent_cate_grp/update', dto);
      setMessage('수정 완료');
      setError(false);
      onUpdated();
    } catch (error) {
      console.error('수정 실패', error);
      setMessage('수정 중 오류');
      setError(true);
    }
  };

  return (
    <div className="talentcate-form-box">
      <h2 className="talentcate-form-title">카테고리 수정</h2>
      <form onSubmit={handleUpdate} className="talentcate-form">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="talentcate-input"
          placeholder="대분류 이름 수정"
          required
        />
        <div className="form-btn-group">
          <button type="submit" className="btn edit-btn">저장</button>
          <button type="button" onClick={onCancel} className="btn delete-btn">취소</button>
        </div>
      </form>
      {message && (
        <p className={error ? 'form-message error' : 'form-message success'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default TalentCateGrpUpdateForm;
