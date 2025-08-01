import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, School, Shield, ArrowRight, Check, Search, X, ArrowLeft} from "lucide-react";

function UnivCertPage() {
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  
  // 학교 검색 팝업 관련 state 추가
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);

  const goBack = () => {
    navigate(-1);
  };
  
  useEffect(() => {
    // 컴포넌트가 처음 렌더링 될 때 학교 목록을 가져옴
    const fetchSchools = async () => {
      try {
        const res = await axios.get("/schools/list");
        // 예상 응답 예: [{schoolno:1, schoolname:"서울대학교"}, {...}, ...]
        setSchools(res.data);
      } catch (err) {
        console.error("학교 목록 불러오기 실패", err);
      }
    };
    fetchSchools();
  }, []);

  // 검색 필터링
  const filteredSchools = schools.filter(school =>
    school.schoolname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 학교 선택 핸들러
  const handleSchoolSelect = (school) => {
    setSchoolName(school.schoolname);
    setIsPopupOpen(false);
    setSearchTerm('');
  };

  // 팝업 열기/닫기
  const openPopup = () => {
    setIsPopupOpen(true);
    setSearchTerm('');
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSearchTerm('');
  };

  // 1. 인증 메일 보내기
  const sendEmail = async () => {
    try {
      await axios.post("/user/univ/sendCode", {
        email,
        schoolName
      });
      alert("인증 메일이 발송되었습니다.");
      setStep(2);
    } catch (err) {
      alert("인증 메일 전송 실패");
    }
  };
  
  // 2. 인증번호 확인
  const verifyCode = async () => {
    try {
      const res = await axios.post("/user/univ/verifyCode", {
        email,
        schoolName,
        code: parseInt(code),
      });
      console.log(res)
      if (res.data.sw) {
        alert("인증 성공!");
        navigate("/user/register", {
          state: {
            email,
            schoolName
          }
        });
      } else {
        alert("인증 실패");
      }
    } catch (err) {
      alert("인증 오류 발생");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대학교 인증</h1>
          <p className="text-gray-600">학교 이메일로 본인인증을 진행해주세요</p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <Mail className="w-4 h-4" />
            </div>

            <div className={`h-1 w-12 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />

            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <User className="w-4 h-4" />
            </div>

            <div className={`h-1 w-12 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />

            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>이메일 전송</span>
            <span>인증 완료</span>
          </div>
        </div>

        {/* 메인 카드 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학교 이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="example@university.ac.kr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* 기존 학교 입력 부분을 아래 코드로 교체 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대학교 이름
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <div
                      onClick={openPopup}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
                    >
                      {schoolName || '대학교를 선택하세요'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={sendEmail}
                  disabled={!email || !schoolName}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>인증 메일 보내기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              {/* 뒤로가기 버튼 */}
              <button
                type="button"
                onClick={goBack}
                className="w-full text-gray-600 py-1 text-sm hover:text-gray-800 transition-colors flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>이전으로</span>
              </button>
                
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    인증 메일을 확인해주세요
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {email}로 인증번호가 발송되었습니다
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    인증번호
                  </label>
                  <input
                    type="text"
                    placeholder="6자리 인증번호를 입력하세요"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-center text-lg font-mono"
                  />
                </div>

                <button
                  onClick={verifyCode}
                  disabled={!code}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>인증 확인</span>
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
                >
                  이메일 주소 변경하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 학교 검색 팝업 - 여기서부터 추가되는 부분 */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-96">
            {/* 팝업 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">학교 검색</h3>
              <button
                onClick={closePopup}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 검색 입력 */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="학교명을 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            {/* 학교 목록 */}
            <div className="max-h-64 overflow-y-auto">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <div
                    key={school.schoolno}
                    onClick={() => handleSchoolSelect(school)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <span className="text-gray-800">{school.schoolname}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  검색 결과가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnivCertPage;