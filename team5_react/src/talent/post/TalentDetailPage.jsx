import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import { GlobalContext } from "../../components/GlobalContext";
import { BadgeDollarSign } from "lucide-react";
import ReviewPage from "../../review/ReviewPage";
import TalentProfileCard from "../../user/profile/TalentProfileCard"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function TalentDetailPage() {
  const { talentno } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useContext(GlobalContext);

  const [talent, setTalent] = useState(null);
  const [error, setError] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportReason, setReportReason] = useState("");

  const isOwner = Number(loginUser?.userno) === Number(talent?.userno);


  useEffect(() => {
    fetch(`/talent/detail/${talentno}`)
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        return res.json();
      })
      .then((data) => setTalent(data))
      .catch((e) => setError(e.message));
  }, [talentno]);

  const uniqueFiles = talent?.fileInfos
    ? [...new Map(talent.fileInfos.map((f) => [f.storedFileName, f])).values()]
    : [];

  const sliderSettings = {
    dots: false,
    arrows: uniqueFiles.length > 1,
    infinite: uniqueFiles.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setSlideIndex(index),
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const startChat = async () => {
  if (!loginUser) return alert("로그인이 필요합니다.");
  if (!talent?.userno) return alert("상대방 정보가 없습니다.");

  try {
    const res = await axios.post("/chatroom/findOrCreate", null, {
      params: {
        senderId: loginUser.userno,
        receiverId: talent.userno,
        talentno: talent.talentno,
        title: talent.title,
      },
      withCredentials: true,
    });
    const roomId = res.data.chatRoomno;
    await axios.post(`/chatroom/${roomId}/enter/${loginUser.userno}`);
    navigate(`/chat/${roomId}`);
  } catch (err) {
    alert("채팅방 오류: " + err.message);
  }
};
  useEffect(() => {
  console.log("🔥 talent 객체 확인:", talent);
}, [talent]);


  const deleteTalent = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/talent/delete/${talent.talentno}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 실패");
      alert("삭제 완료");
      navigate("/components/main");
    } catch (e) {
      alert("에러: " + e.message);
    }
  };

  const sendRequest = async () => {
    if (!loginUser) return alert("로그인이 필요합니다.");
    const dto = {
      talentno: talent.talentno,
      giverno: loginUser.userno,
      receiverno: talent.userno,
      status: "pending",
      message: "재능 요청합니다.",
    };
    try {
      await fetch("/request/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      alert("요청 성공!");
    } catch (e) {
      alert("요청 실패: " + e.message);
    }
  };

  const submitReport = async () => {
    if (!loginUser) return alert("로그인이 필요합니다.");
    if (!reportReason.trim()) return alert("신고 사유를 입력하세요.");
    try {
      const res = await axios.post("/reports", {
        reporter: loginUser.userno,
        reported: talent.userno,
        reason: reportReason,
        reportType,
        targetId: talent.talentno,
      });
      if (res.status === 201) {
        alert("신고가 접수되었습니다.");
        setShowReport(false);
        setReportType("");
        setReportReason("");
        navigate("/components/main");
      }
    } catch (e) {
      if (e.response?.status === 409) {
        alert("이미 신고한 대상입니다.");
      } else {
        alert("신고 실패");
      }
    }
  };

  if (error) return <div className="text-center text-red-500">오류: {error}</div>;
  if (!talent) return <div className="text-center text-gray-500">불러오는 중...</div>;

  return (
  <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
    {/* 상단 콘텐츠: 이미지 + 내용 + 프로필 */}
    <div className="flex gap-12">
      
      {/* 왼쪽 콘텐츠 영역 */}
      <div className="flex-1">
        {/* 상단 카테고리 & 조회수 */}
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <div>{talent.cateGrpName} &gt; {talent.categoryName}</div>
          <div>조회수 {talent.viewCount}</div>
        </div>

        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-4">{talent.title}</h1>

        {/* 가격 정보  */}
        <div className="text-right mb-4">
  <span className="inline-flex items-center gap-1 text-gray-800 text-xl font-semibold bg-gray-100 px-4 py-1 rounded-full shadow-sm">
    <BadgeDollarSign className="w-5 h-5 text-gray-600" />
    {Number(talent.price).toLocaleString()} 원
  </span>
</div>

        {/* 이미지 + 설명+버튼 */}
          <div className="grid grid-cols-[420px_1fr] gap-6 items-start w-full">
            {/* 이미지 */}
            <div className="w-[420px] aspect-[4/3]">
              {uniqueFiles.length === 1 ? (
                <img
                  src={`/uploads/talent/${uniqueFiles[0].storedFileName}`}
                  alt={uniqueFiles[0].originalFileName}
                  onClick={() =>
                    handleImageClick(`/uploads/talent/${uniqueFiles[0].storedFileName}`)
                  }
                  className="w-full h-full object-cover rounded-xl cursor-pointer"
                />
              ) : (
                <Slider {...sliderSettings}>
                  {uniqueFiles.map((file) => (
                    <img
                      key={file.fileno || file.storedFileName}
                      src={`/uploads/talent/${file.storedFileName}`}
                      alt={file.originalFileName}
                      onClick={() =>
                        handleImageClick(`/uploads/talent/${file.storedFileName}`)
                      }
                      className="w-full h-full object-cover rounded-xl cursor-pointer"
                    />
                  ))}
                </Slider>
              )}
            </div>

            {/* 설명 + 버튼 전체를 자연스럽게 왼쪽 정렬 + 하단 배치 */}
          {/* 설명 + 버튼 전체를 자연스럽게 왼쪽 정렬 + 하단 배치 */}
          <div className="w-full flex flex-col h-full">
            <p className="text-gray-800 whitespace-pre-wrap text-base leading-relaxed">
              {talent.description}
            </p>

            <div className="mt-auto pt-4 flex gap-3">
              {!isOwner ? (
                <>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={startChat}
                  >
                    💬 채팅
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => setShowReport(true)}
                  >
                    🚨 신고
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    onClick={() => navigate(`/talent/update/${talent.talentno}`)}
                  >
                    ✏️ 수정
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    onClick={deleteTalent}
                  >
                    🗑️ 삭제
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>     
    </div>

    {/* 하단 리뷰 */}
    <div className="mt-10">
      <ReviewPage talentno={Number(talentno)} receiverno={talent?.userno} />
    </div>
    {/* 오른쪽 프로필 카드 */}
    <div className="w-[280px] shrink-0">
        <TalentProfileCard
          talent={talent}
          isOwner={isOwner}
          startChat={startChat}
          sendRequest={sendRequest}
        />
      </div>
  </div>
);


}

export default TalentDetailPage;
