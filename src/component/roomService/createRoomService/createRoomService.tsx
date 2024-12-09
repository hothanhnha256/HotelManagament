import { useState } from "react";
import {
  CreateRoomServiceDetail,
  RoomServiceType,
  RoomServiceID,
} from "./createRoomServiceInterface";

interface CreateRoomServiceProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataRoomService: () => void;
}

export default function CreateRoomService({
  setIsCreate,
  fetchDataRoomService,
}: CreateRoomServiceProps) {
  const [newRoomService, setNewRoomService] = useState<CreateRoomServiceDetail>(
    {
      type: RoomServiceType.laundry,
      serviceId: "",
      price: "",
      description: "",
      vehicleType: "",
      washingOption: "",
      roomCapacity: "",
    }
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRoomService((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (
      !newRoomService.type ||
      !newRoomService.serviceId ||
      !newRoomService.price ||
      !newRoomService.description
    ) {
      setError("All fields are required.");
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
    formData.append("type", newRoomService.type);
    formData.append(
      "serviceId",
      RoomServiceID[newRoomService.type as keyof typeof RoomServiceID] +
        newRoomService.serviceId
    );

    formData.append("price", newRoomService.price);
    formData.append("description", newRoomService.description);
    if (newRoomService.vehicleType)
      formData.append("vehicleType", newRoomService.vehicleType);
    if (newRoomService.washingOption)
      formData.append("washingOption", newRoomService.washingOption);
    if (newRoomService.roomCapacity)
      formData.append("roomCapacity", newRoomService.roomCapacity);

    try {
      const response = await fetch(`${APIURL}/room-service`, {
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
      console.log("Create new RoomService: ", result);
      fetchDataRoomService();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      console.log("Failed to create RoomService ", error);
      setError("Failed to create RoomService. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Tạo dịch vụ phòng mới
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Loại Dịch Vụ
            </label>
            <select
              name="type"
              value={newRoomService.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            >
              <option value={RoomServiceType.laundry}>Giặt ủi</option>
              <option value={RoomServiceType.transport}>Vận chuyển</option>
              <option value={RoomServiceType.food}>Thức ăn</option>
              <option value={RoomServiceType.meetingroom}>Phòng họp</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Mã Dịch Vụ
            </label>
            <input
              type="text"
              name="serviceId"
              value={newRoomService.serviceId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          {newRoomService.type === RoomServiceType.laundry && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Tùy Chọn Giặt
              </label>
              <input
                type="text"
                name="washingOption"
                value={newRoomService.washingOption}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>
          )}
          {newRoomService.type === RoomServiceType.transport && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Loại Xe
              </label>
              <input
                type="text"
                name="vehicleType"
                value={newRoomService.vehicleType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>
          )}
          {newRoomService.type === RoomServiceType.meetingroom && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Sức Chứa
              </label>
              <input
                type="number"
                name="roomCapacity"
                value={newRoomService.roomCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Mức Giá
            </label>
            <input
              type="number"
              name="price"
              value={newRoomService.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Mô Tả
            </label>
            <input
              type="text"
              name="description"
              value={newRoomService.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsCreate(false)}
              className="mr-4 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded"
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
