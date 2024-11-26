import { useState } from "react";
import { dataRoom } from "./interface/roomInterface";
import { fakeDataRoom } from "./fakedata/dataRoom";
interface CreateRoomProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataRoom: () => void;
}

export default function CreateRoom({
  setIsCreate,
  fetchDataRoom,
}: CreateRoomProps) {
  const [newRoom, setNewRoom] = useState<dataRoom>({
    id: "",
    maSo: "",
    tinhTrang: "",
    diaChi: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate creating a new room
    setTimeout(() => {
      // Add the new room to the fake data (in a real app, you would send a request to the server)
      fakeDataRoom.push(newRoom);
      fetchDataRoom(); // Refetch the data after creating a new room
      setIsCreate(false); // Close the create room form
    }, 500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Tạo phòng mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">ID</label>
            <input
              type="text"
              name="id"
              value={newRoom.id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mã Số</label>
            <input
              type="text"
              name="maSo"
              value={newRoom.maSo}
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
              value={newRoom.tinhTrang}
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
              value={newRoom.diaChi}
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
