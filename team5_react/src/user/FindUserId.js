import React, { useState } from 'react';
import { Mail, User, Shield, CheckCircle, AlertCircle } from 'lucide-react';

function FindUserId() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    setError(null);
    setResult(null);

    if (!username || !email) {
      alert('이름과 이메일을 입력하세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/user/sendCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();
      if (data.sw) {
        alert('이메일로 인증번호를 보냈습니다.');
        setIsCodeSent(true);
      } else {
        setError(data.msg || '인증번호 발송 실패');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError(null);

    if (!code) {
      alert('인증번호를 입력하세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/user/verifyCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, code }),
      });

      const data = await response.json();
      if (data.sw) {
        setResult(data.userId);
      } else {
        setError(data.msg || '인증 실패');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">아이디 찾기</h2>
          <p className="text-gray-600 mt-2">이름과 이메일로 아이디를 찾아보세요</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSendCode}
            disabled={isLoading || !username || !email}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Shield className="w-5 h-5" />
                인증번호 받기
              </>
            )}
          </button>

          {isCodeSent && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-in slide-in-from-top-4 duration-300">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">인증번호</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="인증번호를 입력하세요"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || !code}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    인증번호 확인
                  </>
                )}
              </button>
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">아이디 찾기 완료!</p>
                  <p className="text-lg font-bold text-green-900 mt-1">{result}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">오류가 발생했습니다</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindUserId;