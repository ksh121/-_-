import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../components/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { User, Info, Phone, Mail, Edit, Trash2 } from 'lucide-react';

function UserProfile() {
  const { userno, setSw, setUserno, loginUser, setLoginUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: loginUser.username,
    name: loginUser.name,
    email: loginUser.email,
    phone: loginUser.phone,
    zipcode: loginUser.zipcode,
    address: loginUser.address,
    language: loginUser.language,
    location: loginUser.location,
    bio: loginUser.bio,
    role: loginUser.role,
    profileImage: loginUser.profileImage  // ⭐ 프로필 이미지 파일명
  });

  const [profileFile, setProfileFile] = useState(null); // ⭐ 업로드할 파일
  const baseUrl = "/uploads/user/";     // user 추가  << 폴더명
 
  // 사용자 정보 불러오기 (필요시 API 호출 추가)
  useEffect(() => {
     if (loginUser) {
    setForm(loginUser);
    console.log("✅ loginUser 정보:", loginUser);
  }
  }, [loginUser]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

 const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setProfileFile(file); // 파일 상태 저장

  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', 'PROFILE');
  formData.append('targetType', 'USER');
  formData.append('targetId', userno);

  try {
    const res = await fetch('/fileupload/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const result = await res.json();
    if (result && result.storedFileName) {
      const updatedForm = { ...form, profileImage: result.storedFileName };
      setForm(updatedForm);

      // loginUser에도 반영 (선택사항, sessionStorage 업데이트 용)
      loginUser.profileImage = result.storedFileName;
      sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
      
    } else {
      alert('업로드 실패');
    }
  } catch (err) {
    console.error(err);
    alert('업로드 중 오류 발생');
  }
};

  const handleProfileUpload = async () => {
    if (!profileFile) return alert('업로드할 파일을 선택하세요.');

    const formData = new FormData();
    formData.append('file', profileFile);
    formData.append('purpose', 'PROFILE');
    formData.append('targetType', 'USER');
    formData.append('targetId', userno);

    try {
      const res = await fetch('/fileupload/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const result = await res.json();
      if (result && result.storedFileName) {
        setForm({ ...form, profileImage: result.storedFileName });  // ⭐ 상태에 반영
      } else {
        alert('업로드 실패');
      }
    } catch (err) {
      console.error(err);
      alert('업로드 중 오류 발생');
    }
  };

  const handleUpdate = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  for (const key in form) {
    formData.append(key, form[key]);
  }
  if (profileFile) {
    formData.append('profileImage', profileFile); // 🔥 한 번에 업로드
  }

  try {
    const res = await fetch('/user/update', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const result = await res.json();
     if (result.sw) {
      const updatedUser = result.user;        // ← 서버가 보내준 최신 DTO
      /** 1️⃣ Context 갱신 */
      setLoginUser(updatedUser);

      alert('회원정보 수정 완료!');
    } else {
      alert('수정 실패: ' + result.msg);
    }
  } catch (err) {
    console.error(err);
    alert('오류 발생');
  }
};

  const handleDelete = () => {
  if (!window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

  axios.patch(`/user/${userno}/deactivate`)
    .then((res) => {
      const msg = res.data?.msg || '삭제 완료';
      alert(msg);
      //axios.post('/user/logout');
      navigate('/user/logout');
    })
    .catch((err) => {
      const errMsg = err.response?.data?.msg || '삭제 실패';
      alert(errMsg);
    });
};
console.log("프로필 이미지 파일명:", loginUser?.profileImage);
  return (
  <div style={{ width: '400px', margin: '0 auto', padding: '20px' }}>
    <h2 style={{ textAlign: 'center' }}>회원 정보 수정</h2>

    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <img
        src={form.profileImage ? baseUrl + loginUser?.profileImage : '/uploads/user/default-profile.png'}
        alt="프로필"
        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }}
      />
      <div style={{ marginTop: '10px' }}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </div>
    </div>

    <form onSubmit={handleUpdate}>
      {[
        ['username', '이름'],
        ['name', '닉네임'],
        ['email', '이메일', 'email'],
        ['phone', '전화번호'],
        ['zipcode', '우편번호'],
        ['address', '주소'],
        ['language', '언어'],
        ['location', '위치'],
      ].map(([name, label, type = 'text']) => (
        <div key={name} style={{ marginBottom: '10px' }}>
          <label htmlFor={name} style={{ display: 'block', fontWeight: 'bold' }}>{label}</label>
          <input
            id={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            style={{ width: '100%', padding: '6px' }}
            required={name === 'username'}
          />
        </div>
      ))}

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="bio" style={{ display: 'block', fontWeight: 'bold' }}>자기소개</label>
        <textarea
          id="bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          style={{ width: '100%', padding: '6px' }}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button type="submit" style={{ padding: '8px 16px' }}>수정하기</button>
      </div>
    </form>

    <hr style={{ margin: '30px 0' }} />

    <div style={{ textAlign: 'center' }}>
      <button onClick={handleDelete} style={{ color: 'red', background: 'none', border: '1px solid red', padding: '8px 16px' }}>
        회원 탈퇴
      </button>
    </div>
  </div>
);
}

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {icon}
      <span style={{ fontSize: '14px', color: '#1e293b' }}>{label}</span>
    </div>
    <span style={{ fontSize: '14px', color: '#64748b' }}>{value}</span>
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '14px'
};

const buttonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#0ea5e9',
  color: 'white',
  fontSize: '14px',
  cursor: 'pointer'
};

export default UserProfile;