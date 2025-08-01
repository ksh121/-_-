import React, { useState, useEffect, useContext } from 'react';
import { Upload, X, User, BookOpen, Tag, DollarSign, Folder, FileText, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { GlobalContext } from '../../components/GlobalContext';
import '../style/TalentCreateForm.css';
import { useNavigate } from "react-router-dom";

const TalentCreateForm = ({ onCreated }) => {
  // 기존 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [typeno, setTypeno] = useState('');
  const [cateGrpno, setCateGrpno] = useState('');
  const [categoryno, setCategoryno] = useState('');
  const [cateGrpList, setCateGrpList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  // 추가: 파일 상태 관리
 const [selectedFiles, setSelectedFiles] = useState([]);

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    axios.get('/talent_cate_grp/list')
      .then(res => setCateGrpList(res.data.content))
      .catch(err => console.error('대분류 목록 불러오기 실패', err));
  }, []);

  useEffect(() => {
    if (cateGrpno) {
      axios.get(`/talent_category/list-by-categrp/${cateGrpno}`)
        .then(res => setCategoryList(res.data))
        .catch(err => {
          console.error('소분류 목록 불러오기 실패', err);
          setCategoryList([]);
        });
      setCategoryno('');
    } else {
      setCategoryList([]);
      setCategoryno('');
    }
  }, [cateGrpno]);

  useEffect(() => {
    axios.get('/talent_type/list')
      .then(res => setTypeList(res.data.content))
      .catch(err => console.error('타입 목록 불러오기 실패', err));
  }, []);

  // 천단위 자리표 찍기
  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/,/g, '');
    if (!/^\d*$/.test(raw)) return; // 숫자만 허용
    setPrice(raw);
  };

  // 찍은거 보여주기
  const formattedPrice = Number(price).toLocaleString();

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files)); // 다중 파일을 배열로 저장
  };

  // 파일 제거 핸들러
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!loginUser?.userno) {
    alert('로그인이 필요합니다.');
    return;
  }
  if (!title.trim()) {
    alert('제목을 입력하세요.');
    return;
  }
  if (!typeno) {
    alert('타입을 선택하세요.');
    return;
  }
  if (!cateGrpno) {
    alert('대분류를 선택하세요.');
    return;
  }
  if (!categoryno) {
    alert('소분류를 선택하세요.');
    return;
  }

  setIsSubmitting(true);

  try {
    // 1. 재능 저장 (파일 제외)
    const dto = {
      title,
      description,
      price,
      schoolno: loginUser.schoolno,
      userno: loginUser.userno,
      typeno: Number(typeno),
      categoryno: Number(categoryno),
    };

    const saveRes = await axios.post('/talent/save', dto);
    const savedTalent = saveRes.data; // 등록된 재능 정보 (talentno 포함)

    // 2. 파일 업로드 (파일이 있으면)
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('targetType', 'talent');
      formData.append('talentno', savedTalent.talentno); // 여기 반드시 등록된 talentno 넣기
      formData.append('profile', 'attachment');

      await axios.post('/api/file/upload-multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    alert('등록 성공!');

    // 초기화
    setTitle('');
    setDescription('');
    setPrice('');
    setTypeno('');
    setCateGrpno('');
    setCategoryno('');
    setCategoryList([]);
    setSelectedFiles([]);

    if (onCreated) onCreated();

  } catch (err) {
    alert('등록 실패: ' + (err.response?.data?.message || err.message));
  } finally {
      setIsSubmitting(false);
    }
};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            재능 등록
          </h3>
          <p className="text-gray-600 mt-1">나의 재능을 다른 사람들과 나누어 보세요</p>
        </div>

        {/* 제목 입력 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            제목 *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="재능의 제목을 입력하세요"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* 가격 입력 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            가격 (원)
          </label>
          <input
            type="text"
            value={formattedPrice}
            onChange={handlePriceChange}
            placeholder="예: 10,000"
            inputMode="numeric"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>



        {/* 설명 입력 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            설명
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="재능에 대한 상세한 설명을 입력하세요"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        {/* 타입 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            타입 *
          </label>
          <select 
            value={typeno} 
            onChange={e => setTypeno(e.target.value)} 
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">타입을 선택하세요</option>
            {typeList.map(type => (
              <option key={type.typeno} value={type.typeno}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* 대분류 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Folder className="w-4 h-4" />
            대분류 *
          </label>
          <select 
            value={cateGrpno} 
            onChange={e => setCateGrpno(e.target.value)} 
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="" disabled hidden>대분류를 선택하세요</option>
            {cateGrpList.map(grp => (
              <option key={grp.cateGrpno} value={grp.cateGrpno}>{grp.name}</option>
            ))}
          </select>
        </div>

        {/* 소분류 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            소분류 *
          </label>
          <select 
            value={categoryno} 
            onChange={e => setCategoryno(e.target.value)} 
            required 
            disabled={!cateGrpno}
            
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="" disabled hidden>소분류를 선택하세요</option>
            {categoryList.map(cat => (
              <option key={cat.categoryno} value={cat.categoryno}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* 파일 업로드 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            첨부파일
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors duration-200">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="file-upload"
            />
            <label 
              htmlFor="file-upload" 
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">클릭하여 이미지를 선택하세요</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF 파일 지원</span>
            </label>
          </div>

          {/* 선택된 파일 목록 */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">선택된 파일:</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                등록 중...
              </>
            ) : (
              '등록하기'
            )}
          </button>


        </div>
        <div className='flex justify-center gap-1 text-center'>     
          {/* 뒤로가기 버튼 */}         
          <button
            type="button"
            onClick={goBack}
            className=" text-gray-600 py-1 text-sm hover:text-gray-800 transition-colors flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전으로</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TalentCreateForm;
