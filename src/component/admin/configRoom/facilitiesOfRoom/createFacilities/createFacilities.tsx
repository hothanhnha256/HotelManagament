import { useState } from "react";
import type { CreateFacilitiesDetail } from "./createFacilitiesInterface";

interface CreateFacilitiesProps {
  idRoom: string;
  setIsCreate: (isCreate: boolean) => void;
  fetchDataFacilities: () => void;
}

export default function CreateFacilities({
  idRoom,
  setIsCreate,
  fetchDataFacilities,
}: CreateFacilitiesProps) {
  const [newFacilities, setNewFacilities] = useState<CreateFacilitiesDetail>({
    tenTrangBi: "",
    giaMua: "",
    maSanPham: "",
    tinhTrang: "",
    imageURL: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewFacilities((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (!newFacilities.tenTrangBi) {
      setError("Tên trang bị không được để trống.");
      return false;
    }
    if (!newFacilities.giaMua) {
      setError("Giá mua không được để trống.");
      return false;
    }
    if (!newFacilities.maSanPham) {
      setError("Mã sản phẩm không được để trống.");
      return false;
    }
    if (!newFacilities.tinhTrang) {
      setError("Tình trạng không được để trống.");
      return false;
    }
    setError(null);
    return true;
  };

  const APIURL = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const requestBody = {
      tenTrangBi: newFacilities.tenTrangBi,
      giaMua: newFacilities.giaMua,
      maSanPham: newFacilities.maSanPham,
      tinhTrang: newFacilities.tinhTrang,
      imageURL: newFacilities.imageURL,
    };
    //console.log("Request body: ", requestBody);

    try {
      const response = await fetch(`${APIURL}/facilities/create/${idRoom}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      //console.log("Response: ", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      //console.log("Create new Facilities: ", result);
      fetchDataFacilities();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      //console.log("Failed to create Facilities ", error);
      setError("Failed to create Facilities. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Tạo tiện nghi mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Tên trang bị</label>
            <input
              type="text"
              name="tenTrangBi"
              value={newFacilities.tenTrangBi}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Giá mua</label>
            <input
              type="number"
              name="giaMua"
              value={newFacilities.giaMua}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mã sản phẩm</label>
            <input
              type="text"
              name="maSanPham"
              value={newFacilities.maSanPham}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tình trạng</label>
            <select
              name="tinhTrang"
              value={newFacilities.tinhTrang}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Chọn tình trạng</option>
              <option value="good">Tốt</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">URL hình ảnh</label>
            <input
              type="text"
              name="imageURL"
              value={newFacilities.imageURL}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsCreate(false)}
              className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
