import { useState } from "react";
import { createRoom } from "./interface/createRoomInterface";
import { BranchDetail } from "./interface/branchInterface";
interface CreateRoomProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataRoom: () => void;
}

export default function CreateRoom({
  setIsCreate,
  fetchDataRoom,
}: CreateRoomProps) {
  const [newRoom, setNewRoom] = useState<createRoom>({
    capacity: 0,
    branchId: "",
    description: "",
    type: "",
    roomNumber: 0,
  });

  const [branches, setBranches] = useState<BranchDetail[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRoom((prev: createRoom) => ({ ...prev, [name]: value }));
  };
  const handleFetchBranch = async () => {
    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${APIURL}/branches`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Branches: ", result);
      setBranches(result.data);
    } catch (error) {
      console.log("Failed to fetch branches: ", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    // Prepare form data in x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append("capacity", newRoom.capacity.toString());
    formData.append("branchId", newRoom.branchId);
    formData.append("description", newRoom.description);
    formData.append("type", newRoom.type);
    formData.append("roomNumber", newRoom.roomNumber.toString());

    try {
      const response = await fetch(`${APIURL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      console.log("Response: ", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      fetchDataRoom();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      console.log("Failed to create room: ", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Tạo phòng mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Sức chứa</label>
            <input
              type="number"
              name="capacity"
              value={newRoom.capacity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mã chi nhánh</label>
            <select
              name="branchId"
              value={newRoom.branchId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              onClick={handleFetchBranch}
            >
              <option value="">Chọn chi nhánh</option>
              {branches.map((branch) => (
                <option key={branch.MaChiNhanh} value={branch.MaChiNhanh}>
                  {branch.DiaChi}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mô tả</label>
            <input
              type="text"
              name="description"
              value={newRoom.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Loại phòng</label>
            <select
              name="type"
              value={newRoom.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Chọn loại phòng</option>
              <option value="vip">Phòng VIP</option>
              <option value="normal">Phòng thường</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số phòng</label>
            <input
              type="number"
              name="roomNumber"
              value={newRoom.roomNumber}
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
