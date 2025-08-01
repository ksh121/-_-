import React, { useEffect, useContext, useState } from 'react';
import { Plus, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import axios from "axios";


function MainSideBar() {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const { loginUser, setSelectedCategoryNo, selectedCategoryNo, setSelectedCateGrpno, selectedCateGrpno } = useContext(GlobalContext);

    const [openCategory, setOpenCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    let currentDisplayName = '';
    if (selectedCateGrpno) { // 대분류가 선택된 경우
        const mainCat = categories.find(cat => cat.id === selectedCateGrpno);
        if (mainCat) {
            currentDisplayName = mainCat.name;
            if (selectedCategoryNo) { // 대분류 내에서 소분류까지 선택된 경우
                const subCat = mainCat.subcategories.find(sub => sub.id === selectedCategoryNo);
                if (subCat) {
                    currentDisplayName += ` / ${subCat.name}`;
                }
            }
        }
    } else if (selectedCategoryNo) { // 대분류 없이 소분류만 선택된 경우 (현재 구조상 발생하기 어렵지만 안전장치)
        for (const mainCategory of categories) {
            const subCat = mainCategory.subcategories.find(sub => sub.id === selectedCategoryNo);
            if (subCat) {
                currentDisplayName = `${mainCategory.name} / ${subCat.name}`;
                break;
            }
        }
    }


    const handleCategoryClick = (cateGrpno, categoryno = null) => {
        if (categoryno !== null) {
            // 소분류 클릭: 소분류 ID 저장, 대분류 ID 저장 (부모 대분류를 명확히 하기 위해)
            setSelectedCategoryNo(categoryno);
            setSelectedCateGrpno(cateGrpno);
            // ⭐ 이 부분을 수정합니다: 소분류 클릭 시 드롭다운을 닫지 않음 ⭐
            setOpenCategory(cateGrpno); // 소분류가 속한 대분류는 계속 열려있게 유지
        } else {
            // 대분류 클릭:
            if (openCategory === cateGrpno && selectedCateGrpno === cateGrpno && selectedCategoryNo === null) {
                // 1. 이미 열려있는 대분류를 다시 클릭했고, 소분류가 선택되지 않은 상태이면 닫고 모든 카테고리 필터 해제
                setSelectedCateGrpno(null);
                setSelectedCategoryNo(null);
                setOpenCategory(null);
            } else if (openCategory === cateGrpno && selectedCateGrpno === cateGrpno && selectedCategoryNo !== null) {
                // 2. 이미 열려있는 대분류를 다시 클릭했고, 소분류가 선택된 상태이면 소분류만 해제하고 대분류 유지
                setSelectedCategoryNo(null);
                // setOpenCategory(cateGrpno); // 드롭다운은 계속 열려있음
            }
            else {
                // 3. 다른 대분류를 클릭하거나, 현재 대분류를 처음 클릭하면 열고 해당 대분류만 필터링
                setSelectedCateGrpno(cateGrpno); // 대분류 ID 저장
                setSelectedCategoryNo(null); // 소분류는 해제
                setOpenCategory(cateGrpno); // 드롭다운 열기
            }
        }
    };


    const handleClearCategory = () => {
        setSelectedCategoryNo(null);
        setSelectedCateGrpno(null); // 대분류 필터도 함께 해제
        setOpenCategory(null);
    };

    const VerticalLineIcon = ({ height = 16, color = '#999' }) => (
        <svg
            width="2"
            height={height}
            viewBox={`0 0 2 ${height}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="0" y="0" width="2" height={height} fill={color} rx="1" />
        </svg>
    );

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const grpRes = await axios.get('/talent_cate_grp/list?keyword=');
                const cateGrpList = grpRes.data.content;

                const result = await Promise.all(cateGrpList.map(async (grp) => {
                    const cateRes = await axios.get(`/talent_category/list-by-categrp/${grp.cateGrpno}`);
                    return {
                        id: grp.cateGrpno,
                        name: grp.name,
                        icon: <VerticalLineIcon height={16} color="#999" />,
                        subcategories: cateRes.data.map(c => ({
                            id: c.categoryno,
                            name: c.name
                        }))
                    };
                }));

                setCategories(result);

                // ⭐ 초기 로드 시 또는 새로고침 시 이전에 선택된 카테고리가 있다면 해당 대분류 드롭다운 열어두기 ⭐
                if (selectedCateGrpno) {
                    setOpenCategory(selectedCateGrpno);
                } else if (selectedCategoryNo) {
                    // selectedCategoryNo만 있을 경우 (이전 세션 등에서 복구) 해당 소분류의 대분류를 찾아 열기
                    const parentGrp = result.find(grp => grp.subcategories.some(sub => sub.id === selectedCategoryNo));
                    if (parentGrp) {
                        setOpenCategory(parentGrp.id);
                        setSelectedCateGrpno(parentGrp.id); // GlobalContext에도 대분류 설정
                    }
                }

            } catch (error) {
                console.error('카테고리 불러오기 실패', error);
            }
        };

        fetchCategories();
    }, []); // 의존성 배열 비워두어 컴포넌트 마운트 시 한 번만 실행되도록

    return (
        <div style={{
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            gap: '20px'
        }}>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxSizing: 'border-box'
            }}>

                <h2 style={{
                    fontSize: '30px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    {loginUser?.schoolname}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 8px',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        outline: 'none'
                    }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                        onClick={() => navigate('/talent/TalentCreateForm')}
                    >
                        <Plus size={20} />
                        <span>내 글 등록</span>
                    </button>


                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 8px',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        outline: 'none'
                    }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                        onClick={() => navigate('/place/PlacesPage')}
                    >
                        <Menu size={20} />
                        <span>강의실 보기</span>
                    </button>
                </div>

            </div>

            {/* 구분선 */}
            <div style={{
                height: '1px',
                backgroundColor: '#e5e7eb'
            }}></div>

            {/* 카테고리 섹션 */}
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                position: 'relative'
            }}>
                {(selectedCategoryNo || selectedCateGrpno) && (
                    <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                        <button
                            onClick={handleClearCategory}
                            style={{
                                padding: '5px 10px',
                                fontSize: '14px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                        >
                            {currentDisplayName} X
                        </button>
                    </div>
                )}
                <h3 style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '20px',
                    textAlign: 'left'
                }}>
                    재능 카테고리
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            style={{ position: 'relative' }}
                        >
                            <div
                                onClick={() => handleCategoryClick(category.id)} // 대분류 클릭 시 cateGrpno만 전달
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: '12px 16px',
                                    fontSize: '15px',
                                    color: '#333',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s, border-radius 0.2s',
                                    gap: '12px',
                                    // 대분류 자체가 선택되었거나 (소분류가 선택되지 않은 채)
                                    // 현재 열려있는 대분류가 이 대분류이고, 그 안에 소분류가 선택되었을 경우에도 활성화된 것처럼 보이게
                                    backgroundColor: (selectedCateGrpno === category.id && selectedCategoryNo === null) || openCategory === category.id ? '#f0f0f0' : 'transparent',
                                    borderRadius: '5px',
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>{category.icon}</span>
                                <span style={{ fontWeight: '500' }}>{category.name}</span>
                            </div>

                            {/* 서브카테고리 드롭다운 */}
                            {openCategory === category.id && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginLeft: '24px',
                                    marginTop: '8px',
                                    gap: '4px',
                                }}>
                                    {category.subcategories.map((subcategory) => (
                                        <div
                                            key={subcategory.id}
                                            onClick={() => handleCategoryClick(category.id, subcategory.id)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '8px 16px',
                                                fontSize: '14px',
                                                color: '#555',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s, border-radius 0.2s',
                                                textAlign: 'left',
                                                backgroundColor: selectedCategoryNo === subcategory.id ? '#e0e0e0' : 'transparent', // ⭐ 소분류 활성화 스타일 적용 ⭐
                                                borderRadius: '5px',
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = selectedCategoryNo === subcategory.id ? '#e0e0e0' : 'transparent'} // ⭐ 마우스 아웃 시 원래 색상 복원 ⭐
                                        >
                                            {subcategory.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default MainSideBar;