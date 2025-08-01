// src/pages/MyPageProfile.jsx
import React, { useState, useEffect, useContext } from 'react';
import { User, Info, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../components/GlobalContext';

/* ▶ 공통 스타일 */
const fieldWrap = { marginBottom: 10 };
const labelStyle = { display:'block', fontWeight:'bold' };
const inputStyle = { width:'100%', padding:6 , textAlign: 'center'};
const btn = { padding:'8px 16px', cursor:'pointer' };

export default function MyPageProfile() {
  const navigate                    = useNavigate();
  const { loginUser, setLoginUser } = useContext(GlobalContext);
  const [editing,    setEditing]    = useState(false);       // ✨ 보기·수정 전환
  const [form, setForm]             = useState({});
  const [profileFile, setProfileFile] = useState(null);
  const userno  = loginUser?.userno;
  const baseUrl = '/uploads/user/';

  /* 최초·Context 변경 시 form 채우기 */
  useEffect(() => { loginUser && setForm(loginUser); }, [loginUser]);

  /* ----------------- 핸들러 ----------------- */
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    // 미리보기를 위해 로컬 URL 생성
    setForm({ ...form, profileImage: URL.createObjectURL(file) });
  };

  /** 저장 */
  const handleUpdate = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k,v));
    if (profileFile) fd.append('profileImage', profileFile);

    try {
      const res = await fetch('/user/update', { method:'POST', body:fd, credentials:'include' });
      const json = await res.json();
      if (json.sw) {
        setLoginUser(json.user);                // Context 갱신
        setEditing(false);
        alert('수정 완료!');
      } else alert(json.msg);
    } catch(err) { console.error(err); alert('오류'); }
  };

  // 전화번호 형식을 변환하는 함수
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return ''; // 전화번호가 null, undefined, 빈 문자열인 경우 처리
  
  // 숫자가 아닌 모든 문자를 제거하고 숫자만 남깁니다.
  const cleaned = phoneNumber.replace(/\D/g, '');

  // 11자리 숫자인 경우 (예: 01012345678)
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } 
  // 10자리 숫자인 경우 (예: 0101234567 또는 0212345678)
  else if (cleaned.length === 10) {
    // 02로 시작하는 10자리 (서울 번호 등)
    if (cleaned.startsWith('02')) {
      return cleaned.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
    }
    // 그 외 10자리 (01X로 시작하는 번호)
    return cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  }
  // 그 외 경우 (예: 지역번호 포함, 9자리 등)
  // 필요에 따라 더 많은 패턴을 추가할 수 있습니다.
  return cleaned; // 포맷팅이 불가능하면 원래 값 반환
};

  /* ----------------- 렌더 ----------------- */
  if (!loginUser) return null; // 로딩 등 처리

  return (
    <div style={{
      maxWidth:800, margin:'20px auto', padding:20,
      background:'#fff', borderRadius:12, border:'2px solid #e0f2fe'
    }}>
      {/* 헤더 */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, color:'#64748b', fontSize:14 }}>
        <span>기본정보</span><Info size={16}/>
      </div>

      {/* 프로필/사진/이름 */}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:30 }}>
        <div style={{ display:'flex', alignItems:'center', gap:15 }}>
          <div style={{
            width:60, height:60, borderRadius:'50%', overflow:'hidden',
            background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            {form.profileImage
              ? <img src={form.profileImage.startsWith('blob:')
                        ? form.profileImage
                        : baseUrl+form.profileImage}
                     alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              : <User size={30} color="#94a3b8"/>}
          </div>
          <div>
            <div style={{ fontSize:24, fontWeight:'bold', color:'#1e293b' }}>{form.username}</div>
            <div style={{ fontSize:14, color:'#64748b' }}>{form.email}</div>
          </div>
        </div>

        <button
          onClick={() => editing ? setEditing(false) : setEditing(true)}
          style={{ ...btn, background:'white', border:'1px solid #cbd5e1', borderRadius:6, color:'#64748b' }}>
          {editing ? '취소' : '정보수정'}
        </button>
      </div>

      {/* ---------- 보기 모드 ---------- */}
      {!editing && (
        <>
          <InfoRow icon={<Mail size={18} color="#64748b"/>} label="이메일" value={form.email}/>
          <InfoRow icon={<Phone size={18} color="#64748b"/>} label="전화번호" value={formatPhoneNumber(form.phone)}/>
          <InfoRow icon={<User  size={18} color="#64748b"/>} label="닉네임"   value={form.name}/>
          {/* 필요하면 추가 */}
        </>
      )}

      {/* ---------- 편집 모드 ---------- */}
      {editing && (
        <form onSubmit={handleUpdate}>
          {[
            ['username','이름'],['name','닉네임'],
            ['email','이메일','email'],['phone','전화번호'],
            ['zipcode','우편번호'],['address','주소'],
            ['language','언어'],['location','위치']
          ].map(([name,label,type='text'])=>(
            <div key={name} style={fieldWrap}>
              <label style={labelStyle}>{label}</label>
              <input style={inputStyle} name={name} type={type}
                     value={form[name]||''} onChange={handleChange}/>
            </div>
          ))}

          <div style={fieldWrap}>
            <label style={labelStyle}>자기소개</label>
            <textarea name="bio" rows={3} style={inputStyle}
                      value={form.bio||''} onChange={handleChange}/>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>프로필 사진</label>
            <input type="file" accept="image/*" onChange={handleFileChange}/>
          </div>

          <div style={{ textAlign:'center', marginTop:20 }}>
            <button type="submit" style={{ ...btn, background:'#0ea5e9', color:'#fff', borderRadius:6 }}>
              저장
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* 재사용 뷰용 라인 */
function InfoRow({icon,label,value}) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 0', borderBottom:'1px solid #e2e8f0'
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {icon}<span style={{ fontSize:14, color:'#1e293b' }}>{label}</span>
      </div>
      <span style={{ fontSize:14, color:'#64748b' }}>{value}</span>
    </div>
  );
}
