import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 
import uploadFile from "../../fileupload/FileUpload";
import { GlobalContext } from "../../components/GlobalContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReviewPage from "../../review/ReviewPage";

function TalentDetailPage() {
  const { talentno } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useContext(GlobalContext);

  const [talent, setTalent] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [cateGrpList, setCateGrpList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [showReport, setShowReport] = useState(false);   // 신고 모달 on/off
  const [reportReason, setReportReason] = useState("");  // 사유 입력

  const isOwner =
    loginUser?.userno && talent?.userno && loginUser.userno === talent.userno;

  // 1️⃣ 데이터 가져오기
  useEffect(() => {
    fetch(`/talent/detail/${talentno}`)
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        return res.json();
      })
      .then((data) => {
      console.log("🎯 talent 데이터:", data); // ✅ 추가
      setTalent(data);
    })
      .catch((e) => setError(e.message));
  }, [talentno]);

  // 타입·카테고리 대분류 목록 가져오기
  useEffect(() => {
    fetch("/talent_type/list")
      .then((res) => res.json())
      .then((data) => setTypeList(data.content || []));
    fetch("/talent_cate_grp/list")
      .then((res) => res.json())
      .then((data) => setCateGrpList(data.content || []));
  }, []);

  // 대분류 변경 시 소분류 재요청
  useEffect(() => {
    if (editForm.cateGrpno) {
      fetch(`/talent_category/list-by-categrp/${editForm.cateGrpno}`)
        .then((res) => res.json())
        .then((data) => setCategoryList(data));
    } else {
      setCategoryList([]);
    }
  }, [editForm.cateGrpno]);

  /* ------------------------------------------------------------------ */
  /* 이미지 모달                                                          */
  /* ------------------------------------------------------------------ */
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  /* ------------------------------------------------------------------ */
  /* 수정 모드                                                            */
  /* ------------------------------------------------------------------ */
  const startEdit = () => {
    setEditMode(true);
    setEditForm({
      title: talent.title,
      description: talent.description,
      typeno: talent.typeno || talent.type,
      cateGrpno: talent.cateGrpno,
      categoryno: talent.categoryno || talent.category,
    });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditForm({});
    setSelectedFiles([]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const submitEdit = async () => {
    try {
      let uploadedFileData = [];
      if (selectedFiles.length > 0) {
        uploadedFileData = await uploadFile(
          selectedFiles,
          "talent",
          talent.talentno,
          loginUser.profile
        );
      }

      const dto = {
        talentno: talent.talentno,
        title: editForm.title,
        description: editForm.description,
        typeno: Number(editForm.typeno),
        categoryno: Number(editForm.categoryno),
        fileInfos: uploadedFileData,
      };

      const res = await fetch("/talent/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error("수정 실패");

      alert("수정 성공!");
      setEditMode(false);
      setEditForm({});
      setSelectedFiles([]);
      navigate(0); // 새로고침
    } catch (e) {
      alert("에러: " + e.message);
    }
  };

  /* ------------------------------------------------------------------ */
  /* 채팅, 삭제, 요청                                                     */
  /* ------------------------------------------------------------------ */
  const startChat = async () => {
  if (!loginUser) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (!talent?.userno) {
    alert("상대방 정보가 없습니다.");
    return;
  }

  try {
    const res = await axios.post("/chatroom/findOrCreate", null, {
      params: {
        senderId: loginUser.userno,
        receiverId: talent.userno, 
        talentno: talent.talentno,
        title: talent.title
      },
      withCredentials: true,
    });

    const chatRoomno = res.data.chatRoomno;
    navigate(`/chat/${chatRoomno}`);
  } catch (err) {
    console.error("❗ 채팅방 생성 오류:", err);
    alert("채팅방 오류: " + err.message);
  }
};




  //   try {
  //     const res = await fetch(
  //       `/chatroom/findOrCreate?senderId=${loginUser?.userno}&receiverId=${talent?.userno}`,
  //       {
  //         method: "POST",
  //         credentials: "include",
  //       }
  //     );

  //     if (!res.ok) throw new Error("채팅방 생성 실패");
  //     const data = await res.json();

  //     navigate(`/chatroom/${data.chatRoomno}`);
  //   } catch (e) {
  //     alert("채팅방 오류: " + e.message);
  //   }
  // };

  const deleteTalent = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/talent/delete/${talent.talentno}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 실패");
      alert("삭제 완료");
      navigate("/talent");
    } catch (e) {
      alert("에러: " + e.message);
    }
  };

  const sendRequest = async () => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      return;
    }

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

   /* ----------------------------------------------------------- */
  /* 2) 신고 제출                                                 */
  /* ----------------------------------------------------------- */
  const submitReport = async () => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!reportReason.trim()) {
      alert("신고 사유를 입력하세요.");
      return;
    }

    try {
      const res = await axios.post("/reports", {
        reporter: loginUser.userno,
        reported: talent.userno,          // 피신고자
        reason: reportReason,
        reportType,            // 타입 구분값
        targetId: talent.talentno,
      });
       if (res.status === 201) {
      alert("신고가 접수되었습니다.");
      setShowReport(false);
      setReportType("");
      setReportReason("");
      navigate('/components/main');
       }
    } catch (e) {
      if (e.response?.status === 409) {
    alert("이미 신고한 대상입니다.");
  }else {
      console.error(e);
      alert("신고 실패");
    }
  }
  };

  /* ------------------------------------------------------------------ */
  /* 렌더링                                                               */
  /* ------------------------------------------------------------------ */
  if (error) return <div className="text-center text-red-500 mt-10">오류: {error}</div>;
  if (!talent) return <div className="text-center text-gray-500 mt-10">불러오는 중...</div>;

  // 파일 중복 제거
  const uniqueFiles = talent.fileInfos
    ? [...new Map(talent.fileInfos.map((f) => [f.fileno, f])).values()]
    : [];

  // 슬라이더 옵션
  const sliderSettings = {
    dots: false,
    arrows: uniqueFiles.length > 1,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setSlideIndex(index),
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-md my-20 ">
      {editMode ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-blue-600">재능 수정</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              name="title"
              value={editForm.title || ""}
              onChange={handleEditChange}
              placeholder="제목"
              className="w-full p-3 border border-gray-300 rounded"
            />
            <textarea
              name="description"
              value={editForm.description || ""}
              onChange={handleEditChange}
              placeholder="설명"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded"
            />
            <select
              name="typeno"
              value={editForm.typeno || ""}
              onChange={handleEditChange}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="">타입 선택</option>
              {typeList.map((type) => (
                <option key={type.typeno} value={type.typeno}>  
                  {type.name}
                </option>
              ))}
            </select>
            <select
              name="cateGrpno"
              value={editForm.cateGrpno || ""}
              onChange={handleEditChange}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="">대분류 선택</option>
              {cateGrpList.map((grp) => (
                <option key={grp.cateGrpno} value={grp.cateGrpno}>
                  {grp.name}
                </option>
              ))}
            </select>
            <select
              name="categoryno"
              value={editForm.categoryno || ""}
              onChange={handleEditChange}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="">소분류 선택</option>
              {categoryList.map((cat) => (
                <option key={cat.categoryno} value={cat.categoryno}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input type="file" multiple onChange={handleFileChange} className="w-full" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
              onClick={submitEdit}
            >
              저장
            </button>
            <button
              className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 shadow"
              onClick={cancelEdit}
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 카테고리 & 조회수 */}
          <div className="flex justify-between items-center mb-4">
            <div className="inline-block bg-gray-200 text-xs text-gray-600 px-3 py-1 rounded-full">
              {talent.cateGrpName} &gt; {talent.categoryName}
            </div>
            <div className="text-xs text-gray-500">조회수: {talent.viewCount}</div>
          </div>

          {/* 이미지 */}
          {uniqueFiles.length === 1 ? (
            <img
              src={`/uploads/talent/${uniqueFiles[0].storedFileName}`}
              alt={uniqueFiles[0].originalFileName}
              onClick={() =>
                handleImageClick(`/uploads/talent/${uniqueFiles[0].storedFileName}`)
              }
              className="mb-4 rounded-xl shadow-lg w-full md:w-[600px] h-[300px] object-contain mx-auto cursor-pointer"
            />
          ) : (
            <>
              <Slider {...sliderSettings} className="max-w-[400px] h-auto mx-auto object-contain">
                {uniqueFiles.map((file) => (
                  <img
                    key={file.fileno}
                    src={`/uploads/talent/${file.storedFileName}`}
                    alt={file.originalFileName}
                    onClick={() =>
                      handleImageClick(`/uploads/talent/${file.storedFileName}`)
                    }
                    className="max-w-[400px] h-auto mx-auto object-contain cursor-pointer"
                  />
                ))}
              </Slider>
              <div className="text-center text-xs text-gray-500 mb-4">
                {slideIndex + 1} / {uniqueFiles.length}
              </div>
            </>
          )}

          {/* 이미지 모달 */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="크게보기"
                  className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full shadow"
                >
                  ✕
                </button>
              </div>
              <div onClick={closeModal} className="absolute inset-0"></div>
            </div>
          )}

          {/* 제목 & 설명 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{talent.title}</h1>

          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-gray-700 leading-relaxed">
            {talent.description}
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3">
            {!isOwner && (
              <>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
                onClick={startChat}
              >
                채팅하기
              </button>
            
            {/** 신고 버튼 */}
            <button
              className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow"
              onClick={() => setShowReport(true)}
            >
              신고
            </button>
            </>
            )}
            {isOwner && (
              <>
                <div
                  className="px-3 py-1 bg-gray-100 text-black rounded hover:bg-gray-150 shadow"
                  onClick={startEdit}
                >
                  수정
                </div>
                <div
                  className="px-3 py-1 bg-gray-100 text-black rounded hover:bg-gray-150 shadow"
                  onClick={deleteTalent}
                >
                  삭제
                </div>
              </>
            )}
             
            {/* 요청 버튼 */}
            {/* <button
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
              onClick={sendRequest}
            >
              요청
            </button> */}
          </div>
          {/** 신고 모달 */}
      {showReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">🚨 신고하기</h3>

            <label className="block mb-2 font-semibold">신고 유형</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="">-- 선택하세요 --</option>
              <option value="욕설/비방">욕설/비방</option>
              <option value="광고/홍보">광고/홍보</option>
              <option value="음란/선정성">음란/선정성</option>
              <option value="사기/허위">사기/허위</option>
              <option value="중복/도배">중복/도배</option>
              <option value="기타">기타</option>
            </select>

            <label className="block mb-2 font-semibold">신고 사유</label>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows="5"
              placeholder="신고 사유를 입력하세요."
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReport(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                취소
              </button>
              <button
                onClick={submitReport}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                제출
              </button>
            </div>

            {/* 모달 바깥 클릭 닫기 */}
            <button
              onClick={() => setShowReport(false)}
              className="absolute top-2 right-2 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

          {/* 리뷰 페이지 */}
          <ReviewPage receiverno={talent?.userno} />
        </>
      )}
    </div>
    
  );
  
}


export default TalentDetailPage;
