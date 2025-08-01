// src/components/Search/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ searchQuery, onChange, onKeyDown }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ textAlign: 'left', marginBottom: '10px' }}>
        마이페이지 > 내 게시물
      </div>
      <div style={{ position: 'relative' }}>
        <Search
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            zIndex: 1
          }}
          size={20}
        />
        <input
          type="text"
          placeholder="게시물을 검색하세요..."
          value={searchQuery}
          onChange={onChange}
          onKeyDown={onKeyDown}
          style={{
            width: '100%',
            padding: '15px 20px 15px 50px',
            border: '2px solid #e1e5e9',
            borderRadius: '10px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.3s',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
        />
      </div>
    </div>
  );
}

export default SearchBar