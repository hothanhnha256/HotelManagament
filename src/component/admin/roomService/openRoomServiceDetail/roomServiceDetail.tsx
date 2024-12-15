import React, { useState } from "react";
import { RoomServiceProps } from "../roomService";
import { RoomServiceCategory } from "../roomService";
export interface RoomServiceInterface {
  entry: RoomServiceProps;
  type: RoomServiceCategory;
  onClose: () => void;
  refreshData: () => void;
}

export default function RoomServiceDetail(props: RoomServiceInterface) {
  const [newRoomService, setNewRoomService] = useState<RoomServiceProps>({
    MaDichVu: props.entry.MaDichVu,
    TuyChonGiat: props.entry.TuyChonGiat,
    LoaiXe: props.entry.LoaiXe,
    SucChua: props.entry.SucChua,
    MucGia: props.entry.MucGia,
    MoTa: props.entry.MoTa,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRoomService((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (
      !newRoomService.MaDichVu ||
      !newRoomService.MucGia ||
      !newRoomService.MoTa
    ) {
      setError("All fields are required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    setError("");

    // Prepare form data in x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append("serviceId", newRoomService.MaDichVu);
    if (newRoomService.TuyChonGiat)
      formData.append("washingOption", newRoomService.TuyChonGiat);
    if (newRoomService.LoaiXe)
      formData.append("vehicleType", newRoomService.LoaiXe);
    if (newRoomService.SucChua)
      formData.append("roomCapacity", newRoomService.SucChua.toString());
    formData.append("price", newRoomService.MucGia.toString());
    formData.append("desciption", newRoomService.MoTa);
    if (props.type === "meetingRoom") {
      formData.append("type", "meeting room");
    } else {
      formData.append("type", props.type);
    }
    //console.log("Updating RoomService: ", newRoomService);
    //console.log("Form Data: ", formData.toString());

    try {
      //console.log(formData);

      const response = await fetch(`${APIURL}/room-service`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      //console.log("Updated RoomService: ", result);
      props.refreshData(); // Refresh the data after updating
      props.onClose(); // Close the form after successful update
    } catch (error) {
      //console.log("Failed to update RoomService ", error);
      setError("Failed to update RoomService. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Chi tiết dịch vụ phòng
          </h2>
          <button
            className="ml-4 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white font-semibold py-1 px-2 border border-gray-300 dark:border-gray-600 rounded"
            onClick={props.onClose}
          >
            X
          </button>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Mã Dịch Vụ
            </label>
            <input
              type="text"
              name="MaDichVu"
              value={newRoomService.MaDichVu}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
              disabled
            />
          </div>
          {newRoomService.TuyChonGiat !== undefined && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Tùy Chọn Giặt
              </label>
              <input
                type="text"
                name="TuyChonGiat"
                value={newRoomService.TuyChonGiat}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>
          )}
          {newRoomService.LoaiXe !== undefined && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Loại Xe
              </label>
              <input
                type="text"
                name="LoaiXe"
                value={newRoomService.LoaiXe}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>
          )}
          {newRoomService.SucChua !== undefined && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Sức Chứa
              </label>
              <input
                type="number"
                name="SucChua"
                value={newRoomService.SucChua}
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
              name="MucGia"
              value={newRoomService.MucGia}
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
              name="MoTa"
              value={newRoomService.MoTa}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={props.onClose}
              className="mr-4 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
