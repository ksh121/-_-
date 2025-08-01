import axios from 'axios';
import React, { useState, useContext, useEffect  } from 'react';
import { Search, Calendar, Clock, CalendarX, GraduationCap, Filter, ChevronDown, ChevronUp, CalendarCheck } from 'lucide-react';
import { GlobalContext } from '../components/GlobalContext';
import _ from 'lodash';

const MyPageReservation = () => {
  const { loginUser } = useContext(GlobalContext); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('예약됨');
  const [expandedItem, setExpandedItem] = useState(null);
  const [reservations, setReservations] = useState([]);
  
  

const fetchReservations = async () => {
  try {
    const response = await axios.get(`/reservations/user/${loginUser.userno}`);
    setReservations(response.data);
  } catch (error) {
    console.error('예약 정보를 가져오는 중 오류 발생:', error);
  }
};

useEffect(() => {
  if (loginUser?.userno) {
    fetchReservations();
  }
}, [loginUser]);


  const getStatusColor = (status) => {
    switch (status) {
      case '예약됨': return 'bg-blue-100 text-blue-800';
      case '취소됨': return 'bg-red-100 text-red-800';
      case '완료됨': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case '예약됨': return '예약';
      case '취소됨': return '취소';
      case '완료됨': return '완료';
      default: return status;
    }
  };

  //취소
const handleCancel = (reservationno) => {
  if (window.confirm("정말 취소하시겠습니까?")) {
    // 취소 API 호출
    axios.patch(`/reservations/${reservationno}/cancel`)
      .then(() => {
        alert("예약이 취소되었습니다.");
        // 예약 목록 다시 불러오기 또는 상태 업데이트
        fetchReservations();
      })
      .catch((error) => {
        console.error("예약 취소 중 오류 발생:", error);
        alert("예약 취소에 실패했습니다.");
      });
  }
};

  const filteredReservations = reservations.filter((reservation) => {
    
    // 각 필드 널 병합 연산자로 기본값 설정 (빈 문자열)
    const username = reservation.username ?? '';
    const placename = reservation.placename ?? '';
    const purpose = reservation.purpose ?? '';
    const status = reservation.status ?? '';

    // 검색어 소문자 변환
    const search = searchTerm.toLowerCase();

    // 검색 조건: 사용자 이름, 장소 이름, 목적 중 하나라도 포함되면 true
    const matchesSearch =
      username.toLowerCase().includes(search) ||
      placename.toLowerCase().includes(search) ||
      purpose.toLowerCase().includes(search);

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === '예약됨' && (status === '예약됨' || status === '완료됨')) ||
      (statusFilter === '취소됨' && status === '취소됨');

    return matchesSearch && matchesStatus;
  });

  
  const toggleExpanded = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

    // 날짜별로 예약을 그룹화하는 함수
  const groupReservationsByDate = (reservations) => {

    // 1. start_time 기준 내림차순 정렬
    const sortedReservations = [...reservations].sort((a, b) => 
      new Date(b.start_time) - new Date(a.start_time) 
    );

    return _.groupBy(sortedReservations, (reservation) => {
      const date = new Date(reservation.start_time);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    });
  };

  // 날짜를 정렬하는 함수 (최신 날짜부터)
  const sortDateGroups = (groupedReservations) => {
    return Object.keys(groupedReservations)
      .sort((a, b) => new Date(b.split('.').reverse().join('-')) - new Date(a.split('.').reverse().join('-')))
      .reduce((acc, date) => {
        acc[date] = groupedReservations[date];
        return acc;
      }, {});
  };

  // 컴포넌트 내에서 사용할 코드
  const groupedReservations = sortDateGroups(groupReservationsByDate(filteredReservations));

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6 min-h-[400px] max-h-[80vh] overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">나의 예약목록</h1>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="장소명, 상태로 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {/* <option value="all">전체 목록</option>  전체 목록이 필요할것같으면 열기 */}
                <option value="예약됨">예약/완료</option>
                <option value="취소됨">취소</option>
              </select>
            </div>
          </div>
        </div>


        
        {/* 예약 리스트 */}
        <div className="space-y-6">
          {Object.keys(groupedReservations).length > 0 ? (
            Object.entries(groupedReservations).map(([date, reservations]) => (
              <div key={date} className="space-y-4">
                {/* 날짜 헤더 */}
                <div className="text-left text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                  {date}
                </div>
                
                {/* 해당 날짜의 예약들 */}
                <div className="space-y-4 ml-4">
                  {reservations.map((reservation) => (
                    <div
                      key={reservation.reservationno}
                      className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleExpanded(reservation.reservationno)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {reservation.status === '예약됨' ? (
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <CalendarCheck className="w-6 h-6 text-blue-600" />
                                </div>
                              ) : reservation.status === '완료됨' ? (
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                  <CalendarCheck className="w-6 h-6 text-green-600" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                  <CalendarX className="w-6 h-6 text-red-600" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {reservation.username}
                              </h3>
                              <p className="text-gray-600">{reservation.placename}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="flex items-center text-gray-600 mb-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                {reservation.start_time.split('T')[0]}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-1" />
                                {reservation.start_time.split('T')[1].slice(0, 5)} ~ {reservation.end_time.split('T')[1].slice(0, 5)}
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                              {getStatusText(reservation.status)}
                            </span>
                            {expandedItem === reservation.reservationno ? 
                              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            }
                          </div>
                        </div>
                      </div>

                      {/* 확장된 상세 정보 */}
                      {expandedItem === reservation.reservationno && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="font-medium">{loginUser.schoolname} {reservation.schoolgwanname} {reservation.placename}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="ml-1 font-medium">신청일: {reservation.createdAt.split('T')[0]}   {reservation.createdAt.split('T')[1].slice(0, 5)}</span>
                              </div>
                            </div>
                            <div>
                              <div className="mb-2">
                                <span className="text-gray-600">예약 목적:</span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-700">
                                  {reservation.purpose}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 액션 버튼들 */}
                          <div className="flex justify-end space-x-2 mt-4">
                            {reservation.status === '예약됨' && (
                              <button 
                                onClick={() => handleCancel(reservation.reservationno)}
                                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                취소
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">강의실 예약이 없습니다</h3>
              <p className="text-gray-500">검색 조건을 변경하거나 새로운 강의실을 예약해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>    
  );
};

export default MyPageReservation; 