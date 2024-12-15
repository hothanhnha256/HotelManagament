import React, { useState } from "react";
import { FacilitiesProps } from "../facilities";

export interface FacilitiesInterface {
  idRoom: string;
  entry: FacilitiesProps;
  onClose: () => void;
  refreshData: () => void;
}

export interface UpdateFacilitiesDetail {
  tinhTrang: string;
}

export default function FacilitiesDetail(props: FacilitiesInterface) {
  const [newFacilities, setNewFacilities] = useState<UpdateFacilitiesDetail>({
    tinhTrang: props.entry.TinhTrang,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewFacilities((prev) => ({ ...prev, [name]: value }));
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

    const requestBody = {
      tinhTrang: newFacilities.tinhTrang,
    };
    //console.log("Request Body: ", requestBody);
    //console.log(
      `${APIURL}/facilities/update/${props.idRoom}/${props.entry.ID}`
    );
    try {
      const response = await fetch(
        `${APIURL}/facilities/update/${props.idRoom}/${props.entry.ID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      //console.log("Response: ", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      //console.log("Updated Facilities: ", result);
      props.refreshData(); // Refresh the data after updating
      props.onClose(); // Close the form after successful update
    } catch (error) {
      //console.log("Failed to update Facilities ", error);
      setError("Failed to update Facilities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Chi tiết trang bị
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
            <strong>Tên trang bị:</strong> {props.entry.TenTrangBi}
          </p>
          <p>
            <strong>Giá mua:</strong> {props.entry.GiaMua}
          </p>
          <p>
            <strong>Mã sản phẩm:</strong> {props.entry.MaSanPham}
          </p>
          <p>
            <strong>Mã phòng:</strong> {props.entry.MaPhong}
          </p>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Tình Trạng
            </label>
            <select
              name="tinhTrang"
              value={newFacilities.tinhTrang}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              {props.entry.TinhTrang === "good" ? (
                <>
                  <option value="good">Tốt</option>
                  <option value="maintenance">Bảo trì</option>
                </>
              ) : (
                <>
                  <option value="maintenance">Bảo trì</option>
                  <option value="good">Tốt</option>
                </>
              )}
            </select>
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
