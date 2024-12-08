import React from "react";
import { useState } from "react";
import type { CreateAmenitiesDetail } from "./createFacilitiesInterface";

interface CreateAmenitiesProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataAmenities: () => void;
}

export default function CreateAmenities({
  setIsCreate,
  fetchDataAmenities,
}: CreateAmenitiesProps) {
  const [newAmenities, setNewAmenities] = useState<CreateAmenitiesDetail>({
    ten: "",
    moTa: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAmenities((prev) => ({ ...prev, [name]: value }));
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
    if (!newAmenities.ten) {
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
    formData.append("AmenitiesId", newAmenities.ten);
    formData.append("startTime", newAmenities.moTa);

    try {
      const response = await fetch(`${APIURL}/amenities`, {
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
      console.log("Create new Amenities: ", result);
      fetchDataAmenities();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      console.log("Failed to create Amenities ", error);
      setError("Failed to create Amenities. Please try again.");
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
              value={newAmenities.ten}
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
              value={newAmenities.moTa}
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
