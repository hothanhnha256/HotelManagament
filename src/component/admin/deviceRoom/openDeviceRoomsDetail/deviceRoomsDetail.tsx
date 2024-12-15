import React, { useState } from "react";
import { DeviceRoomsProps } from "../deviceRooms";

export interface DeviceRoomsInterface {
  entry: DeviceRoomsProps;
  onClose: () => void;
  refreshData: () => void;
}

export interface UpdateDeviceRoomsDetail {
  salePricePerUnit: string;
  importPricePerUnit: string;
  quantity: number;
}

export default function DeviceRoomsDetail(props: DeviceRoomsInterface) {
  const [newDeviceRooms, setNewDeviceRooms] = useState<UpdateDeviceRoomsDetail>(
    {
      salePricePerUnit: props.entry.GiaBanDonVi,
      importPricePerUnit: props.entry.GiaNhapDonVi,
      quantity: props.entry.SoLuong,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDeviceRooms((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Prepare form data in x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append("salePricePerUnit", newDeviceRooms.salePricePerUnit);
    formData.append("importPricePerUnit", newDeviceRooms.importPricePerUnit);
    formData.append("quantity", newDeviceRooms.quantity.toString());

    try {
      const response = await fetch(`${APIURL}/goods/${props.entry.ID}`, {
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
      //console.log("Updated DeviceRooms: ", result);
      props.refreshData(); // Refresh the data after updating
      props.onClose(); // Close the form after successful update
    } catch (error) {
      //console.log("Failed to update deviceRoom ", error);
      setError("Failed to update device room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Chi tiết sản phẩm
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
          <p>
            <strong>Tên sản phẩm:</strong> {props.entry.TenSanPham}
          </p>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Giá nhập mỗi đơn vị
            </label>
            <input
              type="text"
              name="importPricePerUnit"
              value={newDeviceRooms.importPricePerUnit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Giá bán mỗi đơn vị
            </label>
            <input
              type="text"
              name="salePricePerUnit"
              value={newDeviceRooms.salePricePerUnit}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Số lượng
            </label>
            <input
              type="number"
              name="quantity"
              value={newDeviceRooms.quantity}
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
