"use client";
import { useState, useEffect } from "react";
import EmployeeDetail from "./openEmployeeDetail/employeeDetail";
import CreateEmployee from "./createEmployee/createEmployee";

export interface EmployeeProps {
  ID: string;
  HoTen: string;
  GioiTinh: string;
  Luong: number;
  NgaySinh: string;
  MaBHXH: string;
  CCCD: string;
  SoTaiKhoan: string;
  VaiTro: string;
  ThoiGianBatDauLamViec: string;
  TrinhDoHocVan: string;
  MaChiNhanh: string;
}

export default function Employee() {
  const [data, setData] = useState<EmployeeProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateEmployee, setOpenCreateEmployee] = useState(false);
  const [openEmployeeDetail, setOpenEmployeeDetail] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDataEmployee = async (
    limit: number,
    page: number,
    role: string,
    name: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/employees/all?limit=${limit}&page=${page}&role=${role}&name=${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data);
      setTotalPages(Math.ceil(result.total / limit));
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataEmployee(rowsPerPage, currentPage + 1, role, debouncedName);
  }, [rowsPerPage, currentPage, role, debouncedName]);

  const deleteDataEmployee = async (id: string) => {
    try {
      const response = await fetch(`${APIURL}/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Deleted Employee: ", result);
      fetchDataEmployee(rowsPerPage, currentPage + 1, role, debouncedName);
    } catch (error) {
      console.log("Failed to delete data: ", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setCurrentPage(0);
  };

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(name);
    }, 500); // Adjust the delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [name]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Quản lý nhân viên
      </h1>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      ) : (
        <div className="justify-between items-center mb-4 w-full">
          <div className="flex flex-col md:flex-row place-content-between mb-4 gap-2">
            <input
              value={name}
              onChange={handleSearch}
              placeholder="Tìm kiếm theo tên"
              className="p-2 border border-gray-300 rounded"
            />
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <button
              onClick={() => setOpenCreateEmployee(true)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Tạo mới
            </button>
          </div>

          {data.length === 0 ? (
            <div>
              <p>Không có dữ liệu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Họ Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Giới Tính
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Lương
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày Sinh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mã BHXH
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      CCCD
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Số Tài Khoản
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vai Trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thời Gian Bắt Đầu Làm Việc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Trình Độ Học Vấn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mã Chi Nhánh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cập nhật
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Xóa
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                  {data.map((employee) => (
                    <tr key={employee.ID}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.HoTen}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.GioiTinh}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.Luong}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {new Date(employee.NgaySinh).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.MaBHXH}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.CCCD}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.SoTaiKhoan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.VaiTro}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {new Date(
                          employee.ThoiGianBatDauLamViec
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.TrinhDoHocVan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {employee.MaChiNhanh}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee.ID);
                            setOpenEmployeeDetail(true);
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Cập nhật
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        <button
                          onClick={() => deleteDataEmployee(employee.ID)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {openCreateEmployee && (
            <CreateEmployee
              setIsCreate={setOpenCreateEmployee}
              fetchDataEmployee={() =>
                fetchDataEmployee(
                  rowsPerPage,
                  currentPage + 1,
                  role,
                  debouncedName
                )
              }
            />
          )}
          {openEmployeeDetail && (
            <EmployeeDetail
              onClose={() => setOpenEmployeeDetail(false)}
              entry={
                data.find((item) => item.ID === selectedEmployee) || {
                  ID: "",
                  HoTen: "",
                  GioiTinh: "",
                  Luong: 0,
                  NgaySinh: "",
                  MaBHXH: "",
                  CCCD: "",
                  SoTaiKhoan: "",
                  VaiTro: "",
                  ThoiGianBatDauLamViec: "",
                  TrinhDoHocVan: "",
                  MaChiNhanh: "",
                }
              }
              refreshData={() =>
                fetchDataEmployee(
                  rowsPerPage,
                  currentPage + 1,
                  role,
                  debouncedName
                )
              }
            />
          )}

          <div className="pagination mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className="px-2 py-1 border rounded"
            >
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="px-2 py-1 border rounded"
            >
              {"<"}
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
              className="px-2 py-1 border rounded"
            >
              {">"}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
              className="px-2 py-1 border rounded"
            >
              {">>"}
            </button>
            <span>
              Đến trang{" "}
              <input
                type="number"
                value={currentPage + 1}
                onChange={(e) =>
                  setCurrentPage(
                    Math.min(Number(e.target.value) - 1, totalPages - 1)
                  )
                }
                className="w-10 text-center py-1 border rounded placeholder-gray-400"
              />{" "}
              /{totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
