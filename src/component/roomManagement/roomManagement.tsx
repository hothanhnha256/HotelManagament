"use client";

import { useState, useEffect, useMemo } from "react";
import { dataRoom } from "./interface/roomInterface";
import CreateRoom from "./createRoom";

export default function RoomManagement() {
  const [data, setData] = useState<dataRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isCreate, setIsCreate] = useState(false);
  const [error, setError] = useState<string>("");
  const [totalPages, setTotalPages] = useState(0);
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const [filterTinhTrang, setFilterTinhTrang] = useState("");
  const [filterChiNhanh, setFilterChiNhanh] = useState("");
  const [filterLoaiPhong, setFilterLoaiPhong] = useState("");

  const fetchDataRoom = async (
    limit: number,
    page: number,
    branchId: string,
    status: string,
    type: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/rooms/all?limit=${limit}&page=${page}&branchId=${branchId}&status=${status}&type=${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response: ", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Rooms: ", result);
      setData(result.data);
      console.log("Data: ", data);
      setTotalPages(Math.ceil(result.total / limit));
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataRoom(
      rowsPerPage,
      currentPage + 1,
      filterChiNhanh,
      filterTinhTrang,
      filterLoaiPhong
    );
  }, [
    rowsPerPage,
    currentPage,
    filterChiNhanh,
    filterTinhTrang,
    filterLoaiPhong,
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(0);
  };

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 500); // Adjust the delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
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
          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
            Quản lý phòng
          </h2>
          <div className="flex flex-col md:flex-row place-content-between mb-4 gap-2">
            <select
              value={filterTinhTrang}
              onChange={(e) => setFilterTinhTrang(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Tất cả tình trạng</option>
              <option value="Đang sử dụng">Đang sử dụng</option>
              <option value="Trống">Trống</option>
              <option value="Bảo trì">Bảo trì</option>
            </select>
            <select
              value={filterChiNhanh}
              onChange={(e) => setFilterChiNhanh(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Tất cả chi nhánh</option>
              <option value="CN01">CN1</option>
              <option value="CN02">CN2</option>
            </select>
            <select
              value={filterLoaiPhong}
              onChange={(e) => setFilterLoaiPhong(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Tất cả loại phòng</option>
              <option value="vip">VIP</option>
              <option value="normal">NORMAL</option>
            </select>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={() => setIsCreate(true)}
            >
              Tạo mới
            </button>
          </div>
          {isCreate && (
            <CreateRoom
              setIsCreate={setIsCreate}
              fetchDataRoom={() =>
                fetchDataRoom(
                  rowsPerPage,
                  currentPage + 1,
                  filterChiNhanh,
                  filterTinhTrang,
                  filterLoaiPhong
                )
              }
            />
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mã Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mã Chi Nhánh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tình Trạng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Loại Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Xem chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.MaPhong}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.MaPhong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.MaChiNhanh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.TrangThai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.LoaiPhong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      <a href={`room/${row.MaPhong}`}>Xem</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
              className="px-2 py-1 border rounded"
            >
              {"<<"}
            </button>
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 0))}
              disabled={currentPage === 0}
              className="px-2 py-1 border rounded"
            >
              {"<"}
            </button>
            <button
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
              className="px-2 py-1 border rounded"
            >
              {">"}
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
              className="px-2 py-1 border rounded"
            >
              {">>"}
            </button>
            <span>
              Go to page{" "}
              <input
                type="number"
                value={currentPage + 1}
                onChange={(e) =>
                  handlePageChange(
                    Math.min(Number(e.target.value) - 1, totalPages - 1)
                  )
                }
                className="w-10 text-center py-1 border rounded placeholder-gray-400"
              />{" "}
              of {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
