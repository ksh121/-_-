// TalentCateGrpItem.jsx
import React, { useState } from 'react';
import TalentCateGrpUpdateForm from './TalentCateGrpUpdateForm';
import axios from 'axios';

const TalentCateGrpItem = ({ item, onUpdated, onDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
    const res = await axios.get(`/talent_cate_grp/check-deletable/${item.cateGrpno}`);
    const count = res.data;

    const ok = window.confirm(
      count > 0
        ? `이 대분류에는 ${count}개의 소분류가 있습니다. 모두 삭제하시겠습니까?`
        : '정말 삭제하시겠습니까?'
    );

    if (!ok) return;

    // 자식도 함께 삭제하는 요청
    await axios.delete(`/talent_cate_grp/delete/${item.cateGrpno}`);

    alert('삭제 완료');
    onDeleted();
  } catch (err) {
    console.error('삭제 중 오류', err);
    alert('삭제 실패: ' + (err.response?.data?.message || '서버 오류'));
  }
    onDeleted();
  };

  return (
    <div className="talentcate-item">
      {isEditing ? (
        <TalentCateGrpUpdateForm
          grp={item}
          onUpdated={() => {
            setIsEditing(false);
            onUpdated();
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="item-name">{item.name}</div>
          <div className="item-actions">
            <button className="btn edit-btn" onClick={() => setIsEditing(true)}>수정</button>
            <button className="btn delete-btn" onClick={handleDelete}>삭제</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TalentCateGrpItem;
