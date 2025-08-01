import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

function AdminActivityList() {
    const [activityLogs, setActivityLogs] = useState([]);
    const [page, setPage] = useState(0); // 0-indexed page
    const [totalPages, setTotalPages] = useState(0);
    const size = 10; // 한 페이지에 표시할 활동 로그 수

    // ✅ action 필터링을 위한 상태 추가
    const [actionFilter, setActionFilter] = useState("ALL"); 
    // 실제 서비스에서 사용될 액션 타입들을 정의 (예시)
    const actionTypes = ["ALL", "LOGIN", "LOGOUT", "REPORT", "POST_CREATE", "COMMENT_ADD"]; 

    // --- 활동 로그 데이터 가져오기 ---
    const fetchActivityLogs = async () => {
        try {
            const params = {
                page: page,
                size: size,
                sort: 'createdAt,desc', // 생성일 기준 내림차순 정렬
            };

            // ✅ actionFilter가 "ALL"이 아니면 파라미터에 추가
            if (actionFilter !== "ALL") {
                params.action = actionFilter;
            }

            const res = await axios.get('/activityLog/admin/all', { params });
            
            console.log("활동 로그 데이터:", res.data);
            setActivityLogs(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (err) {
            console.error('활동 로그 목록 불러오기 실패:', err);
            setActivityLogs([]);
            setTotalPages(0);
        }
    };

    // `actionFilter` 또는 `page` 상태가 변경될 때마다 활동 로그 재호출
    useEffect(() => {
        fetchActivityLogs();
    }, [actionFilter, page]);

    // --- UI 렌더링 ---
    return (
        <div className="bg-white p-6 rounded-md shadow-md">
            <div className="flex gap-6 items-center mb-4">
              <Link to="/admin/user">
                <h2 className="text-xl  hover:underline">관리자 - 사용자 목록</h2>
              </Link>
              <Link to="/admin/activity">
                <h2 className="text-xl font-bold hover:underline">활동로그 목록</h2>
              </Link>
              <Link to="/admin/report">
                <h2 className="text-xl hover:underline">신고 목록</h2>
              </Link>
            </div>

            {/* ✅ 액션 필터 드롭다운 */}
            <div className="flex items-center gap-4 mb-4">
                <select
                    value={actionFilter}
                    onChange={(e) => {
                        setPage(0); // 필터 변경 시 첫 페이지로 초기화
                        setActionFilter(e.target.value);
                    }}
                    className="border rounded p-2 text-sm"
                >
                    {actionTypes.map(type => (
                        <option key={type} value={type}>
                            {type === "ALL" ? "전체 액션" : type}
                        </option>
                    ))}
                </select>
            </div>

            {/* 활동 로그 테이블 */}
            <div className="overflow-auto">
                <table className="min-w-full text-sm text-center border border-gray-200">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="px-3 py-2 whitespace-nowrap">로그 번호</th>
                            <th className="px-3 py-2 whitespace-nowrap">사용자 번호</th>
                            <th className="px-3 py-2 whitespace-nowrap">액션</th>
                            <th className="px-3 py-2">상세 정보</th>
                            <th className="px-3 py-2">생성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activityLogs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    활동 로그가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            activityLogs.map((log) => (
                                <tr key={log.actlogno} className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2">{log.actlogno}</td>
                                    {/* `userno`가 없을 경우 'N/A' 표시 또는 사용자 상세 정보 링크 등 */}
                                    <td className="px-3 py-2">{log.userno || 'N/A'}</td>
                                    <td className="px-3 py-2">{log.action}</td>
                                    <td className="px-3 py-2 text-left">
                                        <div style={{
                                            maxWidth: '300px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }} title={log.detail}>
                                            {log.detail}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

             {/* --- 페이징 버튼 개선 --- */}
            {totalPages > 0 && ( // totalPages가 0보다 클 때만 페이징 표시
                <div className="mt-4 flex justify-center gap-1">
                    {/* 이전 페이지 버튼 */}
                    <button
                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className={`px-3 py-1 rounded text-sm ${
                            page === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        이전
                    </button>

                    {/* 페이지 번호들 */}
                    {Array.from({ length: totalPages }, (_, i) => i)
                         .filter(pIdx => 
                             (pIdx >= page - 2 && pIdx <= page + 2) || // 현재 페이지 기준 좌우 2개
                             pIdx === 0 || // 항상 첫 페이지
                             pIdx === totalPages - 1 // 항상 마지막 페이지
                         )
                         .sort((a, b) => a - b) // 정렬
                         .reduce((acc, pIdx, index, arr) => {
                             // 생략 지점 추가 (예: 1 ... 4 5 6 ... 10)
                             if (index > 0 && pIdx > arr[index - 1] + 1) {
                                 acc.push(
                                     <span key={`dots-${pIdx}`} className="px-1 py-1 text-sm text-gray-500">
                                         ...
                                     </span>
                                 );
                             }
                             acc.push(
                                 <button
                                     key={pIdx}
                                     onClick={() => setPage(pIdx)}
                                     className={`px-3 py-1 rounded text-sm ${
                                         pIdx === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                     }`}
                                 >
                                     {pIdx + 1}
                                 </button>
                             );
                             return acc;
                         }, [])}

                    {/* 다음 페이지 버튼 */}
                    <button
                        onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={page === totalPages - 1}
                        className={`px-3 py-1 rounded text-sm ${
                            page === totalPages - 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminActivityList;