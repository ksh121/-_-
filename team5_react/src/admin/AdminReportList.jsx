// src/admin/AdminReportList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

/**
 * 관리자 신고 목록 페이지
 * - 필터: OPEN / APPROVED / REJECTED / ALL
 * - 페이지네이션
 * - 처리: 승인 / 기각 / 삭제
 */
function AdminReportList() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  /* 신고 목록 가져오기 */
  const fetchReports = () => {
    const params = { page, size };
    if (status !== "ALL") params.status = status;

    axios
      .get("/reports", { params })
      .then((res) => {
        setReports(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => console.error("신고 목록 실패", err));
  };

  useEffect(fetchReports, [status, page]);

  /* 상태 변경 */
  const changeStatus = (id, newStatus) => {
    axios
      .put(`/reports/${id}/status`, newStatus, {
        headers: { "Content-Type": "text/plain" },
      })
      .then(fetchReports)
      .catch(() => alert("상태 변경 실패"));
  };

  /* 삭제 */
  const deleteReport = (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    axios
      .delete(`/reports/${id}`)
      .then(fetchReports)
      .catch(() => alert("삭제 실패"));
  };

  /* 상태 색상 */
  const badge = (s) => {
    const style =
      s === "OPEN"
        ? "bg-yellow-100 text-yellow-800"
        : s === "APPROVED"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    return <span className={`px-2 py-0.5 rounded text-xs ${style}`}>{s}</span>;
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
       <div className="flex gap-6 items-center mb-4">
              <Link to="/admin/user">
                <h2 className="text-xl  hover:underline">관리자 - 사용자 목록</h2>
              </Link>
              <Link to="/admin/activity">
                <h2 className="text-xl hover:underline">활동로그 목록</h2>
              </Link>
              <Link to="/admin/report">
                <h2 className="text-xl font-bold hover:underline">신고 목록</h2>
              </Link>
            </div>

      {/* 필터 */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={status}
          onChange={(e) => {
            setPage(0);
            setStatus(e.target.value);
          }}
          className="border rounded p-2 text-sm"
        >
          <option value="ALL">전체</option>
          <option value="OPEN">미처리(OPEN)</option>
          <option value="APPROVED">승인(APPROVED)</option>
          <option value="REJECTED">기각(REJECTED)</option>          
        </select>
      </div>

      {/* 테이블 */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-center">
              <th className="px-3 py-2 whitespace-nowrap">ID</th>
              <th className="px-3 py-2 whitespace-nowrap">신고자</th>
              <th className="px-3 py-2 whitespace-nowrap">피신고자</th>
              <th className="px-3 py-2 whitespace-nowrap">타입</th>
              <th className="px-3 py-2">사유</th>
              <th className="px-3 py-2">날짜</th>
              <th className="px-3 py-2">상태</th>
              <th className="px-3 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  신고가 없습니다.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.reportno} className="border-b">
                  <td className="px-3 py-2">{r.reportno}</td>
                  <td className="px-3 py-2">{r.reporter}</td>
                  <td className="px-3 py-2">{r.reported}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.reportType}</td>
                  <td className="px-3 py-2 truncate max-w-xs" title={r.reason}>
                    {r.reason}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {r.createdAt?.substring(0, 10)}
                  </td>
                  <td className="px-3 py-2">{badge(r.status)}</td>
                  <td className="px-3 py-2 space-x-1 whitespace-nowrap">
                    {r.status === "OPEN" && (
                      <>
                        <button
                          onClick={() => changeStatus(r.reportno, "APPROVED")}
                          className="inline-flex items-center gap-1 text-green-600 hover:underline"
                        >
                          <CheckCircle2 className="w-4 h-4" /> 승인
                        </button>
                        <button
                          onClick={() => changeStatus(r.reportno, "REJECTED")}
                          className="inline-flex items-center gap-1 text-yellow-600 hover:underline"
                        >
                          <AlertCircle className="w-4 h-4" /> 기각
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteReport(r.reportno)}
                      className="inline-flex items-center gap-1 text-red-500 hover:underline"
                    >
                      <XCircle className="w-4 h-4" /> 삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-1">
          {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 rounded text-sm ${
    // style for active vs inactive
    i === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
  }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReportList;

