import React, { useState } from 'react';
import axios from 'axios';

export default function TalentCreateForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/talent_type/save', { name });
      setName('');
      setMessage('등록 성공');
      window.location.reload();
    } catch (err) {
      setMessage('등록 실패: ' + err.message);
    }
  };

  return (
    <div className="talentcate-form-box">
      <h2 className="talentcate-form-title">재능 타입 등록</h2>
      <form onSubmit={handleSubmit} className="talentcate-form">
        <input
          className="talentcate-input"
          placeholder="재능 타입 이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="btn create-btn">등록</button>
      </form>
      {message && (
        <p className={`form-message ${message.includes('성공') ? 'success' : 'error'}`}>{message}</p>
      )}
    </div>
  );
} 