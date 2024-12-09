import { useState } from "react";
import type { CreateDiscountDetail } from "./createDiscountInterface";

interface CreateDiscountProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataDiscount: () => void;
}

export default function CreateDiscount({
  setIsCreate,
  fetchDataDiscount,
}: CreateDiscountProps) {
  const [newDiscount, setNewDiscount] = useState<CreateDiscountDetail>({
    discountId: "",
    startTime: new Date().toISOString().slice(0, 16),
    finishTime: new Date().toISOString().slice(0, 16),
    discountPercent: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDiscount((prev) => ({ ...prev, [name]: value }));
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
    const startTime = new Date(newDiscount.startTime);
    const finishTime = new Date(newDiscount.finishTime);

    if (!newDiscount.discountId) {
      setError("Mã giảm giá không được để trống.");
      return false;
    }
    if (startTime > finishTime) {
      setError("Thời gian bắt đầu không được lớn hơn thời gian kết thúc.");
      return false;
    }
    if (newDiscount.discountPercent <= 0 || newDiscount.discountPercent > 100) {
      setError("Phần trăm giảm giá phải lớn hơn 0 và nhỏ hơn hoặc bằng 100.");
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
    formData.append("discountId", newDiscount.discountId);
    formData.append("startTime", formatDateTime(newDiscount.startTime));
    formData.append("finishTime", formatDateTime(newDiscount.finishTime));
    formData.append("discountPercent", newDiscount.discountPercent.toString());

    try {
      const response = await fetch(`${APIURL}/discounts`, {
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
      console.log("Create new Discount: ", result);
      fetchDataDiscount();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      console.log("Failed to create discount ", error);
      setError("Failed to create discount. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Tạo mã giảm giá mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Mã giảm giá</label>
            <input
              type="text"
              name="discountId"
              value={newDiscount.discountId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Thời gian bắt đầu giảm giá
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={newDiscount.startTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Thời gian kết thúc giảm giá
            </label>
            <input
              type="datetime-local"
              name="finishTime"
              value={newDiscount.finishTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phần trăm giảm giá</label>
            <input
              type="number"
              name="discountPercent"
              value={newDiscount.discountPercent}
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
