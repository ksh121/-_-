import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../components/GlobalContext';
import ReviewPage from '../../review/ProfileCardReviewPage'; // ⭐ 리뷰 요약 컴포넌트 사용

const ChatProfileCard = () => {
  const { loginUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [talentCount, setTalentCount] = useState(0);

  const userno = loginUser?.userno;

  useEffect(() => {
    if (!userno) return;

    axios.get(`/talent/count-by-user?userno=${userno}`)
      .then(res => {
        console.log('-> data: ', res.data);
        setTalentCount(res.data)})
      .catch(err => console.error("게시물 수 조회 실패", err));
  }, [userno]);

  if (!loginUser) return null;

  return (
    <div className="mb-4 p-3 rounded-lg bg-gray-50 shadow-sm text-sm">
      <div
        className="flex items-center mt-3 gap-6 cursor-pointer"
        onClick={() => navigate(`/profile/${userno}`)}
      >
        <img
          src={loginUser.profileImage
            ? `/uploads/user/${loginUser.profileImage}`
            : '/default_profile.png'}
          alt="프로필"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{loginUser?.username}</p>
          <p className="text-gray-500 text-xs">{loginUser.email}</p>
        </div>
      </div>

      <div className="mt-3 text-gray-700 space-y-1">
        <p className='mb-4'>📌 게시물: <span className="font-semibold">{talentCount}</span>개</p>

        {/* 리뷰 요약 삽입 */}
        <ReviewPage
          receiverno={userno}
          showForm={false}
          showReceived={false}
          showSummary={false}
        />
      </div>
    </div>
  );
};

export default ChatProfileCard;
