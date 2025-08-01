import React, { useContext, useState } from 'react';
import TalentCreateForm from './TalentCreateForm';
import TalentTypeList from './TalentTypeList';
import { GlobalContext } from '../../components/GlobalContext';
import '../style/TalentType.css';

export default function TalentType() {
  const { loginUser } = useContext(GlobalContext);
  if (!loginUser || loginUser.role !== 'admin') {
    return <div>접근 권한이 없습니다.</div>;
  }

  return (
    <div className="page-wrapper">
    <div className="talentcate-list-container1">
      <TalentCreateForm />
    </div>
    <div className="talentcate-list-container">
      <TalentTypeList />
    </div>
    </div>
  );
} 