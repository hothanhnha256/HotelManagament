import { useState } from "react";
import type { CreateDeviceRoomsDetail } from "./createDeviceRoomsInterface";

interface CreateDeviceRoomsProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataDeviceRooms: () => void;
}

export default function CreateDeviceRooms({
  setIsCreate,
  fetchDataDeviceRooms,
}: CreateDeviceRoomsProps) {
  const [newDeviceRooms, setNewDeviceRooms] = useState<CreateDeviceRoomsDetail>(
    {
      goodName: "",
      salePricePerUnit: "",
      importPricePerUnit: "",
      quantity: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDeviceRooms((prev) => ({ ...prev, [name]: value }));
  };

  const APIURL = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(JSON.stringify(newDeviceRooms));

    // Prepare form data in x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append("goodName", newDeviceRooms.goodName);
    formData.append("salePricePerUnit", newDeviceRooms.salePricePerUnit);
    formData.append("importPricePerUnit", newDeviceRooms.importPricePerUnit);
    formData.append("quantity", newDeviceRooms.quantity.toString());
    try {
      const response = await fetch(`${APIURL}/goods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Create new DeviceRooms: ", result);
      fetchDataDeviceRooms();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      console.log("Failed to create deviceRoom ", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Thêm đồ tiêu dùng</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Tên sản phẩm</label>
            <input
              type="text"
              name="goodName"
              value={newDeviceRooms.goodName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Giá nhập mỗi đơn vị</label>
            <input
              type="text"
              name="importPricePerUnit"
              value={newDeviceRooms.importPricePerUnit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Giá bán mỗi đơn vị</label>
            <input
              type="text"
              name="salePricePerUnit"
              value={newDeviceRooms.salePricePerUnit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng</label>
            <input
              type="number"
              name="quantity"
              value={newDeviceRooms.quantity}
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
