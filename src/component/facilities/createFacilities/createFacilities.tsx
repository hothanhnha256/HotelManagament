import { useState } from "react";
import type { CreateFacilitiesDetail } from "./createFacilitiesInterface";

interface CreateFacilitiesProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataFacilities: () => void;
}

export default function CreateFacilities({
  setIsCreate,
  fetchDataFacilities,
}: CreateFacilitiesProps) {
  const [newFacilities, setNewFacilities] = useState<CreateFacilitiesDetail>({
    maSo: "",
    tinhTrang: "",
    diaChi: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFacilities((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate creating a new Facilities
    setTimeout(() => {
      // Add the new Facilities to the fake data (in a real app, you would send a request to the server)
      fetchDataFacilities(); // Refetch the data after creating a new Facilities
      setIsCreate(false); // Close the create Facilities form
    }, 500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Tạo CSVC mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Mã Số</label>
            <input
              type="text"
              name="maSo"
              value={newFacilities.maSo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tình Trạng</label>
            <input
              type="text"
              name="tinhTrang"
              value={newFacilities.tinhTrang}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Địa Chỉ</label>
            <input
              type="text"
              name="diaChi"
              value={newFacilities.diaChi}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
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
