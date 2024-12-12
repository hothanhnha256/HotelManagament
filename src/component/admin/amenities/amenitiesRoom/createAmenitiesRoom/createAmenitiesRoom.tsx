import { useState } from "react";
import type { CreateAmenitiesRoomDetail } from "./createAmenitiesRoomInterface";

interface CreateAmenitiesRoomProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataAmenitiesRoom: () => void;
}

export default function CreateAmenitiesRoom({
  setIsCreate,
  fetchDataAmenitiesRoom,
}: CreateAmenitiesRoomProps) {
  const [newAmenitiesRoom, setNewAmenitiesRoom] =
    useState<CreateAmenitiesRoomDetail>({
      ten: "",
      moTa: "",
    });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAmenitiesRoom((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  };

  const validateInputs = () => {
    if (!newAmenitiesRoom.ten) {
      setError("Tên không được để trống.");
      return false;
    }
    setError(null);
    return true;
  };

  const APIURL = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    // Prepare form data in x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append("ten", newAmenitiesRoom.ten);
    formData.append("moTa", newAmenitiesRoom.moTa);

    try {
      const response = await fetch(`${APIURL}/amenities/rooms`, {
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
      console.log("Create new AmenitiesRoom: ", result);
      fetchDataAmenitiesRoom();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      console.log("Failed to create AmenitiesRoom ", error);
      setError("Failed to create AmenitiesRoom. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Tạo tiện nghi mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Tên tiện nghi</label>
            <input
              type="text"
              name="ten"
              value={newAmenitiesRoom.ten}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mô tả</label>
            <input
              type="text"
              name="moTa"
              value={newAmenitiesRoom.moTa}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
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
