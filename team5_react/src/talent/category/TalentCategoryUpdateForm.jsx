import React, { useState } from 'react';
import axios from 'axios';

const TalentCategoryUpdateForm = ({ category, onUpdated, onCancel }) => {
  const [name, setName] = useState(category.name);
  const [message, setMessage] = useState('');

  const handleUpdate = async e => {
    e.preventDefault();

    try {
      const dto = {
        categoryno: category.categoryno,
        name,
        cateGrpno: category.cateGrp.cateGrpno
      };

      await axios.put('/talent_category/update', dto);
      setMessage('수정 완료');
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('수정 실패', err);
      setMessage('수정 중 오류 발생');
    }
  };

  return (
    <form onSubmit={handleUpdate} className="talentcate-form">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        className="talentcate-input"
        required
      />
      <div className="form-btn-group">
        <button type="submit" className="btn edit-btn">저장</button>
        <button type="button" onClick={onCancel} className="btn delete-btn">취소</button>
      </div>
      {message && (
        <p className={message.includes('완료') ? 'form-message success' : 'form-message error'}>
          {message}
        </p>
      )}
    </form>
  );
};

export default TalentCategoryUpdateForm;