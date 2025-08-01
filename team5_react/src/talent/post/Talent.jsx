// src/talent/TalentManager.jsx
import React, { useState, useEffect } from 'react';

import TalentCreateForm from './TalentCreateForm';
import TalentList from './TalentList';


const TalentManager = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // 새로고침 트리거 함수 (create, update, delete 후 호출)
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div>
      <h2>재능 관리</h2>
      <TalentCreateForm onCreated={triggerRefresh} />
      <hr />
      <TalentList refresh={refreshKey} onUpdated={triggerRefresh} onDeleted={triggerRefresh} />
    </div>
  );
};

export default TalentManager;
