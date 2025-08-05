import React, { useState } from 'react';
import {getIP} from '../../components/Tool';


const MailFormWithFile = () => {
  const [receiver, setReceiver] = useState('testcell2014@studydesk.co.kr');
  const [from, setFrom] = useState('testcell2014@gmail.com');
  const [title, setTitle] = useState('OJT 메일을 보냅니다(첨부 파일 전송).');
  const [content, setContent] = useState('점심 메뉴 추천합니다.');
  const [files, setFiles] = useState([]);
  const [panel, setPanel] = useState('');

  const handleSend = async () => {
    setPanel('메일을 전송 중입니다...');

    const formData = new FormData();
    formData.append('receiver', receiver);
    formData.append('from', from);
    formData.append('title', title);
    formData.append('content', content);
    Array.from(files).forEach(file => {
      formData.append('file1MF', file);
    });

    try {
      const res = await fetch(`${getIP()}/mail/send_file`, {
        method: 'POST',
        body: formData
      });
      const result = await res.text();
      setPanel(result);
    } catch (err) {
      setPanel('메일 전송 실패');
    }
  };

  return (
    <div className="w-3/5 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">메일 쓰기 (첨부파일 포함)</h2>
      <input type="text" value={receiver} onChange={e => setReceiver(e.target.value)} placeholder="받는 사람" className="w-full border p-2 mb-2" />
      <input type="text" value={from} onChange={e => setFrom(e.target.value)} placeholder="보내는 사람" className="w-full border p-2 mb-2" />
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" className="w-full border p-2 mb-2" />
      <input type="file" multiple onChange={e => setFiles(e.target.files)} className="w-full border p-2 mb-2" />
      <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border p-2 h-32 mb-2" />
      <button onClick={handleSend} className="bg-green-500 text-white px-4 py-2 rounded">메일 전송</button>
      <div className="mt-4 bg-yellow-100 text-center p-2">{panel}</div>
    </div>
  );
};

export default MailFormWithFile;
