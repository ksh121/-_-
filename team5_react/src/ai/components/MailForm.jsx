import React, { useState } from 'react';
import {getIP} from '../../components/Tool';

const MailForm = () => {
  const [receiver, setReceiver] = useState('koko5648@naver.com');
  const [from, setFrom] = useState('heeyk5648@gmail.com');
  const [title, setTitle] = useState('OJT 메일을 보냅니다. IP: 168');
  const [content, setContent] = useState('오늘 저녁에 많은 눈 예상');
  const [panel, setPanel] = useState('');

  const handleSend = async () => {
    setPanel("메일을 전송 중입니다...");
    try {
      const response = await fetch(`${getIP()}/mail/send_json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver, from, title, content }),
      });

      const result = await response.text();
      setPanel(result);
    } catch (err) {
      setPanel("메일 전송 실패");
    }
  };

  return (
    <div className="w-2/5 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">메일 쓰기</h2>
      <div className="mb-2">
        <label>받는 사람</label>
        <input type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)} className="w-full border p-2" />
      </div>
      <div className="mb-2">
        <label>보내는 사람</label>
        <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border p-2" />
      </div>
      <div className="mb-2">
        <label>제목</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2" />
      </div>
      <div className="mb-2">
        <label>내용</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border p-2 h-32" />
      </div>
      <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">보내기</button>
      <div className="mt-4 bg-yellow-100 text-center p-2">{panel}</div>
    </div>
  );
};

export default MailForm;
