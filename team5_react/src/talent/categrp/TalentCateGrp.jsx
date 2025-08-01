import React, { useState, useContext } from 'react';
import TalentCateGrpCreateForm from './TalentCateGrpCreateForm';
import TalentCateGrpList from './TalentCateGrpList';
import { GlobalContext } from '../../components/GlobalContext';
import '../style/TalentCateGrp.css';

const TalentCateGrp = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { loginUser } = useContext(GlobalContext);

  if (!loginUser || loginUser.role !== 'admin') {
    return <div className="no-access">접근 권한이 없습니다.</div>;
  }

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="page-wrapper">
      <h1 className="page-title">카테고리 관리</h1>
      <div className="talent-cate-container">
        <TalentCateGrpCreateForm onCreated={triggerRefresh} />
      </div>
      <div className="talent-cate-container">
      <TalentCateGrpList refresh={refreshKey} />
      </div>
    </div>

  );
};

export default TalentCateGrp;