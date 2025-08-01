import React from 'react';
import '../mypage/style/ChatBotList.css'

function ChatBotListItem({ data }) {
  return (
    <div className="chatbot-list-item">
      <div className="chatbot-post-content">{data.content}</div>
      <div className="chatbot-post-date">
      <small>{new Date(data.createdAt).toLocaleString()}</small>
      </div>
    </div>
  );
}

export default ChatBotListItem;
