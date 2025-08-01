import React from 'react';
import axios from 'axios';

export default function TalentDelete({ typeno }) {
  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/talent_type/delete/${typeno}`);
      window.location.reload();
    } catch (err) {
      alert('삭제 실패: ' + err.message);
    }
  };

  return (
    <button className="btn delete-btn" onClick={handleDelete}>삭제</button>
  );
}