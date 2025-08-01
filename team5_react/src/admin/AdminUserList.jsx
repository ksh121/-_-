import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);  // 0부터 시작
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
   const [userReviews, setUserReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);


  const fetchUsers = async () => {
    try {
      const res = await axios.get('/user/admin/users', {
        params: {
          keyword: keyword.trim(),
          page: page,
          size: 5,
        },
      });
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('유저 목록 불러오기 실패:', err);
    }
  };
const handleDetail = async (userno) => {
  try {
    const res = await axios.get(`/user/admin/detail/${userno}`);
      setSelectedUser(res.data);
      setShowModal(true);
      setReviewPage(0);   // 리뷰 페이징 초기화
      fetchUserReviews(userno, 0);
  } catch (err) {
    alert("회원 상세정보를 불러오지 못했습니다.");
  }
};

  // 사용자 리뷰 목록 API 호출
  const fetchUserReviews = async (userno, page) => {
    try {
      const res = await axios.get(`/user/admin/${userno}/reviews`, {
        params: {
          page: page,
          size: 2,
        }
      });
      console.log(res.data)
      setUserReviews(res.data.content);
      setReviewTotalPages(res.data.totalPages);
      setReviewPage(page);
    } catch (err) {
      console.error('사용자 리뷰 불러오기 실패:', err);
      setUserReviews([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = () => {
    setPage(0); // 검색 시 첫 페이지로 초기화
    fetchUsers();
  };

  const handleEdit = (user) => {
  // 간단히 prompt로 닉네임만 변경 예시
  const newUsername = prompt('새 닉네임 입력', user.username);
  if (!newUsername) return;

  axios.put(`/user/admin/update/${user.userno}`, {
    ...user,
    username: newUsername,
  }).then(() => {
    alert('수정 완료');
    fetchUsers();
  }).catch(() => {
    alert('수정 실패');
  });
};

const handleDelete = (userno) => {
  if (!window.confirm('정말 탈퇴시키겠습니까?')) return;

  axios.patch(`/user/${userno}/deactivate`)
    .then(() => {
      alert('삭제 완료');
      fetchUsers();
    })
    .catch(() => {
      alert('삭제 실패');
    });
};

  

  return (
    <>
    {showModal && selectedUser && (
  <div style={{ background: '#fff', border: '1px solid #ccc', padding: '20px', position: 'fixed', top: '10%', left: '30%', width: '40%', zIndex: 1000 }}>
    <h3>회원 상세 정보</h3>
    <p><strong>아이디:</strong> {selectedUser.userId}</p>
    <p><strong>닉네임:</strong> {selectedUser.username}</p>
    <p><strong>이메일:</strong> {selectedUser.email}</p>
    <p><strong>학교:</strong> {selectedUser.schoolname}</p>
    <p><strong>가입일:</strong> {selectedUser.createdAt?.substring(0,10)}</p>
    <p><strong>마지막 로그인:</strong> {selectedUser.lastLoginAt}</p>
    <p><strong>신고 횟수:</strong> {selectedUser.reportCount}</p>
    <p><strong>작성 리뷰 수:</strong> {selectedUser.reviewCount}</p>
    
    <h4>🧾 최근 활동</h4>
    <ul>
      {(selectedUser.activity ?? []).map((log, idx) => (
        <li key={idx}>{log}</li>
      ))}
    </ul>
    
    <h4>📅 로그인 기록</h4>
    <ul>
      {(selectedUser.loginLog ?? []).map((log, idx) => (
        <li key={idx}>{log}</li>
      ))}
    </ul>

    <h4>📝 작성한 리뷰 목록</h4>
    {userReviews?.length > 0 ? (
      <ul>
        {userReviews.map((review) => (
          <li key={review.reviewno} style={{ marginBottom: '10px' }}>
            <strong>평점:</strong> {review.rating} / 5<br />
            <strong>내용:</strong> {review.comments}<br />
            <small>작성일: {review.createdAt?.substring(0, 10)}</small>
          </li>
        ))}
      </ul>
    ) : (
      <p>작성한 리뷰가 없습니다.</p>
    )}

    <button onClick={() => setShowModal(false)} style={{ marginTop: '10px' }}>닫기</button>

    
  </div>
)}


  <div className="flex gap-6 items-center mb-4">
  <Link to="/admin/user">
    <h2 className="text-xl font-bold hover:underline">관리자 - 사용자 목록</h2>
  </Link>
  <Link to="/admin/activity">
    <h2 className="text-xl hover:underline">활동로그 목록</h2>
  </Link>
  <Link to="/admin/report">
    <h2 className="text-xl hover:underline">신고 목록</h2>
  </Link>
</div>
     {/* 검색창 */}
  <div className="flex items-center gap-2 mb-4">
    <input
      type="text"
      placeholder="아이디 또는 닉네임 검색"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className="border rounded px-3 py-2 w-72 text-sm"
    />
    <button
      onClick={handleSearch}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
    >
      검색
    </button>
  </div>
    {/* 사용자 테이블 */}
    <div className="overflow-auto">
    <table className="min-w-full text-sm text-center border border-gray-200">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="px-3 py-2 whitespace-nowrap">번호</th>
          <th className="px-3 py-2 whitespace-nowrap">아이디</th>
          <th className="px-3 py-2 whitespace-nowrap">닉네임</th>
          <th className="px-3 py-2 whitespace-nowrap">이름</th>
          <th className="px-3 py-2 whitespace-nowrap">학교명</th>
          <th className="px-3 py-2 whitespace-nowrap">역할</th>
          <th className="px-3 py-2 whitespace-nowrap">이메일</th>
          <th className="px-3 py-2 whitespace-nowrap">탈퇴여부</th>
          <th className="px-3 py-2 whitespace-nowrap">가입일</th>
          <th className="px-3 py-2 whitespace-nowrap">관리</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan="10" className="text-center py-6 text-gray-500">
              사용자가 없습니다.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.userno} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2">{user.userno}</td>
              <td className="px-3 py-2">{user.userId}</td>
              <td className="px-3 py-2">{user.username}</td>
              <td className="px-3 py-2">{user.name}</td>
              <td className="px-3 py-2">
                {user.schoolname || <span className="text-gray-400">학교 없음</span>}
              </td>
              <td className="px-3 py-2">{user.role}</td>
              <td className="px-3 py-2">{user.email}</td>
              <td className="px-3 py-2">
                <span className={user.isDeleted ? "text-red-500 font-semibold" : "text-green-600 font-medium"}>
                  {user.isDeleted ? "탈퇴" : "정상"}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                {user.createdAt?.substring(0, 10)}
              </td>
              <td className="px-3 py-2 space-x-2">
                <button
                  onClick={() => handleDetail(user.userno)}
                  className="text-blue-600 hover:underline"
                >
                  상세
                </button>
                <button
                  onClick={() => handleDelete(user.userno)}
                  className="text-red-500 hover:underline"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    </div>
      {/* 페이지네이션 */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx)}
            style={{
              margin: '0 4px',
              padding: '6px 10px',
              backgroundColor: page === idx ? '#007bff' : '#f1f1f1',
              color: page === idx ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    
    </>
  );
}

export default AdminUserList;
