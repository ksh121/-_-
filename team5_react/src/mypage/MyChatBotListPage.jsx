import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext';
import './style/ChatBotList.css';

function MyChatBotListPage() {
  const { loginUser } = useContext(GlobalContext);
  const [chatbotList, setChatbotList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [searchText, setSearchText] = useState('');

  const loadList = () => {
    if (!loginUser) return;

    const url = searchText.trim()
      ? `/chatbot/list/search?content=${encodeURIComponent(searchText)}&page=${page}&size=10`
      : `/chatbot/list/${loginUser.userno}?page=${page}&size=10`;

    axios.get(url)
      .then((res) => {
        setChatbotList(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error('챗봇 목록 로딩 실패', err);
      });
  };

  useEffect(() => {
    loadList();
  }, [loginUser, page, searchText]);

  const handleDelete = (chatbotno) => {
    if (!window.confirm('이 항목을 삭제할까요?')) return;

    axios
      .delete(`/chatbot/delete/${chatbotno}`)
      .then(() => {
        alert('삭제 완료');
        loadList();
      })
      .catch((err) => {
        console.error('삭제 실패', err);
      });
  };

  const handleEdit = (item) => {
    setEditingId(item.chatbotno);
    setEditContent(item.content);
  };

  const handleUpdate = () => {
    if (!editContent.trim()) return alert('내용을 입력해주세요');

    axios
      .put('/chatbot/update', {
        chatbotno: editingId,
        userno: loginUser.userno,
        content: editContent,
      })
      .then(() => {
        alert('수정 완료');
        setEditingId(null);
        setEditContent('');
        loadList();
      })
      .catch((err) => {
        console.error('수정 실패', err);
      });
  };

  return (
    <div className="chatbot-posts-box">
      <h2 className="chatbot-posts-title">내 챗봇 주요내용</h2>

      {/* 🔍 검색 입력창 */}
      <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(0); // 검색어 입력 시 페이지 초기화
          }}
          placeholder="내용으로 검색"
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
        />
      </div>

      {/* 📄 챗봇 리스트 */}
      {chatbotList.length > 0 ? (
        chatbotList.map((item) => (
          <div key={item.chatbotno} className="chatbot-post-item">
            {editingId === item.chatbotno ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px',
                    fontSize: '14px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                  }}
                />
                <div style={{ textAlign: 'right', gap: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleUpdate}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="chatbot-post-content">{item.content}</div>
                <div className="chatbot-post-date">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
                <div style={{ marginTop: '10px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(item.chatbotno)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p style={{ color: '#888', textAlign: 'center' }}>저장된 챗봇 내용이 없습니다.</p>
      )}

      {/* 📄 페이지네이션 */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            disabled={i === page}
            style={{
              margin: '0 5px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: i === page ? '#007bff' : '#fff',
              color: i === page ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MyChatBotListPage;
