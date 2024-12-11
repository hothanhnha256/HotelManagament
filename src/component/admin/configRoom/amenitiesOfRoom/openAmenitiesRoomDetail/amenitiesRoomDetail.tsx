import React, { useState } from "react";
import { AmenitiesRoomProps } from "../amenitiesRoom";
export interface AmenitiesRoomInterface {
  entry: AmenitiesRoomProps;
  onClose: () => void;
  refreshData: () => void;
}

export interface UpdateAmenitiesRoomDetail {
  ten: string;
  moTa: string;
}

export default function AmenitiesRoomDetail(props: AmenitiesRoomInterface) {
  const [newAmenitiesRoom, setNewAmenitiesRoom] =
    useState<UpdateAmenitiesRoomDetail>({
      ten: props.entry.Ten,
      moTa: props.entry.MoTa,
    });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    // Prepare form data in x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append("ten", newAmenitiesRoom.ten);
    formData.append("moTa", newAmenitiesRoom.moTa);

    try {
      const response = await fetch(
        `${APIURL}/amenities/rooms/update/${props.entry.ID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Updated AmenitiesRoom: ", result);
      props.refreshData(); // Refresh the data after updating
      props.onClose(); // Close the form after successful update
    } catch (error) {
      console.log("Failed to update AmenitiesRoom ", error);
      setError("Failed to update AmenitiesRoom. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Chi tiết mã giảm giá
          </h2>
          <button
            className="ml-4 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white font-semibold py-1 px-2 border border-gray-300 dark:border-gray-600 rounded"
            onClick={props.onClose}
          >
            X
          </button>
        </div>
        <div className="text-black dark:text-white">
          <p>
            <strong>ID:</strong> {props.entry.ID}
          </p>
        </div>
        <form onSubmit={handleUpdate}>
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
