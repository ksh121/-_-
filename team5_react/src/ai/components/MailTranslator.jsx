import React, { useState } from 'react';
import { getLlmAPI, getIP } from '../../components/Tool';

const MailTranslator = () => {
  const [titleSrc, setTitleSrc] = useState('주문해주셔서 감사합니다.');
  const [contentSrc, setContentSrc] = useState(`주문해주셔서 감사합니다!
주문하신 내역은 다음과 같습니다.
자세한 사항은 나의 주문>전체주문내역 에서 확인하실 수 있습니다.        
도서명: 'ChatAPI 활용'
가격: 25,000 원
결재 방법: 신용 카드`);
  const [language, setLanguage] = useState('한글');
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [panelMessage, setPanelMessage] = useState('');
  const [receiver, setReceiver] = useState('testcell2014@studydesk.co.kr');
  const [from, setFrom] = useState("testcell2014@gmail.com");


  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getLlmAPI()}/mail_translator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          SpringBoot_FastAPI_KEY: '1234',
          title: titleSrc,
          content: contentSrc,
          language: language
        })
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        setTranslatedTitle(data.res.title);
        setTranslatedContent(data.res.content);
      } else {
        const text = await response.text();
        alert('오류 응답: ' + text);
      }
    } catch (err) {
      console.error('요청 실패:', err);
      alert('서버 요청 중 오류 발생');
    }
    setLoading(false);
  };

  const handleSend = async () => {
  setPanelMessage("메일을 전송 중입니다...");

  try {
    const response = await fetch(`${getIP()}/mail/send_json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        receiver,
        from,
        title: translatedTitle,
        content: translatedContent
      })
    });

    if (response.ok) {
      const text = await response.text();
      setPanelMessage(text); // "메일 전송 완료"
    } else {
      const errText = await response.text();
      setPanelMessage("전송 실패: " + errText);
    }
  } catch (err) {
    console.error("메일 전송 에러:", err);
    setPanelMessage("메일 전송 중 오류 발생");
  }
};


  return (
    <div className="w-4/5 mx-auto text-center mt-10">
      <div className="w-4/5 mx-auto">
        <h3 className="text-xl font-semibold mb-6">메일 쓰기 (번역 지원)</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="수신자 이메일"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="발신자 이메일"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <input
          type="text"
          placeholder="제목"
          value={titleSrc}
          onChange={(e) => setTitleSrc(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        <textarea
          value={contentSrc}
          onChange={(e) => setContentSrc(e.target.value)}
          className="border rounded p-3 w-full h-40 mb-4"
        />

        <div className="flex justify-center items-center mb-4 space-x-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="한글">한글</option>
            <option value="영어">영어</option>
            <option value="일본어">일본어</option>
            <option value="프랑스어">프랑스어</option>
          </select>
          <button
            onClick={handleTranslate}
            className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
          >
            번역하기
          </button>
          {loading && (
            <span className="text-gray-500 text-sm">번역중...</span>
          )}
        </div>

        <input
          type="text"
          placeholder="번역된 제목"
          value={translatedTitle}
          readOnly
          className="border rounded px-3 py-2 w-full mb-4"
        />

        <textarea
          value={translatedContent}
          readOnly
          className="border rounded p-3 w-full h-40 mb-4"
        />

        <button
          className="bg-green-600 text-white px-6 py-2 rounded"
          onClick={handleSend}
        >
          번역된 내용 메일 전송
        </button>

        <div className="mt-4 bg-yellow-100 text-gray-800 p-2 rounded w-2/5 mx-auto">
          {panelMessage}
        </div>
      </div>
    </div>
  );
};

export default MailTranslator;
