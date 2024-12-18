import React, { useState } from "react";
import { AmenitiesBranchProps } from "../amenitiesBranch";

export interface AmenitiesBranchInterface {
  entry: AmenitiesBranchProps;
  onClose: () => void;
  refreshData: () => void;
}

export interface UpdateAmenitiesBranchDetail {
  ten: string;
  moTa: string;
  branchId: string;
}

export default function AmenitiesBranchDetail(props: AmenitiesBranchInterface) {
  const [newAmenitiesBranch, setNewAmenitiesBranch] =
    useState<UpdateAmenitiesBranchDetail>({
      ten: props.entry.Ten,
      moTa: props.entry.MoTa,
      branchId: props.entry.MaChiNhanh,
    });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAmenitiesBranch((prev) => ({ ...prev, [name]: value }));
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
    formData.append("name", newAmenitiesBranch.ten);
    formData.append("description", newAmenitiesBranch.moTa);
    formData.append("branchId", newAmenitiesBranch.branchId);

    try {
      const response = await fetch(
        `${APIURL}/amenities/branch/${props.entry.ID}`,
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
      //console.log("Updated AmenitiesBranch: ", result);
      props.refreshData(); // Refresh the data after updating
      props.onClose(); // Close the form after successful update
    } catch (error) {
      //console.log("Failed to update AmenitiesBranch ", error);
      setError("Failed to update AmenitiesBranch. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Chi tiết tiện nghi chi nhánh
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
              value={newAmenitiesBranch.ten}
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
              value={newAmenitiesBranch.moTa}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mã chi nhánh</label>
            <select
              name="branchId"
              value={newAmenitiesBranch.branchId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              {props.entry.MaChiNhanh == "CN01" ? (
                <>
                  <option value="CN01">Điện Biên Phủ</option>
                  <option value="CN02">Bà Huyện Thanh Quan</option>
                </>
              ) : (
                <>
                  <option value="CN02">Bà Huyện Thanh Quan</option>
                  <option value="CN01">Điện Biên Phủ</option>
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
