// 샘플 게시물 데이터
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "첫 번째 게시물 나중에 바꿔야함",
      content: "이것은 첫 번째 게시물의 내용입니다. 리액트로 만든 메인페이지가 잘 작동하고 있습니다.",
      author: "사용자1",
      date: "2025-06-27",
      likes: 12
    },
    {
      id: 2,
      title: "두 번째 게시물",
      content: "두 번째 게시물입니다. 검색 기능과 다양한 컴포넌트들이 포함되어 있습니다.",
      author: "사용자2",
      date: "2025-06-26",
      likes: 8
    },
    {
      id: 3,
      title: "세 번째 게시물",
      content: "마지막 게시물입니다. 반응형 디자인으로 모바일에서도 잘 보입니다.",
      author: "사용자3",
      date: "2025-06-25",
      likes: 15
    }
  ]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (event) => {
    if (event.keyCode === 13) {
      console.log('검색어:', searchQuery);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChatClick = () => {
    console.log('채팅 버튼 클릭');
  };

  const handleNotificationClick = () => {
    console.log('알림 버튼 클릭');
  };

    // 카테고리 데이터
  const categories = [
    {
      id: 1,
      name: '학업',
      icon: '📚',
      subcategories: [
        { id: 11, name: '수업 정보' },
        { id: 12, name: '시험 정보' },
        { id: 13, name: '과제 도움' },
        { id: 14, name: '학점 관리' }
      ]
    },
    {
      id: 2,
      name: '동아리',
      icon: '🎭',
      subcategories: [
        { id: 21, name: '동아리 모집' },
        { id: 22, name: '동아리 활동' },
        { id: 23, name: '공연/전시' },
        { id: 24, name: '봉사활동' }
      ]
    },
    {
      id: 3,
      name: '취업',
      icon: '💼',
      subcategories: [
        { id: 31, name: '인턴십' },
        { id: 32, name: '취업 정보' },
        { id: 33, name: '자격증' },
        { id: 34, name: '스펙 관리' }
      ]
    },
    {
      id: 4,
      name: '생활',
      icon: '🏠',
      subcategories: [
        { id: 41, name: '기숙사' },
        { id: 42, name: '맛집 정보' },
        { id: 43, name: '교통 정보' },
        { id: 44, name: '알바 정보' }
      ]
    },
    {
      id: 5,
      name: '자유게시판',
      icon: '💬',
      subcategories: [
        { id: 51, name: '잡담' },
        { id: 52, name: '질문' },
        { id: 53, name: '후기' },
        { id: 54, name: '건의사항' }
      ]
    }
  ];

  const handleCategoryClick = (categoryId, subcategoryId = null) => {
    console.log('카테고리 클릭:', categoryId, subcategoryId);
  };