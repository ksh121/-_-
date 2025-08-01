import React, { useState, useEffect } from 'react';
import UserLogin from '../user/UserLogin';  // 경로는 UserLogin 파일 위치에 맞게 수정

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-blue-600">
      {/* Hero Section */}
      <section className="pt-24 pb-24 text-center text-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-3 rounded-full mb-10 font-medium animate-fade-in-up">
            <span>대학생 전용 플랫폼</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-shadow animate-fade-in-up animation-delay-200 tracking-tight" style={{ fontFamily: " 'Noto Sans KR' "}}>
            재능을 잇는 링크<br/>
            <span className="text-cyan-200 font-black drop-shadow-sm">Abil Link</span>
          </h1>
          <div className="text-xl mb-8 opacity-90 font-medium animate-fade-in-up animation-delay-300" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
            함께 돕고 배우며, 대학 생활 속에서 서로 성장해요.
          </div>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            같은 캠퍼스 친구들과 재능을 나누고, 서로의 전공 지식과 경험을 교환하며<br/>
            더 풍성한 대학생활을 만들어가세요!
          </p>
          <div className="flex gap-6 justify-center flex-wrap animate-fade-in-up animation-delay-500">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-500 text-white px-12 py-5 rounded-full font-semibold text-lg hover:shadow-xl hover:-translate-y-1 hover:bg-cyan-600 transition-all duration-300"
              style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}
            >
              재능 교환 시작하기
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-center text-5xl text-blue-600 mb-4 font-black tracking-tight" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
            서툴지만 나누고 싶은 마음
          </h2>
          <div className="text-center text-slate-500 mb-16 text-xl" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
            그 마음이 모여, 교류가 되고, 연결이 됩니다.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                          {[
              {
                title: '학교별 커뮤니티',
                description: '같은 학교 학생들과 우선 연결되어, 수업 정보나 캠퍼스 생활 노하우를 더 쉽게 공유할 수 있어요.'
              },
              {
                title: '재능 교환',
                description: '컴공과 학생에게 코딩을 배우고, 디자인과 학생에게 포토샵을 배우는 등 실질적인 전공 지식을 나눠요.'
              },
              {
                title: '대학생 맞춤 서비스',
                description: '이곳은 ‘대학생만의 문제’를 함께 푸는 공간입니다.당신의 재능은 생각보다 많은 사람들에게 필요해요.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-12 rounded-3xl text-center shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-400 border-2 border-slate-100 hover:border-blue-600 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
                <div className="w-24 h-24 bg-blue-600 rounded-2xl mx-auto mb-8 flex items-center justify-center text-4xl text-white font-black" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
                  {index + 1}
                </div>
                <h3 className="text-2xl text-slate-800 mb-5 font-bold" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-base" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-32 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-5xl mb-6 font-black tracking-tight" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
            지금 <span className="text-yellow-300 font-black">무료</span>로 시작해보세요!
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
            학교 이메일인증만으로 간편하게 가입하고,<br/>
            우리 학교 친구들과 재능을 나누며 함께 성장해보세요.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-blue-600 font-bold text-lg px-12 py-5 rounded-full hover:bg-slate-50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}
          >
            로그인하고 시작하기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-600 text-white py-16 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-8">
            <h4 className="text-xl mb-4 text-cyan-200 font-semibold" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
              캠퍼스 재능나눔
            </h4>
            <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto" style={{fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"}}>
              대학생들의, 대학생들에 의한, 대학생들을 위한 재능 교환 플랫폼입니다.<br/>
              함께 성장하는 대학생활을 만들어가요.
            </p>
          </div>
        </div>
      </footer>

      {/* 로그인 팝업*/}
      {isModalOpen && (
        <UserLogin 
          isModalOpen={isModalOpen} 
          closeModal={() => setIsModalOpen(false)} 
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .text-shadow {
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

export default Home;