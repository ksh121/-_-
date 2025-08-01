import axios from 'axios';

const uploadFile = async (files, targetType, talentno, profile) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));  // 'files' 복수 key로 다중 파일 전송
  formData.append('targetType', targetType);
  formData.append('talentno', talentno);
  formData.append('profile', profile);

  const response = await axios.post('/api/file/upload-multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;  // 보통 업로드 성공 시 파일 DTO 배열 반환
};

export default uploadFile;
