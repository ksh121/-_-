import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { X, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../components/GlobalContext';

function PlaceDetailPage() {
  const { placeno } = useParams();
  const [place, setPlace] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [reservations, setReservations] = useState([]); // For other user reservations
  const [activeTab, setActiveTab] = useState('timetable');
  const [showReservationPopup, setShowReservationPopup] = useState(false);
  
  // 주차 관련 상태
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);

  const [reservationDetails, setReservationDetails] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    purpose: ''
  });
  
  const navigate = useNavigate();
  const { loginUser } = useContext(GlobalContext);

  // 주차 시작일(월요일) 계산
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 조정
    return new Date(d.setDate(diff));
  };

  // 현재 시간이 지났는지 확인하는 함수
  const isPastTime = (date, time) => {
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}:00`);
    return selectedDateTime < now;
  };

  // 해당 주의 날짜들 생성 (월-금)
  const generateWeekDates = (weekStart) => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // 주차 변경 시 날짜 업데이트
  useEffect(() => {
    const weekStart = getWeekStart(currentWeek);
    setWeekDates(generateWeekDates(weekStart));
  }, [currentWeek]);

  // 이전/다음 주로 이동
  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  // 날짜 포맷팅
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateDisplay = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    axios.get(`/places/${placeno}`)
      .then(res => setPlace(res.data))
      .catch(err => console.error('장소 정보 로딩 실패', err));

    axios.get(`/class-schedule/by-place/${placeno}`)
      .then(res => setSchedules(res.data))
      .catch(err => console.error('스케줄 로딩 실패', err));

    axios.get(`/reservations/by-place/${placeno}`)
      .then(res => setReservations(res.data))
      .catch(err => console.error('예약 로딩 실패', err));

  }, [placeno]);

  const getStatus = (dayIndex, hour) => {
    const currentDate = weekDates[dayIndex];
    if (!currentDate) return { status: 'available' };

    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[currentDate.getDay()];
    const dateString = formatDate(currentDate);

    const slotStart = hour * 60;
    const slotEnd = (hour + 1) * 60;

    // 지난 시간인지 체크 (새로 추가)
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    if (isPastTime(dateString, timeString)) {
      return { status: 'past' };
    }

    // 수업 스케줄 체크
    for (const schedule of schedules) {
      if (schedule.day !== dayName) continue;

      const scheduleStart = timeToMinutes(schedule.startTime);
      const scheduleEnd = timeToMinutes(schedule.endTime);

      if (Math.max(slotStart, scheduleStart) < Math.min(slotEnd, scheduleEnd)) {
        return { status: 'existing', schedule };
      }

      if ((scheduleStart > slotStart && scheduleStart < slotEnd + 30) || (scheduleEnd > slotStart - 30 && scheduleEnd < slotEnd)) {
         if(scheduleStart-slotEnd < 30 && scheduleStart-slotEnd > 0) return { status: 'blocked' };
         if(slotStart-scheduleEnd < 30 && slotStart-scheduleEnd > 0) return { status: 'blocked' };
      }
    }

    // 예약 정보 체크 (날짜별로)
    for (const reservation of reservations) {
      if (reservation.status === '취소됨') continue;

      const resDate = new Date(reservation.start_time);
      const resDateString = formatDate(resDate);
      
      if (resDateString !== dateString) continue;

      const reservationStart = timeToMinutes(reservation.start_time.split('T')[1].slice(0, 5));
      const reservationEnd = timeToMinutes(reservation.end_time.split('T')[1].slice(0, 5));

      if (Math.max(slotStart, reservationStart) < Math.min(slotEnd, reservationEnd)) {
        return { status: 'reserved', reservation };
      }
    }

    return { status: 'available' };
  };

    // 3. isTimeSlotBlocked 함수에도 지난 시간 체크 추가
  const isTimeSlotBlocked = (date, time) => {
    // 지난 시간인지 체크 (새로 추가)
    if (isPastTime(date, time)) {
      return true;
    }

    const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
    const selectedDay = dayMap[new Date(date).getDay()];
    const slotStart = timeToMinutes(time);
    const slotEnd = slotStart + 30;

    // Check against class schedules with a 30-min buffer
    for (const schedule of schedules) {
        if (schedule.day !== selectedDay) continue;
        const scheduleStart = timeToMinutes(schedule.startTime) - 30;
        const scheduleEnd = timeToMinutes(schedule.endTime) + 30;
        if (Math.max(slotStart, scheduleStart) < Math.min(slotEnd, scheduleEnd)) {
            return true;
        }
    }

    // Check against other reservations without a buffer
    for (const reservation of reservations) {
        const resDate = formatDate(new Date(reservation.start_time));
        if (resDate !== date) continue;
        const reservationStart = timeToMinutes(reservation.start_time.split('T')[1].slice(0, 5));
        const reservationEnd = timeToMinutes(reservation.end_time.split('T')[1].slice(0, 5));
        if (Math.max(slotStart, reservationStart) < Math.min(slotEnd, reservationEnd)) {
            return true;
        }
    }

    return false;
  };

  if (!place) return <div>로딩 중...</div>;

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservationDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleReservation = async () => {
    const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
    const selectedDate = new Date(reservationDetails.date);
    const selectedDay = dayMap[selectedDate.getDay()];

    const reservationStart = timeToMinutes(reservationDetails.startTime);
    const reservationEnd = timeToMinutes(reservationDetails.endTime);

    if (reservationStart >= reservationEnd) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }

    if (!reservationDetails.purpose || reservationDetails.purpose.trim() === '') {
      alert('예약 목적을 반드시 입력해야 합니다.');
      return;
    }

    // 수업 스케줄과 30분 간격 확인
    const scheduleConflict = schedules.find(schedule => {
      if (schedule.day !== selectedDay) return false;
      const scheduleStart = timeToMinutes(schedule.startTime) - 30;
      const scheduleEnd = timeToMinutes(schedule.endTime) + 30;
      return Math.max(reservationStart, scheduleStart) < Math.min(reservationEnd, scheduleEnd);
    });

    if (scheduleConflict) {
      alert('선택하신 시간은 기존 수업 시간과 30분 이상 떨어져 있어야 합니다.');
      return;
    }

    // 기존 예약과 겹침 확인
    const reservationConflict = reservations.find(r => {
        const resDate = formatDate(new Date(r.start_time));
        if (resDate !== reservationDetails.date) return false;
        const existingStart = timeToMinutes(r.start_time.split('T')[1].slice(0, 5));
        const existingEnd = timeToMinutes(r.end_time.split('T')[1].slice(0, 5));
        return Math.max(reservationStart, existingStart) < Math.min(reservationEnd, existingEnd);
    });

    if (reservationConflict) {
        alert('선택하신 시간에 이미 다른 예약이 있습니다.');
        return;
    }
    
    // 예약 요청 서버에 보내기
    try {
      const startTimeISO = `${reservationDetails.date}T${reservationDetails.startTime}:00`;
      const endTimeISO = `${reservationDetails.date}T${reservationDetails.endTime}:00`;

      const requestData = {
        userno: loginUser.userno,
        placeno: place.placeno,
        placename: place.placename,
        start_time: startTimeISO,
        end_time: endTimeISO,
        purpose: reservationDetails.purpose,
        status: '예약됨'
      };

      const res = await axios.post('/reservations', requestData);
      console.log('예약 성공:', res.data);

      alert('예약이 완료되었습니다.');
      setShowReservationPopup(false);
      window.location.reload();
      
    } catch (err) {
      console.error('예약 실패:', err);
      const errorMsg = err.response?.data?.message || err.message || '예약 중 오류가 발생했습니다.';
      alert(errorMsg);
    }
  };

  const timeOptions = Array.from({ length: (22 - 9) * 2 + 1 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });

  const startTimeOptions = timeOptions.slice(0, -1);
  const endTimeOptions = timeOptions;

  const renderTimetable = () => (
    <>
      {/* 주차 네비게이션 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigateWeek(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'transparent',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#495057'
            }}
          >
            <ChevronLeft size={16} />
            이전 주
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              {weekDates.length > 0 && (
                `${weekDates[0].getFullYear()}년 ${weekDates[0].getMonth() + 1}월`
              )}
            </div>
            <button
              onClick={goToToday}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              오늘
            </button>
          </div>
          
          <button
            onClick={() => navigateWeek(1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'transparent',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#495057'
            }}
          >
            다음 주
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 시간표 그리드 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        border: '1px solid #e9ecef',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  padding: '8px 4px',
                  fontWeight: '600',
                  fontSize: '11px',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  시간
                </th>
                {weekDates.map((date, index) => {
                  const dayNames = ['월', '화', '수', '목', '금'];
                  const isToday = formatDate(date) === formatDate(new Date());
                  
                  return (
                    <th 
                      key={index}
                      style={{
                        backgroundColor: isToday ? '#e3f2fd' : '#f8f9fa',
                        color: isToday ? '#1976d2' : '#495057',
                        padding: '8px 4px',
                        fontWeight: '600',
                        fontSize: '11px',
                        minWidth: '80px',
                        textAlign: 'center',
                        borderLeft: '1px solid #e9ecef'
                      }}
                    >
                      <div>{dayNames[index]}요일</div>
                      <div style={{ fontSize: '10px', marginTop: '2px' }}>
                        {formatDateDisplay(date)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 13 }, (_, i) => i + 9).map(hour => (
                <tr key={hour} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{
                    backgroundColor: '#f8f9fa',
                    padding: '8px 4px',
                    fontWeight: '500',
                    fontSize: '10px',
                    color: '#495057',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </td>
                  {weekDates.map((date, dayIndex) => {
                    const { status, schedule, reservation } = getStatus(dayIndex, hour);
                    const isToday = formatDate(date) === formatDate(new Date());

                    const getCellStyle = () => {
                      let style = {
                        padding: '8px 4px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        borderLeft: '1px solid #e9ecef',
                        transition: 'all 0.2s',
                        position: 'relative',
                        height: '36px'
                      };
                      
                      if (isToday) {
                        style.borderLeft = '2px solid #1976d2';
                      }
                      
                      switch (status) {
                        case 'existing':
                          return { ...style, backgroundColor: '#9e9e9e', color: 'white' };
                        case 'blocked':
                          return { ...style, backgroundColor: '#e9ecef', color: '#adb5bd' };
                        case 'reserved':
                          return { ...style, backgroundColor: '#B8D0FA', color: '#212529' };
                        case 'past':
                          return { ...style, backgroundColor: '#f8f9fa', color: '#adb5bd', textDecoration: 'line-through' };
                        default: // available
                          return { ...style, backgroundColor: isToday ? '#f3f9ff' : '#fff' };
                      }
                    };

                    return (
                      <td key={`${dayIndex}-${hour}`} style={getCellStyle()}>
                        {status === 'existing' && schedule && (
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: '600' }}>{schedule.subject}</div>
                            <div style={{ fontSize: '9px', opacity: 0.9 }}></div>
                          </div>
                        )}
                        {status === 'blocked' && <X size={14} />}
                        {status === 'reserved' && reservation && (
                          <div style={{ fontSize: '11px', fontWeight: '600' }}></div>
                        )}
                        {status === 'past' && ( // 새로 추가
                          <div style={{ fontSize: '10px', color: '#adb5bd' }}></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 범례 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '12px',
        marginTop: '16px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#9e9e9e', borderRadius: '3px' }}></div>
            <span style={{ fontSize: '11px', color: '#666' }}>기존 수업</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <div style={{ width: '12px', height: '12px', backgroundColor: '#e9ecef', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><X size={10} color="#6c757d" /></div>
            <span style={{ fontSize: '11px', color: '#666' }}>예약 불가</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#B8D0FA', borderRadius: '3px' }}></div>
            <span style={{ fontSize: '11px', color: '#666' }}>예약됨</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#e3f2fd', borderRadius: '3px', border: '1px solid #1976d2' }}></div>
            <span style={{ fontSize: '11px', color: '#666' }}>오늘</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#f8f9fa', borderRadius: '3px',
            textDecoration: 'line-through',
            border: '1px solid #adb5bd'
          }}></div>
          <span style={{ fontSize: '11px', color: '#666' }}>지난 시간</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderNotes = () => (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
      <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 600 }}>강의실 사용 유의사항</h3>
      <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.8, color: '#495057' }}>
        <li>강의실 사용 후에는 다음 사용자를 위해 깨끗하게 정리정돈을 해주시기 바랍니다.</li>
        <li>음식물 반입은 절대 금지입니다. (음료는 가능)</li>
        <li>기자재 사용에 각별히 주의해주시고, 파손 시 즉시 관리자에게 알려주시기 바랍니다.</li>
        <li>예약 시간은 30분 전후부터 예약 가능하며, 반드시 준수해주시기 바랍니다.</li>
        <li>사용 후 모든 전원은 반드시 꺼주시기 바랍니다.</li>
      </ul>
    </div>
  );

  const renderReservationPopup = () => {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          width: '450px',
          maxWidth: '90vw'
        }}>
          <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: 600 }}>강의실 예약</h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>날짜</label>
            <input type="date" name="date" value={reservationDetails.date} onChange={handleReservationChange} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>시작 시간</label>
              <select name="startTime" value={reservationDetails.startTime} onChange={handleReservationChange} style={inputStyle}>
                {startTimeOptions.map(time => {
                  const isDisabled = isTimeSlotBlocked(reservationDetails.date, time);
                  return <option key={time} value={time} disabled={isDisabled} style={{ color: isDisabled ? '#adb5bd' : '#000' }}>{time}</option>
                })}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>종료 시간</label>
              <select name="endTime" value={reservationDetails.endTime} onChange={handleReservationChange} style={inputStyle}>
                {endTimeOptions.map(time => {
                  const isDisabled = isTimeSlotBlocked(reservationDetails.date, time) || timeToMinutes(time) <= timeToMinutes(reservationDetails.startTime);
                  return <option key={time} value={time} disabled={isDisabled} style={{ color: isDisabled ? '#adb5bd' : '#000' }}>{time}</option>
                })}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>예약 목적</label>
            <textarea name="purpose" value={reservationDetails.purpose} onChange={handleReservationChange} placeholder="예약 목적을 입력하세요." style={{ ...inputStyle, height: '80px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => setShowReservationPopup(false)} style={{ ...buttonStyle, backgroundColor: '#6c757d', margin: 0 }}>취소</button>
            <button onClick={handleReservation} style={{...buttonStyle, margin: 0}}>예약</button>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '50px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        alignItems: 'flex-start'
      }}>
        {/* Main Content */}
        <div style={{ flex: 1, maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{
            fontSize:'24px', marginTop:'40px', textAlign: 'left', fontWeight: '600'
          }}>
            {loginUser?.schoolname}  강의실
          </p>
          
          {/* 그림 */}
          <div style={{
            width:'700px',
            height: '350px',
            borderRadius: '12px',
            backgroundImage: `url("/gangDetail.png")`,

          }}>
          </div>
          
          {/* 탭 메뉴 */}
          <div style={{ display: 'flex', borderBottom: '2px solid #e9ecef' }}>
            <button 
              onClick={() => setActiveTab('timetable')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'timetable' ? '600' : '500',
                color: activeTab === 'timetable' ? '#007bff' : '#495057',
                borderBottom: activeTab === 'timetable' ? '2px solid #007bff' : 'none',
                marginBottom: '-2px'
              }}
            >
              강의실 시간표
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'notes' ? '600' : '500',
                color: activeTab === 'notes' ? '#007bff' : '#495057',
                borderBottom: activeTab === 'notes' ? '2px solid #007bff' : 'none',
                marginBottom: '-2px'
              }}
            >
              유의사항
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          <div style={{ marginTop: '20px' }}>
            {activeTab === 'timetable' ? renderTimetable() : renderNotes()}
          </div>

        </div>

        {/* Sidebar */}
        <div style={{
          width: '320px',
          position: 'sticky',
          alignItems: 'center',
          justifyContent: 'center',
          top: '40px'
        }}>
          <div style={{
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: '18px', fontWeight: 600 }}>{place.placename}</h3>
            <button style={buttonStyle} onClick={() => navigate('/place/PlacesPage')}>돌아가기</button>
            <button style={{...buttonStyle, marginTop: '10px'}} onClick={() => setShowReservationPopup(true)}>예약하기</button>
          </div>
        </div>
      </div>
      {showReservationPopup && renderReservationPopup()}
    </div>
  );
}

export default PlaceDetailPage;


const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: '#007bff',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  outline: 'none',
  width: '80%',
  margin: '0 auto'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ced4da',
  borderRadius: '8px',
  fontSize: '14px',
  boxSizing: 'border-box'
};