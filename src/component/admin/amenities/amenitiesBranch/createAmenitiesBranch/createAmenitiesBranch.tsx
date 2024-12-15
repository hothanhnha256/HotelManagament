import { useState } from "react";
import type { CreateAmenitiesBranchDetail } from "./createAmenitiesBranchInterface";

interface CreateAmenitiesBranchProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataAmenitiesBranch: () => void;
}

export default function CreateAmenitiesBranch({
  setIsCreate,
  fetchDataAmenitiesBranch,
}: CreateAmenitiesBranchProps) {
  const [newAmenitiesBranch, setNewAmenitiesBranch] =
    useState<CreateAmenitiesBranchDetail>({
      name: "",
      description: "",
      branchId: "",
    });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAmenitiesBranch((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    //console.log("newAmenitiesBranch: ", newAmenitiesBranch);
    if (!newAmenitiesBranch.name) {
      setError("Tên không được để trống.");
      return false;
    }
    if (!newAmenitiesBranch.branchId) {
      setError("Chi nhánh không được để trống.");
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
    formData.append("name", newAmenitiesBranch.name);
    formData.append("description", newAmenitiesBranch.description);
    formData.append("branchId", newAmenitiesBranch.branchId);
    try {
      const response = await fetch(`${APIURL}/amenities/branch`, {
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
      //console.log("Create new AmenitiesBranch: ", result);
      fetchDataAmenitiesBranch();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      //console.log("Failed to create AmenitiesBranch ", error);
      setError("Failed to create AmenitiesBranch. Please try again.");
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
              name="name"
              value={newAmenitiesBranch.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mô tả</label>
            <input
              type="text"
              name="description"
              value={newAmenitiesBranch.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Chi nhánh</label>
            <select
              name="branchId"
              value={newAmenitiesBranch.branchId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Chọn chi nhánh</option>
              <option value="CN01">Điện Biên Phủ</option>
              <option value="CN02">Bà Huyện Thanh Quan</option>
            </select>
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
