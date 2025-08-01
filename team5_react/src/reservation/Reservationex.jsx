// import React, { useState, useEffect } from 'react';
// import './Reservation.css';

// const Reservation = () => {
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [formData, setFormData] = useState({
//         name: '',
//         phone: '',
//         email: '',
//         date: '',
//         people: '',
//         time: '',
//         requests: ''
//     });
//     const [showSuccess, setShowSuccess] = useState(false);

//     const openPopup = () => setIsPopupOpen(true);
//     const closePopup = () => {
//         setIsPopupOpen(false);
//         setShowSuccess(false);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleTimeSlotClick = (time) => {
//         setFormData(prev => ({ ...prev, time }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!formData.time) {
//             alert('시간을 선택해주세요.');
//             return;
//         }
//         console.log('예약 데이터:', formData);
//         setShowSuccess(true);
//         setTimeout(() => {
//             closePopup();
//             setFormData({
//                 name: '',
//                 phone: '',
//                 email: '',
//                 date: '',
//                 people: '',
//                 time: '',
//                 requests: ''
//             });
//         }, 3000);
//     };

//     useEffect(() => {
//         const handleEsc = (event) => {
//             if (event.key === 'Escape') {
//                 closePopup();
//             }
//         };
//         window.addEventListener('keydown', handleEsc);
//         return () => window.removeEventListener('keydown', handleEsc);
//     }, []);

//     const today = new Date().toISOString().split('T')[0];

//     const timeSlots = [
//         '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
//         '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
//     ];

//     return (
//         <div className="main-content">
//             <h1>🏪 레스토랑 예약 시스템</h1>
//             <p>안녕하세요! 저희 레스토랑에 오신 것을 환영합니다.</p>
//             <p>맛있는 음식과 함께 특별한 시간을 보내고 싶으시다면 지금 예약해보세요!</p>
            
//             <button className="open-popup-btn" onClick={openPopup}>📅 예약하기</button>
            
//             <div style={{ marginTop: '30px' }}>
//                 <h2>🍽️ 메뉴 소개</h2>
//                 <ul style={{ margin: '20px 0', paddingLeft: '20px' }}>
//                     <li>시그니처 스테이크 - 35,000원</li>
//                     <li>해산물 파스타 - 28,000원</li>
//                     <li>트러플 리조또 - 32,000원</li>
//                     <li>랍스터 비스크 - 18,000원</li>
//                 </ul>
//             </div>

//             <div style={{ marginTop: '30px' }}>
//                 <h2>📍 위치 & 영업시간</h2>
//                 <p><strong>주소:</strong> 서울시 강남구 테헤란로 123길 45</p>
//                 <p><strong>영업시간:</strong> 매일 11:00 - 22:00</p>
//                 <p><strong>예약 문의:</strong> 02-1234-5678</p>
//             </div>

//             {isPopupOpen && (
//                 <div className="popup-overlay" onClick={closePopup}>
//                     <div className="container" onClick={(e) => e.stopPropagation()}>
//                         <button className="close-btn" onClick={closePopup}>&times;</button>
                        
//                         <div className="header">
//                             <h1>✨ 예약하기</h1>
//                             <p>원하시는 날짜와 시간을 선택해주세요</p>
//                         </div>

//                         {!showSuccess ? (
//                             <form onSubmit={handleSubmit}>
//                                 <div className="form-group">
//                                     <label htmlFor="name">이름 <span className="required">*</span></label>
//                                     <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
//                                 </div>

//                                 <div className="form-group">
//                                     <label htmlFor="phone">연락처 <span className="required">*</span></label>
//                                     <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
//                                 </div>

//                                 <div className="form-group">
//                                     <label htmlFor="email">이메일</label>
//                                     <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
//                                 </div>

//                                 <div className="form-row">
//                                     <div className="form-group">
//                                         <label htmlFor="date">날짜 <span className="required">*</span></label>
//                                         <input type="date" id="date" name="date" min={today} value={formData.date} onChange={handleInputChange} required />
//                                     </div>

//                                     <div className="form-group">
//                                         <label htmlFor="people">인원수 <span className="required">*</span></label>
//                                         <select id="people" name="people" value={formData.people} onChange={handleInputChange} required>
//                                             <option value="">선택하세요</option>
//                                             {[1, 2, 3, 4, 5, 6].map(n => (
//                                                 <option key={n} value={n}>{n === 6 ? '6명 이상' : `${n}명`}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="form-group">
//                                     <label>시간 선택 <span className="required">*</span></label>
//                                     <div className="time-slots">
//                                         {timeSlots.map(time => (
//                                             <div 
//                                                 key={time} 
//                                                 className={`time-slot ${formData.time === time ? 'selected' : ''}`}
//                                                 onClick={() => handleTimeSlotClick(time)}
//                                             >
//                                                 {time}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div className="form-group">
//                                     <label htmlFor="requests">특별 요청사항</label>
//                                     <textarea id="requests" name="requests" value={formData.requests} onChange={handleInputChange} placeholder="알레르기나 특별한 요청사항이 있으시면 적어주세요..."></textarea>
//                                 </div>

//                                 <button type="submit" className="submit-btn">예약하기</button>
//                             </form>
//                         ) : (
//                             <div className="success-message">
//                                 <h3>🎉 예약이 완료되었습니다!</h3>
//                                 <p>확인 메시지를 연락처로 보내드렸습니다.</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Reservation;
