import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from '../../components/GlobalContext';
//import ReviewPage from '../../review/ProfileReviewPage';
import ProfileReviewPage from '../../review/ProfileReviewPage';
import ReviewPage from '../../review/ProfileCardReviewPage';

function TalentProfileCard({ talent, isOwner, startChat, sendRequest }) {
  const { loginUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [talentCount, setTalentCount] = useState(0);
  

  const userData = isOwner ? loginUser : talent; // ⭐ 내가 작성자면 최신 loginUser 사용
  const userno = userData?.userno; 

  // 작성자의 게시물 개수
  useEffect(() => {
  if (!userno) return;

  axios.get(`/talent/count-by-user?userno=${userno}`)
    .then(res => {
      console.log('-> 게시물 개수 : ', res.data);
      setTalentCount(res.data)})
    .catch(err => console.error("게시물 수 조회 실패", err));
}, [userno]);


  // 작성한 리뷰 목록
  useEffect(() => {
    axios.get(`/user/admin/${userno}/reviews`)
      .then(res => {
        console.log("✅ 리뷰 응답 확인:", res.data.content);
        setReviews(res.data.content); // 🔹 리뷰 리스트만 추출
      })
      .catch(err => console.error("리뷰 조회 실패", err));
  }, [userno]);
  

  return (
  <div className="hidden lg:block fixed right-20 top-32 w-72 p-4 border border-gray-200 rounded-xl shadow-md bg-white z-40">
    <div className="flex flex-col items-center">
      <div
        className="cursor-pointer py-4 px-10 transition-transform duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-lg bg-white p-4"
        onClick={() => navigate(`/profile/${userData.userno}`)}
      >
        <img
          src={userData?.profileImage
            ? `/uploads/user/${userData.profileImage}`
            : "/default_profile.png"}
          alt="프로필"
          className="w-24 h-24 rounded-full object-cover mb-3"
        />

        <h2 className="text-lg font-semibold">{userData?.userName}</h2>
        <p className="text-sm text-gray-500">{userData?.name}</p>
        <p className="text-sm text-gray-500">{userData?.email}</p>

        {/* ⭐ 리뷰 컴포넌트 삽입 */}
        {/* <ProfileReviewPage 
            receiverno={userno}
            showForm ={false}  // 받은 리뷰
            showReceived ={false}      // 리뷰 작성 폼
            showSummary={true}    // 리뷰 요약
        /> */}
        {/* ✅ 게시물 수 표시 */}
        <p className="text-sm text-gray-500 mt-1">
          작성한 게시물: <span className="font-medium text-gray-700">{talentCount}</span>개
        </p>
      </div>

      {/* ⭐ 리뷰 컴포넌트 */}
      <div className="-mt-9"> 
      <ReviewPage 
        receiverno={userno}
        showForm={false}
        showReceived={false}
        showSummary={true}
      />
      </div>

      {!isOwner && (
        <div className="mt-4 flex flex-col gap-2 w-full">
          <button onClick={startChat} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            💬 채팅
          </button>
        </div>
      )}
    </div>
  </div>
);

}



export default TalentProfileCard;