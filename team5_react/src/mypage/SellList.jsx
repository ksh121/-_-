import React, { useEffect, useContext, useState } from "react";
import { Search, Filter, ChevronDown, ChevronUp, MessageSquare, User, Star, Coins, ShoppingCart, DollarSign, FileText } from 'lucide-react';
import { GlobalContext } from '../components/GlobalContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RequestList = ({userno}) => {
  const [activeTab, setActiveTab] = useState('purchases'); // 'purchases' or 'sales'
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 변수명 통일
  const [statusFilter, setStatusFilter] = useState('all'); // 상태 필터
  const [sort, setSort] = useState("requestno");
  const [direction, setDirection] = useState("DESC");
  const [expandedItem, setExpandedItem] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const { loginUser } = useContext(GlobalContext); 

  useEffect(() => {
    // 구매내역 요청
    axios.get(`/request/purchases/${loginUser.userno}`)
    .then((res) => {
      setPurchases(res.data);
    })
    .catch((err) => {
      console.error('구매내역 가져오기 실패:', err);
    });

    // 판매내역 요청
    axios.get(`/request/sales/${loginUser.userno}`)
      .then((res) => {
        setSales(res.data);
      })
      .catch((err) => {
        console.error('판매내역 가져오기 실패:', err);
      });
  }, [userno]);

  // 필터링된 데이터 생성 (예약 컴포넌트의 로직 적용)
  const filteredData = (() => {
    let currentData = activeTab === 'purchases' ? purchases : sales;
    
    return currentData.filter((request) => {
      // 각 필드 널 병합 연산자로 기본값 설정 (빈 문자열)
      const talentTitle = request.talentTitle ?? '';
      const receivername = request.receivername ?? '';
      const givername = request.givername ?? '';
      const message = request.message ?? '';
      const price = request.price?.toString() ?? '';
      const status = request.status ?? '';

      // 검색어 소문자 변환
      const search = searchTerm.toLowerCase();

      // 검색 조건: 게시물 제목, 멘토/멘티명, 메시지, 가격 중 하나라도 포함되면 true
      const matchesSearch = searchTerm === '' || 
        talentTitle.toLowerCase().includes(search) ||
        receivername.toLowerCase().includes(search) ||
        givername.toLowerCase().includes(search) ||
        message.toLowerCase().includes(search) ||
        price.includes(search);

      // 상태 필터링
      const matchesStatus = 
        statusFilter === 'all' || 
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  })();

  // 정렬 적용
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sort];
    let bValue = b[sort];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (direction === 'ASC') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleExpanded = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return '거래중';
      case 'completed': return '완료';
      case 'rejected': return '취소';
      case 'pending': return '대기';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6 min-h-[400px] max-h-[80vh] overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{loginUser.username}님의 거래목록</h1>
          
          {/* 탭 메뉴 */}
          <div className="flex border-b border-gray-200 mt-4">
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'purchases'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('purchases')}
            >
              <div className="flex items-center gap-2">
                구매내역 ({purchases.length})
              </div>
            </button>

            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'sales'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('sales')}
            >
              <div className="flex items-center gap-2">
                판매내역 ({sales.length})
              </div>
            </button>
          </div>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="게시물명, 사용자명, 메시지, 가격으로 검색..."
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
                <option value="all">전체</option>
                <option value="pending">대기</option>
                <option value="accepted">거래중</option>
                <option value="completed">완료</option>
                <option value="rejected">취소</option>
              </select>
            </div>
          </div>

          {/* 정렬 옵션
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">정렬 기준:</span>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)} 
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="requestno">거래번호</option>
                <option value="status">상태</option>
                <option value="price">가격</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">정렬 방향:</span>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="DESC">내림차순</option>
                <option value="ASC">오름차순</option>
              </select>
            </div>
          </div> */}
        </div>

        {/* 거래 리스트 */}
        <div className="space-y-4">
          {sortedData.length > 0 ? (
            sortedData.map((request) => (
              <div
                key={request.requestno}
                className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleExpanded(request.requestno)}
                >
                  <div className="flex items-start">
                    <div className="text-left">
                        <div className="flex items-center text-gray-800 font-medium mb-1">
                          <FileText className="w-4 h-4 mr-2 text-blue-600" />
                          <Link to={`/talent/detail/${request.talentno}`} className="text-blue-600 hover:underline">
                              게시물: {request.talentTitle}
                            </Link>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Coins className="w-4 h-4 mr-2 text-gray-600"></Coins>
                          재능가격: {request.price}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                      {expandedItem === request.requestno ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" /> 
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                     </div>
                  </div>
                

                {/* 확장된 상세 정보 */}
                {expandedItem === request.requestno && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-1 " />
                          {activeTab === 'purchases' ? '멘토' : '멘티'}: {activeTab === 'purchases' ? request.receivername : request.givername}님
                        </div>
                        <div className="flex items-center">
                          {activeTab === 'purchases' ? 
                            <ShoppingCart className="w-4 h-4 text-blue-500 mr-2" /> :
                            <DollarSign className="w-4 h-4 text-green-500 mr-2" />
                          }
                          <span className="text-sm text-gray-600">
                            {activeTab === 'purchases' ? '구매한 서비스' : '판매한 서비스'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <span className="text-gray-600 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            메시지:
                          </span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700">
                            {request.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {activeTab === 'purchases' ? '구매 내역이' : '판매 내역이'} 없습니다
              </h3>
              <p className="text-gray-500">
                검색 조건을 변경하거나 새로운 거래를 추가해보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestList;