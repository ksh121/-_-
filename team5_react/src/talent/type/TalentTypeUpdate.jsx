import React, { useState } from 'react';
import axios from 'axios';

export default function TalentTypeUpdate({ typeno, currentName }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(currentName);

  const handleUpdate = async () => {
    try {
      await axios.put('/talent_type/update', { typeno, name });
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      alert('수정 실패: ' + err.message);
    }
  };

  return editMode ? (
    <div className="form-btn-group">
      <input
        className="talentcate-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn edit-btn" onClick={handleUpdate}>저장</button>
      <button className="btn delete-btn" onClick={() => setEditMode(false)}>취소</button>
    </div>
  ) : (
    <button className="btn edit-btn" onClick={() => setEditMode(true)}>수정</button>
  );
}