import React, { useState, useContext, useEffect, useRef } from 'react';
import { GlobalContext } from '../components/GlobalContext';
// import Select from 'react-select';


function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translateLang, setTranslateLang] = useState(''); // ✅ 번역 언어 상태
  const { loginUser } = useContext(GlobalContext);
  const bottomRef = useRef(null);

  const faqList = [
    '분야별로 전문가를 어떻게 찾아요?',
    '견적은 어떻게 요청하면 돼요?',
    '견적 요청하면 돈 들어요?',
    '전문가 리뷰는 어디서 볼 수 있나요?',
    '전문가 프로필은 어떻게 등록해요?',
  ];

  const translateOptions = [
    { value: '', label: '번역 끄기' },
    { value: '영어', label: '영어' },
    { value: '일본어', label: '일본어' },
    { value: '중국어', label: '중국어' },
    { value: '불어', label: '불어' },
  ];

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFAQClick = async (question) => {
    setMessages((prev) => [...prev, { from: 'user', text: question }]);
    setIsLoading(true);

    const res = await fetch('http://192.168.12.141:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: question,
        userno: loginUser?.userno,
        source: 'faq',
      }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { from: 'bot', text: data.res }]);
    setIsLoading(false);
  };

  const sendMessage = async () => {
  if (!input.trim()) return;

  setMessages((prev) => [...prev, { from: 'user', text: input }]);
  setIsLoading(true);

  const payload = translateLang
    ? {
        message: input.trim(),
        lang: translateLang,
        age: 20,
        userno: loginUser?.userno,
        mode: 'translate', // ✅ 힌트 주기
      }
    : {
        message: input.trim(),
        userno: loginUser?.userno,
      };

  const res = await fetch('http://192.168.12.141:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  setMessages((prev) => [...prev, { from: 'bot', text: data.res }]);
  setInput('');
  setIsLoading(false);
};


  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = `
안녕하세요! 👋 무엇을 도와드릴까요?

📅 예약: "8월 5일 오후 3시에 공학101호 예약해줘"
🤖 도우미: "유용한 도우미예요! 궁금한 건 뭐든 물어보세요."
🌐 번역: 하단 왼쪽 번역 메뉴에서 언어를 선택하면 번역 모드로 전환돼요!
      - '번역 끄기'를 선택하면 일반 챗봇 모드로 돌아갑니다.

💬 질문이 있으신가요? 상단의 자주 묻는 질문을 확인해보세요!
      `.trim();
      setMessages([{ from: 'bot', text: welcomeMessage }]);
    }
  }, [isOpen]);

  return (
    <>
      <button
        className="fixed bottom-5 right-5 w-[60px] h-[60px] rounded-full bg-blue-600 text-white text-2xl shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-[100px] right-5 w-[400px] h-[520px] bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col z-50">
          <div className="px-3 pt-3 border-b border-gray-200">
            <button
              className="text-sm text-blue-600 underline"
              onClick={() => setShowFAQ(!showFAQ)}
            >
              {showFAQ ? '자주 묻는 질문 닫기 ▲' : '자주 묻는 질문 보기 ▼'}
            </button>

            {showFAQ && (
              <div className="mt-2 flex flex-wrap gap-2 pb-2">
                {faqList.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFAQClick(faq)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {faq}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 text-sm space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`text-${msg.from === 'user' ? 'right' : 'left'}`}>
                <span
                  className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] break-words whitespace-pre-wrap ${
                    msg.from === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-100 text-gray-800 mr-auto'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="text-left">
                <span className="inline-block px-4 py-2 rounded-2xl bg-gray-100 text-gray-500 text-sm">
                  답변을 준비하고 있어요... ⏳
                </span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              {/* ✅ 드롭다운을 감싸는 relative 박스 */}
              <div className="relative w-[100px]">
               <select
                value={translateLang}
                onChange={(e) => setTranslateLang(e.target.value)}
                className="w-full text-sm appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-md bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {translateOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>


                <div className="pointer-events-none absolute right-2 top-2.5 text-gray-500 text-xs">
                  ▼
                </div>
              </div>

              {/* ✅ 입력창 */}
              <input
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="무엇이든 물어보세요!"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
              />

              {/* ✅ 전송 버튼 */}
              <button
                onClick={sendMessage}
                className="h-[38px] px-4 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
