import React, { useState, useContext } from 'react';
import TalentCategoryCreateForm from './TalentCategoryCreateForm';
import TalentCategoryList from './TalentCategoryList';
import { GlobalContext } from '../../components/GlobalContext';
import '../style/TalentCategory.css';

const TalentCategory = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { loginUser } = useContext(GlobalContext);

  if (!loginUser || loginUser.role !== 'admin') {
    return <div className="no-access">접근 권한이 없습니다.</div>;
  }

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="main-container">
      <div className="main-content">
        <div className="content-area">
          <div className="talentcate-form-box">
            <TalentCategoryCreateForm onCreated={triggerRefresh} />
          </div>
          <div className="posts-box">
            <TalentCategoryList refresh={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentCategory;