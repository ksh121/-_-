// TalentList.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalContext } from '../../components/GlobalContext'; // GlobalContext 경로 확인
import { useNavigate } from 'react-router-dom';
import uploadFile from '../../fileupload/FileUpload';

const TalentList = ({ refresh, onUpdated, onDeleted, searchQuery }) => {
    // ⭐ selectedCateGrpno 추가 ⭐
    const { loginUser, selectedCategoryNo, setSelectedCategoryNo, selectedCateGrpno, triggerTalentListRefresh } = useContext(GlobalContext);
    const [talents, setTalents] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    // selectedCategoryNo 또는 selectedCateGrpno가 변경될 때 페이지를 0으로 초기화
    useEffect(() => { setPage(0); }, [selectedCategoryNo, selectedCateGrpno]);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [typeList, setTypeList] = useState([]);
  const [cateGrpList, setCateGrpList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [avgRatings, setAvgRatings] = useState({});

    const schoolno = loginUser?.schoolno;
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);

    const goToPage = (newPage) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
    };

   // 재능 목록을 불러오는 useEffect
    useEffect(() => {
        if (!schoolno) {
            setTalents([]);
            setTotalPages(1);
            return;
        }

        const params = new URLSearchParams();
        if (searchQuery?.trim()) params.append('keyword', searchQuery.trim());

        if (selectedCateGrpno !== null) {
            params.append('cateGrpno', selectedCateGrpno);
        }
        if (selectedCategoryNo !== null) {
            params.append('categoryno', selectedCategoryNo);
        }

        params.append('page', page);
        params.append('size', size);
        params.append('schoolno', schoolno);

        console.log("요청 파라미터:", params.toString());

        axios.get(`/talent/search?${params.toString()}`)
            .then(res => {
                const fetchedTalents = res.data.content || [];
                setTotalPages(res.data.totalPages || 1);

                const filtered = fetchedTalents.filter(t =>
                    (loginUser && loginUser.userno === t.userno) || !t.blocked
                );
                setTalents(filtered); // talents 상태를 여기서 업데이트
            })
            .catch(err => {
                console.error('목록 불러오기 실패:', err);
                alert('목록 불러오기 실패: ' + err.message);
            });
    }, [refresh, schoolno, searchQuery, selectedCategoryNo, selectedCateGrpno, page, size, loginUser]); // 의존성 배열에 loginUser 추가

    // ⭐ 재능 목록(talents)이 업데이트될 때 평균 평점을 가져오는 useEffect (분리) ⭐
    useEffect(() => {
        const fetchAvgRatings = async () => {
            const ratingMap = {};
            await Promise.all(talents.map(async (t) => {
                try {
                    const res = await axios.get(`/reviews/average-rating/${t.talentno}`);
                    ratingMap[t.talentno] = parseFloat(res.data).toFixed(1);
                } catch (e) {
                    console.error(`평점 가져오기 실패: talentno=${t.talentno}`, e);
                    ratingMap[t.talentno] = null;
                }
            }));
            setAvgRatings(ratingMap);
        };

        if (talents.length > 0) { // talents가 비어있지 않을 때만 실행
            fetchAvgRatings();
        } else {
            setAvgRatings({}); // talents가 비어있으면 평점도 초기화
        }
    }, [talents]); // talents가 변경될 때마다 이 훅이 실행됩니다.

    // 타입, 대분류 카테고리 목록을 한 번만 가져오는 useEffect
    useEffect(() => {
        axios.get('/talent_type/list').then(res => setTypeList(res.data.content));
        axios.get('/talent_cate_grp/list')
            .then(async (res) => {
                const grpList = res.data.content;
                const grpListWithCategories = await Promise.all(grpList.map(async (grp) => {
                    const cateRes = await axios.get(`/talent_category/list-by-categrp/${grp.cateGrpno}`);
                    return { ...grp, categories: cateRes.data };
                }));
                setCateGrpList(grpListWithCategories);
            });
    }, []);

    // editForm.cateGrpno가 변경될 때 소분류 카테고리 목록을 가져오는 useEffect
    useEffect(() => {
        if (editForm.cateGrpno) {
            axios.get(`/talent_category/list-by-categrp/${editForm.cateGrpno}`)
                .then(res => setCategoryList(res.data))
                .catch(() => setCategoryList([]));
        } else {
            setCategoryList([]);
        }
    }, [editForm.cateGrpno]);

    const startEdit = (talent) => {
        setEditId(talent.talentno);
        setEditForm({
            title: talent.title,
            description: talent.description,
            typeno: talent.typeno || talent.type,
            cateGrpno: talent.cateGrpno,
            categoryno: talent.categoryno || talent.category,
        });
        setSelectedFiles([]);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditForm({});
        setSelectedFiles([]);
    };
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const submitEdit = async () => {
        try {
            let uploadedFileData = [];
            if (selectedFiles.length > 0) {
                uploadedFileData = await uploadFile(selectedFiles, 'talent', editId, loginUser.profile);
            }
            const dto = {
                talentno: editId,
                title: editForm.title,
                description: editForm.description,
                typeno: Number(editForm.typeno),
                categoryno: Number(editForm.categoryno),
                fileInfos: uploadedFileData,
            };
            const res = await fetch('/talent/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw new Error('수정 실패');
            alert('수정 성공!');
            setEditId(null);
            setEditForm({});
            setSelectedFiles([]);
            if (onUpdated) onUpdated();
            triggerTalentListRefresh(); // 목록 갱신 트리거
        } catch (e) {
            alert('에러: ' + e.message);
        }
    };

    const deleteTalent = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            const res = await fetch(`/talent/delete/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('삭제 실패');
            alert('삭제 완료');
            if (onDeleted) onDeleted();
            triggerTalentListRefresh(); // 목록 갱신 트리거
        } catch (e) {
            alert('에러: ' + e.message);
        }
    };

    const sendRequest = async (talent) => {
        if (!loginUser) {
            alert('로그인이 필요합니다.');
            return;
        }
        const dto = {
            talentno: talent.talentno,
            giverno: loginUser.userno,
            receiverno: talent.userno,
            status: 'pending',
            message: '재능 요청합니다.',
        };
        try {
            await axios.post('/request/save', dto);
            alert('요청 성공!');
        } catch (e) {
            alert('요청 실패: ' + e.message);
        }
    };

    const handleGoDetail = (talentno) => {
        navigate(`/talent/detail/${talentno}`);
    };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-6 text-center">재능 목록</h2>
      {/* ⭐ filteredTalents 대신 talents를 사용합니다! ⭐ */}
      {talents.length === 0 ? (
        <div className="text-center text-gray-500">목록이 없습니다.</div>
      ) : (
        talents.map(t => // ⭐ 여기서도 talents를 사용합니다! ⭐
          editId === t.talentno ? (
            <article key={t.talentno} className="border p-4 rounded-lg mb-4">
              <header className="mb-4">
                <h3 className="text-lg font-semibold">재능 수정 - {t.talentno}</h3>
              </header>
              <div className="flex flex-col gap-2">
                <input name="title" value={editForm.title || ''} onChange={handleEditChange}
                  placeholder="제목" required
                  className="border p-2 rounded w-full" />
                <input name="description" value={editForm.description || ''} onChange={handleEditChange}
                  placeholder="설명" className="border p-2 rounded w-full" />
                <select name="typeno" value={editForm.typeno || ''} onChange={handleEditChange}
                  required className="border p-2 rounded w-full">
                  <option value="">타입 선택</option>
                  {typeList.map((type) => (
                    <option key={type.typeno} value={type.typeno}>{type.name}</option>
                  ))}
                </select>
                <select name="cateGrpno" value={editForm.cateGrpno || ''} onChange={handleEditChange}
                  required className="border p-2 rounded w-full">
                  <option value="">대분류 선택</option>
                  {cateGrpList.map((grp) => (
                    <option key={grp.cateGrpno} value={grp.cateGrpno}>{grp.name}</option>
                  ))}
                </select>
                <select name="categoryno" value={editForm.categoryno || ''} onChange={handleEditChange}
                  required className="border p-2 rounded w-full">
                  <option value="">소분류 선택</option>
                  {categoryList.map((cat) => (
                    <option key={cat.categoryno} value={cat.categoryno}>{cat.name}</option>
                  ))}
                </select>
                <input type="file" multiple onChange={handleFileChange}
                  className="border p-2 rounded w-full" />
              </div>
              <footer className="flex gap-2 mt-4">
                <button onClick={submitEdit}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow">저장</button>
                <button onClick={cancelEdit}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow">취소</button>
              </footer>
            </article>
          ) : (
            <article key={t.talentno}
              onClick={() => handleGoDetail(t.talentno)}
              className="relative flex items-center justify-between gap-4 border px-5 py-4 rounded-lg mb-4 hover:shadow cursor-pointer  h-[150px]">
              
              {/* 오른쪽 상단 카테고리 */}
                <div className="absolute top-4 right-6 text-xs text-gray-500">
                  {t.cateGrpName} &gt; {t.categoryName}
                </div>
              
              <div className="flex-1 text-left px-2">                
                <h3 className="font-semibold text-xl">{t.title}</h3>
                <p className="text-sm text-gray-400 mt-1" title={t.description}>
                  {t.description.length > 30 ? t.description.slice(0, 30) + '...' : t.description}
                </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                  {/* 평균 평점 표시 */}
                  {avgRatings[t.talentno] !== null && avgRatings[t.talentno] !== undefined && (
                    <>
                      <span className="text-yellow-600">⭐ {avgRatings[t.talentno]} / 5</span>
                      <span>·</span>
                    </>
                  )}
                  <span>조회수 : {t.viewCount}</span>
                </div>
              </div>

              {t.fileInfos && t.fileInfos.length > 0 && (
                <img src={`/uploads/talent/${t.fileInfos[0].storedFileName}`}
                  alt={t.fileInfos[0].originalFileName}
                  className="w-24 h-24 object-cover rounded shadow mt-5"
                  onClick={(e) => e.stopPropagation()} />
              )}
            </article>
          )
        )
      )}

            <div className="flex justify-center items-center gap-4 mt-6">
                <button onClick={() => goToPage(page - 1)} disabled={page <= 0}
                    className="px-4 py-1 rounded bg-gray-200 disabled:opacity-50">이전</button>
                <span>{page + 1} / {totalPages}</span>
                <button onClick={() => goToPage(page + 1)} disabled={page + 1 >= totalPages}
                    className="px-4 py-1 rounded bg-gray-200 disabled:opacity-50">다음</button>
            </div>
        </div>
    );
};

export default TalentList;