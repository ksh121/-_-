import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Mail, School, Phone, MapPin, Globe, UserPlus, ArrowLeft, Check, X } from "lucide-react";

function UserRegister() {
  const [email] = useState("example@university.ac.kr"); // 인증된 이메일
  const [schoolName] = useState("홍익대학교"); // 인증된 학교명
  const [step, setStep] = useState(2);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: '',
    password: '',
    username: '',
    name: '',
    email: '',
    phone: '',
    zipcode: '',
    address: '',
    language: '',
    location: '',
    bio: '',
    role: '',
    schoolId: '', // 학교 선택 시 사용
    schoolName: ''
  });

  const location = useLocation(); // 👈 추가
  const certifiedEmail = location.state?.email || '';
  const certifiedSchool = location.state?.schoolName || '';

  useEffect(() => {
    if (certifiedEmail || certifiedSchool) {
      setForm(prev => ({
        ...prev,
        email: certifiedEmail || '',
        schoolId: certifiedSchool || '',
        schoolName: certifiedSchool || ''
      }));
    }
  }, [certifiedEmail, certifiedSchool]);

  const [idCheckMsg, setIdCheckMsg] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false); // 중복확인 완료 여부
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
     if (e.target.name === 'userId') {
      setIsIdChecked(false);   // 아이디 변경되면 다시 중복 확인 필요
      setIdCheckMsg('');
    }
  };

  // 아이디 중복 확인 함수
  const checkIdDuplicate = async () => {
    if (!form.userId.trim()) {
      setIdCheckMsg('아이디를 입력하세요.');
      return;
    }
    try {
      const res = await fetch(`/user/checkId?userId=${encodeURIComponent(form.userId)}`);
      const data = await res.json(); // { sw: true/false, msg: '...' } 형태 가정
      if (data.sw === true) {
        setIdCheckMsg('사용 가능한 아이디입니다.');
        setIsIdChecked(true);
      } else {
        setIdCheckMsg('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      }
    } catch (err) {
      setIdCheckMsg('오류가 발생했습니다. 다시 시도하세요.');
      setIsIdChecked(false);
    }
  };

  //카카오 주소 검색
  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 주소 선택 시
        setForm({
          ...form,
          zipcode: data.zonecode,
          address: data.roadAddress || data.jibunAddress,
        });
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isIdChecked) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      console.log(text);
      alert('회원가입 성공!');
      navigate('/login'); // 가입 후 로그인 페이지로 이동
    } catch (err) {
      console.error(err);
      alert('회원가입 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl m-10 ">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">계정 정보를 입력해주세요</p>
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
            {/* 인증된 정보 표시 */}
            {(certifiedEmail || certifiedSchool) && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  인증 완료
                </h3>
                <div className="space-y-1">
                  {certifiedEmail && (
                    <div className="flex items-center text-sm text-blue-700">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{certifiedEmail}</span>
                    </div>
                  )}
                  {certifiedSchool && (
                    <div className="flex items-center text-sm text-blue-700">
                      <School className="w-4 h-4 mr-2" />
                      <span>{certifiedSchool}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 아이디 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아이디 <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="userId"
                      placeholder="아이디를 입력하세요"
                      value={form.userId}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={checkIdDuplicate}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    중복확인
                  </button>
                </div>
                {idCheckMsg && (
                  <div className={`flex items-center mt-2 text-sm ${
                    isIdChecked ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isIdChecked ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : (
                      <X className="w-4 h-4 mr-1" />
                    )}
                    {idCheckMsg}
                  </div>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* 이름과 닉네임 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="username"
                      placeholder="실제 이름을 입력하세요"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    닉네임
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="name"
                      placeholder="사용할 닉네임"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="phone"
                    placeholder="전화번호를 입력하세요"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* 주소 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="zipcode"
                        placeholder="우편번호"
                        value={form.zipcode}
                        readOnly
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handlePostcode}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      주소 찾기
                    </button>
                  </div>
                  <input
                    name="address"
                    placeholder="주소"
                    value={form.address}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* 언어와 위치 */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    위치
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="location"
                      placeholder="거주 지역"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              

              {/* 자기소개 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자기소개
                </label>
                <textarea
                  name="bio"
                  placeholder="간단한 자기소개를 작성해주세요"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                />
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={isLoading || !isIdChecked}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>회원가입</span>
                  </>
                )}
              </button>

              {/* 뒤로가기 버튼 */}
              <button
                type="button"
                onClick={goBack}
                className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>이전으로</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserRegister;