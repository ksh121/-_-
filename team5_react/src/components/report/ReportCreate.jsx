import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ReportCreate = () => {
  const [reason, setReason] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reported = searchParams.get('reported'); // 신고 대상
  const reportType = searchParams.get('type') || 'USER'; // 기본 USER
  const targetId = searchParams.get('targetId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return alert("사유를 입력하세요.");

    try {
      await axios.post('/reports', {
        reporter: null, // 백엔드에서 세션으로 처리
        reported: parseInt(reported),
        reason,
        reportType,
        targetId: targetId ? parseInt(targetId) : null,
      });
      alert("신고가 접수되었습니다.");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("신고 실패");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>🚨 사용자 신고</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>신고 사유</label><br />
          <textarea rows="6" style={{ width: '100%' }} value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <button type="submit" style={{ marginTop: 12 }}>신고 제출</button>
      </form>
    </div>
  );
};

export default ReportCreate;