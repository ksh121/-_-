import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ReviewPage from '../../review/ProfileReviewPage';

function UserProfilePage() {
  const { userno } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReceived, setShowReceived] = useState(false);
  const [userTalents, setUserTalents] = useState([]);
  const [showAllTalents, setShowAllTalents] = useState(false);


  // 유저 정보 불러오기
  useEffect(() => {
    axios.get(`/user/public/detail/${userno}`)
      .then(res => setUser(res.data))
      .catch(err => console.error("프로필 조회 실패", err));
  }, [userno]);

  // 유저가 받은 리뷰
  useEffect(() => {
    axios.get(`/user/admin/${userno}/reviews`)
      .then(res => setReviews(res.data.content || []))
      .catch(err => console.error("리뷰 조회 실패", err));
  }, [userno]);

  // 유저가 작성한 게시글 목록
  useEffect(() => {
    axios.get(`/talent/user/${userno}/posts`)
      .then(res => setUserTalents(res.data || []))
      .catch(err => console.error("유저 게시물 조회 실패", err));
  }, [userno]);

  if (!user) return <div>로딩 중...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      {/* 프로필 정보 */}
      <img
        src={user.profileImage ? `/uploads/user/${user.profileImage}` : "/default_profile.png"}
        alt="프로필"
        className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
      />
      <h2 className="text-xl text-center font-bold">{user.username}</h2>
      <p className="text-center text-gray-600">{user.name} | {user.email}</p>

      {/* 작성한 게시글 */}
      <div className="mt-10">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">작성한 게시글</h3>
  {userTalents.length === 0 ? (
    <p className="text-gray-500">게시글이 없습니다.</p>
  ) : (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(showAllTalents ? userTalents : userTalents.slice(0, 3)).map(t => (
          <div
            key={t.talentno}
            onClick={() => window.location.href = `/talent/detail/${t.talentno}`}
            className="border rounded-xl shadow-sm hover:shadow-md p-4 cursor-pointer transition duration-200 bg-white"
          >
            {t.fileInfos?.[0] && (
              <img
                src={`/uploads/talent/${t.fileInfos[0].storedFileName}`}
                alt="썸네일"
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}
            <h4 className="font-semibold text-md truncate">{t.title}</h4>
            <p className="text-sm text-gray-500 mt-1">{t.cateGrpName} &gt; {t.categoryName}</p>
            <p className="text-xs text-gray-400 mt-2">조회수: {t.viewCount}</p>
          </div>
        ))}
      </div>

      {/* 🔽 더보기/접기 버튼 */}
      {userTalents.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAllTalents(!showAllTalents)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showAllTalents ? '접기' : '더보기'}
          </button>
        </div>
      )}
    </>
  )}
</div>


      {/* 리뷰 요약 / 받은 리뷰 */}
      <ReviewPage
        receiverno={user.userno}
        showForm={false}
        showReceived={showReceived}
        showSummary={!showReceived}
      />

      {/* 리뷰 토글 버튼 */}
      <div className="text-center mt-4">
        {!showReceived ? (
          <button
            onClick={() => setShowReceived(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            리뷰 자세히 보기
          </button>
        ) : (
          <button
            onClick={() => setShowReceived(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            닫기
          </button>
        )}
      </div>

      
    </div>
  );
}

export default UserProfilePage;
