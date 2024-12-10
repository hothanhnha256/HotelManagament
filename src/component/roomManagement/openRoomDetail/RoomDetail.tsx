import React, { useState, useEffect } from "react";
import { dataRoom } from "../interface/roomInterface";

export interface RoomInterface {
  entry: dataRoom | null;
  onClose: () => void;
  fetchDataRoom: () => Promise<void>;
}

export interface UpdateRoomDetail {
  status?: string;
  description?: string;
  housekeeperId?: string;
  discountId?: string;
  roomInChargePersonID?: string;
  capacity?: number;
  linkedRoomId?: string;
}

export default function RoomDetail(props: RoomInterface) {
  const [newRoom, setNewRoom] = useState<UpdateRoomDetail>({
    status: props.entry?.TrangThai || "",
    description: props.entry?.MoTa || "",
    housekeeperId: props.entry?.IDNhanVienDonPhong || "",
    discountId: props.entry?.IDGiamGia || "",
    roomInChargePersonID: props.entry?.IDNhanVienPhong || "",
    capacity: props.entry?.SucChua || 0,
    linkedRoomId: props.entry?.MaPhongLienKet || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (props.entry) {
      setNewRoom({
        status: props.entry.TrangThai || "",
        description: props.entry.MoTa || "",
        housekeeperId: props.entry.IDNhanVienDonPhong || "",
        discountId: props.entry.IDGiamGia || "",
        roomInChargePersonID: props.entry.IDNhanVienPhong || "",
        capacity: props.entry.SucChua || 0,
        linkedRoomId: props.entry.MaPhongLienKet || "",
      });
    }
  }, [props.entry]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (newRoom.capacity !== undefined && newRoom.capacity <= 0) {
      setError("Sức chứa phải lớn hơn 0");
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
    if (newRoom.status) formData.append("status", newRoom.status);
    if (newRoom.description)
      formData.append("description", newRoom.description);
    if (newRoom.housekeeperId)
      formData.append("housekeeperId", newRoom.housekeeperId);
    if (newRoom.discountId) formData.append("discountId", newRoom.discountId);
    if (newRoom.roomInChargePersonID)
      formData.append("roomInChargePersonID", newRoom.roomInChargePersonID);
    if (newRoom.capacity !== undefined)
      formData.append("capacity", newRoom.capacity.toString());
    if (newRoom.linkedRoomId)
      formData.append("linkedRoomId", newRoom.linkedRoomId);

    try {
      const response = await fetch(`${APIURL}/rooms/${props.entry?.MaPhong}`, {
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
      console.log("Updated Room: ", result);
      props.fetchDataRoom(); // Refresh the data after updating
      props.onClose(); // Close the form after successful update
    } catch (error) {
      console.log("Failed to update Room ", error);
      setError("Failed to update Room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Chi tiết phòng
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
            <strong>ID:</strong> {props.entry?.MaPhong}
          </p>
          <p>
            <strong>Loại phòng:</strong> {props.entry?.LoaiPhong}
          </p>
          <p>
            <strong>Mã chi nhánh:</strong> {props.entry?.MaChiNhanh}
          </p>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Trạng thái
            </label>
            <select
              name="status"
              value={newRoom.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="">Chọn trạng thái</option>
              <option value="in use">Đang sử dụng</option>
              <option value="maintenance">Đang bảo trì</option>
              <option value="empty">Trống</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Mô tả
            </label>
            <input
              type="text"
              name="description"
              value={newRoom.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              ID nhân viên dọn phòng
            </label>
            <input
              type="text"
              name="housekeeperId"
              value={newRoom.housekeeperId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              ID giảm giá
            </label>
            <input
              type="text"
              name="discountId"
              value={newRoom.discountId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              ID nhân viên phòng
            </label>
            <input
              type="text"
              name="roomInChargePersonID"
              value={newRoom.roomInChargePersonID}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Sức chứa
            </label>
            <input
              type="number"
              name="capacity"
              value={newRoom.capacity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Mã phòng liên kết
            </label>
            <input
              type="text"
              name="linkedRoomId"
              value={newRoom.linkedRoomId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
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
