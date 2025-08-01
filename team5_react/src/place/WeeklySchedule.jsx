import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Filter, Plus, X, Check } from 'lucide-react';

const WeeklySchedule = () => {
  // 기본 시간표 데이터
  const scheduleData = [
    { day: '월요일', time: '09:00:00 ~ 10:30:00', subject: '수학', location: '101호', type: 'occupied' },
    { day: '화요일', time: '11:00:00 ~ 12:30:00', subject: '국어', location: '104호', type: 'occupied' },
    { day: '수요일', time: '09:00:00 ~ 10:30:00', subject: '역사', location: '105호', type: 'occupied' },
    { day: '목요일', time: '11:00:00 ~ 12:30:00', subject: '미술', location: '미술실', type: 'occupied' },
    { day: '금요일', time: '09:00:00 ~ 10:30:00', subject: '컴퓨터', location: '컴퓨터실', type: 'occupied' }
  ];

  const days = ['월요일', '화요일', '수요일', '목요일', '금요일'];
  const timeSlots = ['09:00:00 ~ 10:30:00', '11:00:00 ~ 12:30:00'];

  const [selectedDay, setSelectedDay] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSchedule, setFilteredSchedule] = useState(scheduleData);
  const [reservations, setReservations] = useState([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservationForm, setReservationForm] = useState({
    subject: '',
    location: '',
    description: ''
  });

  // 검색 기능
  const searchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      filterSchedule();
    }
  };

  const filterSchedule = () => {
    let filtered = [...scheduleData, ...reservations];
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDay) {
      filtered = filtered.filter(item => item.day === selectedDay);
    }

    setFilteredSchedule(filtered);
  };

  useEffect(() => {
    filterSchedule();
  }, [selectedDay, searchQuery, reservations]);

  const isOccupied = (day, time) => {
    return filteredSchedule.some(item => item.day === day && item.time === time);
  };

  const getScheduleItem = (day, time) => {
    return filteredSchedule.find(item => item.day === day && item.time === time);
  };

  const handleSlotClick = (day, time) => {
    const existingItem = getScheduleItem(day, time);
    
    if (existingItem) {
      if (existingItem.type === 'reservation') {
        // 예약 취소
        if (window.confirm('예약을 취소하시겠습니까?')) {
          setReservations(reservations.filter(r => !(r.day === day && r.time === time)));
        }
      } else {
        // 기존 수업 정보 표시
        alert(`${existingItem.subject}\n위치: ${existingItem.location}\n시간: ${existingItem.time}`);
      }
    } else {
      // 새 예약 모달 열기
      setSelectedSlot({ day, time });
      setShowReservationModal(true);
    }
  };

  const handleReservation = () => {
    if (!reservationForm.subject || !reservationForm.location) {
      alert('과목명과 장소를 입력해주세요.');
      return;
    }

    const newReservation = {
      day: selectedSlot.day,
      time: selectedSlot.time,
      subject: reservationForm.subject,
      location: reservationForm.location,
      description: reservationForm.description,
      type: 'reservation'
    };

    setReservations([...reservations, newReservation]);
    setShowReservationModal(false);
    setReservationForm({ subject: '', location: '', description: '' });
    setSelectedSlot(null);
  };

  const closeModal = () => {
    setShowReservationModal(false);
    setReservationForm({ subject: '', location: '', description: '' });
    setSelectedSlot(null);
  };

  // 사이드바 컴포넌트
  const ScheduleSideBar = ({ setSelectedDay, selectedDay }) => {
    const categories = [
      { id: null, name: '전체', icon: '📅' },
      { id: '월요일', name: '월요일', icon: '🌙' },
      { id: '화요일', name: '화요일', icon: '🔥' },
      { id: '수요일', name: '수요일', icon: '💧' },
      { id: '목요일', name: '목요일', icon: '🌳' },
      { id: '금요일', name: '금요일', icon: '⭐' }
    ];

    return (
      <div style={{
        width: '240px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        padding: '20px',
        height: 'fit-content',
        position: 'sticky',
        top: '30px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Filter size={18} />
          요일별 필터
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedDay(category.id)}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: selectedDay === category.id ? '#007bff' : '#f8f9fa',
                color: selectedDay === category.id ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '14px' }}>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <h3 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#666',
            marginBottom: '8px'
          }}>
            📊 통계
          </h3>
          <div style={{ fontSize: '11px', color: '#777', lineHeight: '1.6' }}>
            <div>전체 수업: {scheduleData.length}개</div>
            <div>예약: {reservations.length}개</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* 사이드바 */}
        <ScheduleSideBar 
          setSelectedDay={setSelectedDay} 
          selectedDay={selectedDay}
        />

        {/* 중앙 컨텐츠 영역 */}
        <div style={{ flex: 1, maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 헤더 */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)', 
            padding: '20px' 
          }}>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              color: '#333', 
              margin: 0, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '16px'
            }}>
              <Calendar size={24} />
              {selectedDay ? `${selectedDay} ` : ''}시간표 예약
            </h1>

            {/* 검색 영역 */}
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999',
                zIndex: 1
              }} size={16} />
              <input
                type="text"
                placeholder="과목명이나 장소를 검색하세요..."  
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
                value={searchQuery}
                onChange={searchChange}
                onKeyDown={handleSearch}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              />
            </div>
          </div>

          {/* 시간표 그리드 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '12px 8px',
                      fontWeight: '600',
                      fontSize: '12px',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}>
                      시간
                    </th>
                    {days.map(day => (
                      <th 
                        key={day}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '12px 8px',
                          fontWeight: '600',
                          fontSize: '12px',
                          minWidth: '100px',
                          textAlign: 'center',
                          borderLeft: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time, index) => (
                    <tr key={time} style={{ borderBottom: index < timeSlots.length - 1 ? '1px solid #e1e5e9' : 'none' }}>
                      <td style={{
                        backgroundColor: '#f8f9fa',
                        padding: '12px 8px',
                        fontWeight: '500',
                        fontSize: '11px',
                        color: '#495057',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}>
                        {time.split(' ~ ')[0]}<br/>~<br/>{time.split(' ~ ')[1]}
                      </td>
                      {days.map(day => {
                        const occupied = isOccupied(day, time);
                        const scheduleItem = getScheduleItem(day, time);
                        const isReservation = scheduleItem?.type === 'reservation';
                        
                        return (
                          <td 
                            key={`${day}-${time}`}
                            style={{
                              padding: '12px 8px',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                              borderLeft: '1px solid #e1e5e9',
                              backgroundColor: occupied 
                                ? (isReservation ? '#28a745' : '#007bff') 
                                : '#f8f9fa',
                              color: occupied ? 'white' : '#6c757d',
                              transition: 'all 0.2s',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                            onClick={() => handleSlotClick(day, time)}
                          >
                            {occupied ? (
                              <div>
                                <div style={{
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginBottom: '2px'
                                }}>
                                  {scheduleItem.subject}
                                </div>
                                <div style={{
                                  fontSize: '10px',
                                  opacity: 0.9
                                }}>
                                  {scheduleItem.location}
                                </div>
                                {isReservation && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '2px',
                                    right: '2px',
                                    fontSize: '8px',
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                    padding: '1px 4px',
                                    borderRadius: '8px'
                                  }}>
                                    예약
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div style={{
                                fontSize: '20px',
                                color: '#007bff',
                                opacity: 0.6
                              }}>
                                <Plus size={16} />
                              </div>
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#007bff',
                  borderRadius: '3px'
                }}></div>
                <span style={{ fontSize: '12px', color: '#666' }}>기존 수업</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#28a745',
                  borderRadius: '3px'
                }}></div>
                <span style={{ fontSize: '12px', color: '#666' }}>예약 완료</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={12} color="#007bff" />
                <span style={{ fontSize: '12px', color: '#666' }}>예약 가능</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 예약 모달 */}
      {showReservationModal && (
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
            width: '400px',
            maxWidth: '90vw'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                margin: 0
              }}>
                시간표 예약
              </h3>
              <button
                onClick={closeModal}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} color="#666" />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '8px'
              }}>
                선택된 시간: {selectedSlot?.day} {selectedSlot?.time}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '6px'
              }}>
                과목명 *
              </label>
              <input
                type="text"
                placeholder="과목명을 입력하세요"
                value={reservationForm.subject}
                onChange={(e) => setReservationForm({...reservationForm, subject: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '6px'
              }}>
                장소 *
              </label>
              <input
                type="text"
                placeholder="장소를 입력하세요"
                value={reservationForm.location}
                onChange={(e) => setReservationForm({...reservationForm, location: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '6px'
              }}>
                설명 (선택사항)
              </label>
              <textarea
                placeholder="추가 설명을 입력하세요"
                value={reservationForm.description}
                onChange={(e) => setReservationForm({...reservationForm, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: '60px'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '10px 20px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                취소
              </button>
              <button
                onClick={handleReservation}
                style={{
                  padding: '10px 20px',
                  border: '2px solid #28a745',
                  borderRadius: '8px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Check size={16} />
                예약하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;