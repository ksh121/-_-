import React, { useContext, useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext';

const ReviewPage = ({ talentno, receiverno }) => {
    const { userno: giverno, loginUser } = useContext(GlobalContext); // giverno는 리뷰 작성자

    // 받은 리뷰 (이제는 '이 재능 게시물에 달린 리뷰'가 됨)
    const [talentReviews, setTalentReviews] = useState([]);
    const [talentReviewPage, setTalentReviewPage] = useState(0); // 현재 페이지
    const [talentReviewTotalPages, setTalentReviewTotalPages] = useState(0); // 총 페이지 수

    // 작성한 리뷰 (이건 여전히 로그인한 사용자가 작성한 리뷰를 보여줌)
    const [givenReviews, setGivenReviews] = useState([]);

    const [reviewSummary, setReviewSummary] = useState(''); // AI 리뷰 요약 상태
    const [form, setForm] = useState({
        // receiver: receiverno, // receiver는 동적으로 가져올 것이므로 초기값 제거
        rating: '',
        comments: '',
        // talentno는 prop에서 받아와 useEffect로 동기화
    });

    // ⭐ form의 talentno를 talentno prop에 따라 업데이트
    useEffect(() => {
        setForm(prevForm => ({
            ...prevForm,
            talentno: talentno // talentno prop이 변경되면 form의 talentno도 업데이트
        }));
    }, [talentno]); // talentno prop이 바뀔 때마다 실행

    console.log("현재 로그인한 사용자(giverno):", giverno);
    console.log("리뷰 대상 재능 게시물 ID(talentno):", talentno);
   

    // ⭐⭐ 재능 게시물에 달린 리뷰 가져오기 (기존 fetchReceived 대체)
    const fetchReviewsForTalent = async (page = 0) => {
        if (!talentno) return; // talentno가 없으면 호출하지 않음
        try {
            // 새로운 API 엔드포인트 사용: /reviews/talent/{talentno}
            const res = await axios.get(`/reviews/talent/${talentno}`, {
                params: { page, size: 5 }, // 한 페이지에 5개씩

            });
          
            setTalentReviews(res.data.content); // Page 객체에서 실제 리뷰 목록은 .content에 있습니다.
            setTalentReviewTotalPages(res.data.totalPages);
            setTalentReviewPage(res.data.number);
        } catch (error) {
            console.error("재능 리뷰 가져오기 실패:", error);
        }
    };

    // 작성한 리뷰 가져오기 (기존 fetchGiven 그대로 유지)
    const fetchGiven = async () => {
        if (!giverno) return; // giverno가 없으면 호출하지 않음
        try {
            const res = await axios.get(`/reviews/giver/${giverno}`);
            setGivenReviews(res.data);
        } catch (error) {
            console.error("작성한 리뷰 가져오기 실패:", error);
        }
    };

    // ⭐⭐ 리뷰 작성 (API 엔드포인트 및 데이터 변경)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!giverno) {
            alert("리뷰를 작성하려면 로그인해야 합니다.");
            return;
        }
        if (giverno === receiverno) { // 자신의 재능 게시물에는 리뷰를 작성할 수 없도록
            alert("자신의 재능 게시물에는 리뷰를 작성할 수 없습니다.");
            return;
        }
        if (!talentno) {
            alert("리뷰할 재능 게시물 정보가 없습니다.");
            return;
        }

        const data = {
            giver: giverno, // 로그인한 사용자 ID (리뷰 작성자)
            givername: loginUser?.username, // 로그인한 사용자 이름
            receiver: receiverno, // 리뷰 대상자 (재능 판매자)
            rating: parseInt(form.rating),
            comments: form.comments,
            talentno: form.talentno // ⭐ form 상태에서 talentno 사용 (useEffect로 동기화됨)
        };

        try {
            // 새로운 리뷰 작성 API 엔드포인트 사용: /reviews/talent
            await axios.post('/reviews/talent', data);
            alert('리뷰가 성공적으로 등록되었습니다.');
            // 폼 초기화 시 talentno와 receiverno를 다시 prop에서 받아오도록
            setForm({ rating: '', comments: '', talentno: talentno });
            fetchReviewsForTalent(); // 재능 게시물 리뷰 목록 새로고침
            fetchGiven(); // 자신이 작성한 리뷰 목록 새로고침
        } catch (error) {
            console.error("리뷰 등록 실패:", error);
            alert('리뷰 등록에 실패했습니다.');
        }
    };

    // 컴포넌트 마운트 시, 또는 giverno, talentno, receiverno 변경 시 데이터 로드
    useEffect(() => {
        if (talentno) { // talentno가 유효할 때만 호출
            fetchReviewsForTalent();
        }
        if (giverno) { // giverno가 유효할 때만 호출
            fetchGiven();
        }
    }, [giverno, talentno, receiverno]); // 의존성 배열에 receiverno 추가하여 초기 폼 설정에 반영

    // talentReviews가 업데이트될 때마다 자동으로 AI 요약 요청
    useEffect(() => {
        if (talentReviews && talentReviews.length > 0) {
            const reviewComments = talentReviews.map(r => r.comments);
           console.log("🔥 [프론트엔드] axios.post 직전 talentno:", talentno, "reviewComments:", reviewComments);
            const summarizeReviews = async () => {
                try {
                  
                    const res = await axios.post('/reviews/summary/talent', {
                        talentNo: talentno, // ⭐ talentNo를 보냄 (기존 receiverNo 대신)
                        reviewComments: reviewComments
                    });
                    setReviewSummary(res.data.summary);
                } catch (error) {
                    console.error("리뷰 요약 실패:", error);
                    setReviewSummary("리뷰 요약에 실패했습니다.");
                }
            };
            summarizeReviews();
        } else if (talentReviews && talentReviews.length === 0) {
            setReviewSummary('');
        }
    }, [talentReviews, talentno]); // 의존성 배열에 talentno 추가

    // 리뷰 평점 평균 (이제 talentReviews 기준)
    const avg =
        talentReviews.length > 0
            ? (
                talentReviews.reduce((sum, r) => sum + r.rating, 0) /
                talentReviews.length
            ).toFixed(1) // 소수 1자리
            : null;

    const renderStars = (score) => {
        const max = 5;
        const filled = '★'.repeat(score); // 채워진 별
        const empty = '☆'.repeat(max - score); // 빈 별
        return (
            <span className="text-yellow-500 text-lg">
                {filled}
                <span className="text-gray-300">{empty}</span>
            </span>
        );
    };

    const StarRatingInput = ({ rating, setRating }) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={30}
                        className={`cursor-pointer ${
                            rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
        );
    };

    /* ----------------- 1. 이름 마스킹 함수 ----------------- */
    const maskName = (name = "") => {
        if (name.length <= 1) return name;
        return name[0] + "*".repeat(name.length - 1);
    };

    console.log("talentReviews:", talentReviews);

    return (
        <div className="p-6 mt-10 border-t border-gray-300">
            {/* 평균 평점 표시 */}
            {avg && (
                <div className="mb-4 text-xl font-semibold text-yellow-600">
                    ⭐ 평균 평점: {avg} / 5
                </div>
            )}

            {/* ✏️ 리뷰 작성 — 나 자신(로그인한 사용자)이 receiverno와 같지 않을 때만 표시 */}
            {giverno && giverno !== receiverno && ( // 로그인 상태 확인 및 자신에게 작성 방지
                <>
                    <h2 className="text-lg font-semibold mb-2">✏️ 리뷰 작성</h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <StarRatingInput
                            rating={form.rating}
                            setRating={(val) => setForm({ ...form, rating: val })}
                        />
                        <textarea
                            placeholder="코멘트 입력"
                            className="border p-2 w-full rounded"
                            rows={4}
                            value={form.comments}
                            onChange={(e) => setForm({ ...form, comments: e.target.value })}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            리뷰 등록
                        </button>
                    </form>
                </>
            )}

            {/* ⭐ AI 리뷰 요약 섹션 ⭐ */}
            {reviewSummary && (
                <div className="mb-6 p-4 border rounded-lg bg-indigo-50 shadow-sm mt-8">
                    <h3 className="text-md font-semibold mb-3 text-indigo-700">AI 리뷰 요약</h3>
                    <p className="text-indigo-800 whitespace-pre-wrap">{reviewSummary}</p>
                </div>
            )}

            {/* ⭐⭐ 재능 게시물에 달린 리뷰 표시 (기존 "받은 리뷰" 대체) */}
            <h2 className="text-xl font-bold mb-4 text-gray-800">💬 이 재능에 대한 리뷰</h2>
            {talentReviews.length === 0 ? (
                <p className="text-gray-500">아직 이 재능에 대한 리뷰가 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {talentReviews.map((r) => (
                        <li key={r.reviewno} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">작성자: {maskName(r.givername)}</span><br />
                                <span className="text-yellow-500 font-semibold">{renderStars(r.rating)} {r.rating}점</span>
                            </div>
                            <p className="text-gray-700">{r.comments}</p>
                            <div className="text-xs text-gray-400 mt-2">
                                {new Date(r.createdAt).toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* 페이지네이션 컨트롤 (재능 리뷰용) */}
            {talentReviewTotalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        onClick={() => fetchReviewsForTalent(talentReviewPage - 1)}
                        disabled={talentReviewPage === 0}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        이전
                    </button>
                    <span>{talentReviewPage + 1} / {talentReviewTotalPages}</span>
                    <button
                        onClick={() => fetchReviewsForTalent(talentReviewPage + 1)}
                        disabled={talentReviewPage === talentReviewTotalPages - 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            )}

            {/* 작성한 리뷰는 별도 섹션으로 유지 (필요하다면) */}
            {/* <h2 className="text-xl font-bold mb-4 mt-8 text-gray-800">✍️ 내가 작성한 리뷰</h2>
            {givenReviews.length === 0 ? (
                <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {givenReviews.map((r) => (
                        <li key={r.reviewno} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">대상: {maskName(r.receivername || 'N/A')}</span><br/>
                                <span className="text-yellow-500 font-semibold">{renderStars(r.rating)} {r.rating}점</span>
                            </div>
                            <p className="text-gray-700">{r.comments}</p>
                            <div className="text-xs text-gray-400 mt-2">
                                {new Date(r.createdAt).toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </li>
                    ))}
                </ul>
            )} */}
        </div>
    );
};

export default ReviewPage;