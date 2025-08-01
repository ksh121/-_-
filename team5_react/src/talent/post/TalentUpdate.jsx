import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContext";
import uploadFile from "../../fileupload/FileUpload";

function TalentUpdate() {
  const { talentno } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useContext(GlobalContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    typeno: "",
    cateGrpno: "",
    categoryno: "",
    fileInfos: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [cateGrpList, setCateGrpList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/talent/detail/${talentno}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 불러온 데이터", data);
        setForm({
          title: data.title,
          description: data.description,
          price: data.price ?? "",
          typeno: data.typeno,
          cateGrpno: data.cateGrpno,
          categoryno: data.categoryno,
          fileInfos: data.fileInfos || [],
        });
      })
      .catch(() => setError("데이터 불러오기 실패"));
  }, [talentno]);

  useEffect(() => {
    fetch("/talent_type/list").then((res) => res.json()).then((data) => setTypeList(data.content || []));
    fetch("/talent_cate_grp/list").then((res) => res.json()).then((data) => setCateGrpList(data.content || []));
  }, []);

  useEffect(() => {
    if (form.cateGrpno) {
      fetch(`/talent_category/list-by-categrp/${form.cateGrpno}`)
        .then((res) => res.json())
        .then((data) => setCategoryList(data));
    }
  }, [form.cateGrpno]);

  useEffect(() => {
    if (typeList.length > 0 && form.typeno) {
      setForm((prev) => ({ ...prev, typeno: Number(prev.typeno) }));
    }
  }, [typeList]);
  useEffect(() => {
    if (cateGrpList.length > 0 && form.cateGrpno) {
      setForm((prev) => ({ ...prev, cateGrpno: Number(prev.cateGrpno) }));
    }
  }, [cateGrpList]);
  useEffect(() => {
    if (categoryList.length > 0 && form.categoryno) {
      setForm((prev) => ({ ...prev, categoryno: Number(prev.categoryno) }));
    }
  }, [categoryList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(raw)) return;
    setForm((prev) => ({ ...prev, price: raw }));
  };

  const formattedPrice = Number(form.price || 0).toLocaleString();

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const deleteImage = (index) => {
    const updatedFiles = form.fileInfos.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, fileInfos: updatedFiles }));
  };

  const handleSubmit = async () => {
    try {
      let uploadedFileData = [];
      if (selectedFiles.length > 0) {
        uploadedFileData = await uploadFile(
          selectedFiles,
          "talent",
          talentno,
          loginUser.profile
        );
      }

      const dto = {
        ...form,
        talentno: Number(talentno),
        typeno: Number(form.typeno),
        categoryno: Number(form.categoryno),
        price: Number(form.price), // ✅ 추가
        fileInfos: [...form.fileInfos, ...uploadedFileData],
      };

      console.log("📤 수정 요청 DTO:", dto);

      const res = await fetch(`/talent/update/${talentno}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error("서버 응답 오류:", res.status, msg);
        throw new Error("수정 실패");
      }

      alert("수정 완료!");
      navigate(`/talent/detail/${talentno}`);
    } catch (e) {
      alert("오류: " + e.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">재능 수정</h2>
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="제목"
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />

      {/* ✅ 가격 입력 */}
      <input
        type="text"
        name="price"
        value={formattedPrice}
        onChange={handlePriceChange}
        placeholder="가격 (숫자만)"
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="설명"
        rows="4"
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />

      <select
        name="typeno"
        value={form.typeno || ""}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      >
        <option value="">타입 선택</option>
        {typeList.map((type) => (
          <option key={type.typeno} value={type.typeno}>{type.name}</option>
        ))}
      </select>

      <select
        name="cateGrpno"
        value={form.cateGrpno || ""}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      >
        <option value="">대분류 선택</option>
        {cateGrpList.map((grp) => (
          <option key={grp.cateGrpno} value={grp.cateGrpno}>{grp.name}</option>
        ))}
      </select>

      <select
        name="categoryno"
        value={form.categoryno || ""}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      >
        <option value="">소분류 선택</option>
        {categoryList.map((cat) => (
          <option key={cat.categoryno} value={cat.categoryno}>{cat.name}</option>
        ))}
      </select>

      <input type="file" multiple onChange={handleFileChange} className="mb-4" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {form.fileInfos.map((file, index) => (
          <div key={index} className="relative">
            <img
              src={`/uploads/talent/${file.storedFileName}`}
              alt={file.originalFileName}
              className="w-full h-[180px] object-cover rounded shadow"
            />
            <button
              onClick={() => deleteImage(index)}
              className="absolute top-1 right-1 bg-white text-black px-2 py-1 rounded shadow text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          저장
        </button>
        <button
          className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default TalentUpdate;
