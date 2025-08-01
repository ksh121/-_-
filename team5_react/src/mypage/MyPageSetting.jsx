// import React, { useState } from 'react';
// import { Info } from 'lucide-react';

// const SecuritySettings = () => {
//   const [notificationSetting, setNotificationSetting] = useState('all');

//   return (
//     <div>
//       {/* 기본보안설정 */}
//       <section style={{ marginBottom: '40px' }}>
//         <h2 style={{ 
//           fontSize: '16px', 
//           fontWeight: 'bold', 
//           marginBottom: '20px', 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: '8px' 
//         }}>
//           기본보안설정
//           <Info style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
//         </h2>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '16px 0',
//             borderBottom: '1px solid #f3f4f6'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
//               <span style={{ fontSize: '14px' }}>비밀번호</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <span style={{
//                 padding: '4px 8px',
//                 backgroundColor: '#dcfce7',
//                 color: '#16a34a',
//                 borderRadius: '4px',
//                 fontSize: '12px',
//                 fontWeight: '500'
//               }}>수정</span>
//             </div>
//           </div>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '16px 0',
//             borderBottom: '1px solid #f3f4f6'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
//               <span style={{ fontSize: '14px' }}>패스키 관리</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <span style={{ fontSize: '14px' }}>0개</span>
//               <button style={{
//                 padding: '4px 12px',
//                 backgroundColor: '#f3f4f6',
//                 border: '1px solid #d1d5db',
//                 borderRadius: '4px',
//                 fontSize: '12px',
//                 color: '#4b5563',
//                 cursor: 'pointer'
//               }}>
//                 관리
//               </button>
//             </div>
//           </div>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '16px 0'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
//               <span style={{ fontSize: '14px' }}>2단계 인증</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <span style={{
//                 padding: '4px 8px',
//                 backgroundColor: '#dcfce7',
//                 color: '#16a34a',
//                 borderRadius: '4px',
//                 fontSize: '12px',
//                 fontWeight: '500'
//               }}>설정</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 로그인 차단 설정 */}
//       <section style={{ marginBottom: '40px' }}>
//         <h2 style={{ 
//           fontSize: '16px', 
//           fontWeight: 'bold', 
//           marginBottom: '20px', 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: '8px' 
//         }}>
//           로그인 차단 설정
//           <Info style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
//         </h2>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '16px 0',
//             borderBottom: '1px solid #f3f4f6'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
//               <span style={{ fontSize: '14px' }}>타지역 로그인 차단</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{
//                 width: '44px',
//                 height: '24px',
//                 borderRadius: '12px',
//                 cursor: 'pointer',
//                 transition: 'background-color 0.2s',
//                 backgroundColor: '#d1d5db',
//                 position: 'relative'
//               }}>
//                 <div style={{
//                   width: '20px',
//                   height: '20px',
//                   backgroundColor: 'white',
//                   borderRadius: '50%,',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
//                   transition: 'transform 0.2s',
//                   transform: 'translateX(2px)',
//                   marginTop: '2px'
//                 }}></div>
//               </div>
//             </div>
//           </div>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '16px 0'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
//               <span style={{ fontSize: '14px' }}>해외 로그인 차단</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{
//                 width: '44px',
//                 height: '24px',
//                 borderRadius: '12px',
//                 cursor: 'pointer',
//                 transition: 'background-color 0.2s',
//                 backgroundColor: '#22c55e',
//                 position: 'relative'
//               }}>
//                 <div style={{
//                   width: '20px',
//                   height: '20px',
//                   backgroundColor: 'white',
//                   borderRadius: '50%',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
//                   transition: 'transform 0.2s',
//                   transform: 'translateX(20px)',
//                   marginTop: '2px'
//                 }}></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 새 기기 로그인 알림 */}
//       <section style={{ marginBottom: '40px' }}>
//         <h2 style={{ 
//           fontSize: '16px', 
//           fontWeight: 'bold', 
//           marginBottom: '20px', 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: '8px' 
//         }}>
//           새 기기 로그인 알림
//           <Info style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
//         </h2>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '16px 0',
//             borderBottom: '1px solid #f3f4f6'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
//               <span style={{ fontSize: '14px' }}>로그인 알림</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{
//                 width: '44px',
//                 height: '24px',
//                 borderRadius: '12px',
//                 cursor: 'pointer',
//                 transition: 'background-color 0.2s',
//                 backgroundColor: '#d1d5db',
//                 position: 'relative'
//               }}>
//                 <div style={{
//                   width: '20px',
//                   height: '20px',
//                   backgroundColor: 'white',
//                   borderRadius: '50%',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
//                   transition: 'transform 0.2s',
//                   transform: 'translateX(2px)',
//                   marginTop: '2px'
//                 }}></div>
//               </div>
//             </div>
//           </div>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '16px 0',
//             borderBottom: '1px solid #f3f4f6'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{ width: '20px', height: '20px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
//               <span style={{ fontSize: '14px' }}>로그인 알림 제외 목록</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <button style={{
//                 padding: '4px 12px',
//                 backgroundColor: '#f3f4f6',
//                 border: '1px solid #d1d5db',
//                 borderRadius: '4px',
//                 fontSize: '12px',
//                 color: '#4b5563',
//                 cursor: 'pointer'
//               }}>
//                 확인
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 알림 설정 */}
//       <section style={{ marginBottom: '40px' }}>
//         <h2 style={{ 
//           fontSize: '16px', 
//           fontWeight: 'bold', 
//           marginBottom: '20px', 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: '8px' 
//         }}>
//           알림 설정
//           <Info style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
//         </h2>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '16px 0',
//             borderBottom: '1px solid #f3f4f6'
//           }}>
//             <span style={{ fontSize: '14px' }}>알림 수신 여부</span>
//             <div style={{ display: 'flex', gap: '16px' }}>
//               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
//                 <input
//                   type="radio"
//                   name="notification"
//                   value="all"
//                   checked={notificationSetting === 'all'}
//                   onChange={(e) => setNotificationSetting(e.target.value)}
//                 />
//                 모두 받기
//               </label>
//               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
//                 <input
//                   type="radio"
//                   name="notification"
//                   value="important"
//                   checked={notificationSetting === 'important'}
//                   onChange={(e) => setNotificationSetting(e.target.value)}
//                 />
//                 중요 알림만 받기
//               </label>
//               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
//                 <input
//                   type="radio"
//                   name="notification"
//                   value="none"
//                   checked={notificationSetting === 'none'}
//                   onChange={(e) => setNotificationSetting(e.target.value)}
//                 />
//                 받지 않음
//               </label>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default SecuritySettings;
