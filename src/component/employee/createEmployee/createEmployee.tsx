import { useState } from "react";
import type { CreateEmployeeDetail } from "./createEmployeeInterface";

interface CreateEmployeeProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataEmployee: () => void;
}

export default function CreateEmployee({
  setIsCreate,
  fetchDataEmployee,
}: CreateEmployeeProps) {
  const [newEmployee, setNewEmployee] = useState<CreateEmployeeDetail>({
    name: "",
    sex: "",
    salary: "",
    dateOfBirth: "",
    ssn: "",
    citizenId: "",
    bankAccount: "",
    role: "",
    startWorkingDate: "",
    eduLevel: "",
    branchId: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (
      !newEmployee.name ||
      !newEmployee.sex ||
      !newEmployee.salary ||
      !newEmployee.dateOfBirth ||
      !newEmployee.ssn ||
      !newEmployee.citizenId ||
      !newEmployee.bankAccount ||
      !newEmployee.role ||
      !newEmployee.startWorkingDate ||
      !newEmployee.eduLevel ||
      !newEmployee.branchId
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
    for (const [key, value] of Object.entries(newEmployee)) {
      formData.append(key, value);
    }

    try {
      const response = await fetch(`${APIURL}/employees`, {
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
      console.log("Create new Employee: ", result);
      fetchDataEmployee();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      console.log("Failed to create Employee ", error);
      setError("Failed to create Employee. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Tạo nhân viên mới
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Họ Tên
            </label>
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Giới Tính
            </label>
            <select
              name="sex"
              value={newEmployee.sex}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Ngày Sinh
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={newEmployee.dateOfBirth}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Lương
            </label>
            <input
              type="number"
              name="salary"
              value={newEmployee.salary}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Mã BHXH
            </label>
            <input
              type="text"
              name="ssn"
              value={newEmployee.ssn}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              CCCD
            </label>
            <input
              type="text"
              name="citizenId"
              value={newEmployee.citizenId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Số Tài Khoản
            </label>
            <input
              type="text"
              name="bankAccount"
              value={newEmployee.bankAccount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Vai Trò
            </label>
            <input
              type="text"
              name="role"
              value={newEmployee.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Thời Gian Bắt Đầu Làm Việc
            </label>
            <input
              type="date"
              name="startWorkingDate"
              value={newEmployee.startWorkingDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Trình Độ Học Vấn
            </label>
            <input
              type="text"
              name="eduLevel"
              value={newEmployee.eduLevel}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Mã Chi Nhánh
            </label>
            <select
              name="branchId"
              value={newEmployee.branchId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            >
              <option value="">Chọn mã chi nhánh</option>
              <option value="CN01">Điện biên phủ</option>
              <option value="CN02">Bà Huyện Thanh Quan</option>
            </select>
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
