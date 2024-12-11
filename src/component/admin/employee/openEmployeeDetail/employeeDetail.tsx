import React, { useState } from "react";
import { EmployeeProps } from "../employee";

export interface EmployeeInterface {
  entry: EmployeeProps;
  onClose: () => void;
  refreshData: () => void;
}

export interface UpdateEmployeeDetail {
  name: string;
  sex: string;
  dateOfBirth: string;
  salary: number;
  ssn: string;
  citizenId: string;
  bankAccount: string;
  role: string;
  startWorkingDate: string;
  eduLevel: string;
  branchId: string;
}

export default function EmployeeDetail(props: EmployeeInterface) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [newEmployee, setNewEmployee] = useState<UpdateEmployeeDetail>({
    name: props.entry.HoTen,
    sex: props.entry.GioiTinh,
    dateOfBirth: formatDate(props.entry.NgaySinh),
    salary: props.entry.Luong,
    ssn: props.entry.MaBHXH,
    citizenId: props.entry.CCCD,
    bankAccount: props.entry.SoTaiKhoan,
    role: props.entry.VaiTro,
    startWorkingDate: formatDate(props.entry.ThoiGianBatDauLamViec),
    eduLevel: props.entry.TrinhDoHocVan,
    branchId: props.entry.MaChiNhanh,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

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
      !newEmployee.dateOfBirth ||
      !newEmployee.salary ||
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
    formData.append("name", newEmployee.name);
    formData.append("sex", newEmployee.sex);
    formData.append("dateOfBirth", newEmployee.dateOfBirth);
    formData.append("salary", newEmployee.salary.toString());
    formData.append("ssn", newEmployee.ssn);
    formData.append("citizenId", newEmployee.citizenId);
    formData.append("bankAccount", newEmployee.bankAccount);
    formData.append("role", newEmployee.role);
    formData.append("startWorkingDate", newEmployee.startWorkingDate);
    formData.append("eduLevel", newEmployee.eduLevel);
    formData.append("branchId", newEmployee.branchId);
    console.log("Form Data: ", formData.toString());

    try {
      const response = await fetch(`${APIURL}/employees/${props.entry.ID}`, {
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
      console.log("Updated Employee: ", result);
      props.refreshData(); // Refresh the data after updating
      props.onClose(); // Close the form after successful update
    } catch (error) {
      console.log("Failed to update Employee ", error);
      setError("Failed to update Employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Chi tiết nhân viên
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
              {newEmployee.sex === "Male" ? (
                <>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </>
              ) : (
                <>
                  <option value="Female">Nữ</option>
                  <option value="Male">Nam</option>
                </>
              )}
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
              {props.entry.MaChiNhanh === "CN01" ? (
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
