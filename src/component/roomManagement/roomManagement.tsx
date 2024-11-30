"use client";

import { useState, useEffect, useMemo } from "react";
import { fakeDataRoom } from "./fakedata/dataRoom";
import { dataRoom } from "./interface/roomInterface";
import CreateRoom from "./createRoom";

export default function RoomManagement() {
  const [data, setData] = useState<dataRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [isCreate, setIsCreate] = useState(false);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof dataRoom;
    direction: string;
  } | null>(null);

  const [filterTinhTrang, setFilterTinhTrang] = useState("");
  const [filterMaSo, setFilterMaSo] = useState("");
  const [filterDiaChi, setFilterDiaChi] = useState("");

  const fetchDataRoom = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(fakeDataRoom);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchDataRoom();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchInput) {
      filtered = data.filter(
        (item) =>
          item.id.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.maSo.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.tinhTrang.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.diaChi.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    if (filterTinhTrang) {
      filtered = filtered.filter((item) =>
        item.tinhTrang.toLowerCase().includes(filterTinhTrang.toLowerCase())
      );
    }

    if (filterMaSo) {
      filtered = filtered.filter((item) =>
        item.maSo.toLowerCase().includes(filterMaSo.toLowerCase())
      );
    }

    if (filterDiaChi) {
      filtered = filtered.filter((item) =>
        item.diaChi.toLowerCase().includes(filterDiaChi.toLowerCase())
      );
    }

    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [
    data,
    searchInput,
    filterTinhTrang,
    filterMaSo,
    filterDiaChi,
    sortConfig,
  ]);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleSort = (key: keyof dataRoom) => {
    setSortConfig((prev) => {
      if (prev?.key === key && prev.direction === "ascending") {
        return { key, direction: "descending" };
      }
      return { key, direction: "ascending" };
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(0);
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
            <input
              value={searchInput}
              onChange={handleSearch}
              placeholder="Tìm kiếm theo ID"
              className="p-2 border border-gray-300 rounded"
            />
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
            <input
              value={filterMaSo}
              onChange={(e) => setFilterMaSo(e.target.value)}
              placeholder="Lọc theo mã số"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              value={filterDiaChi}
              onChange={(e) => setFilterDiaChi(e.target.value)}
              placeholder="Lọc theo địa chỉ"
              className="p-2 border border-gray-300 rounded"
            />
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
              fetchDataRoom={fetchDataRoom}
            />
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    ID{" "}
                    {sortConfig?.key === "id"
                      ? sortConfig.direction === "ascending"
                        ? "🔼"
                        : "🔽"
                      : ""}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("maSo")}
                  >
                    Mã Số{" "}
                    {sortConfig?.key === "maSo"
                      ? sortConfig.direction === "ascending"
                        ? "🔼"
                        : "🔽"
                      : ""}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("tinhTrang")}
                  >
                    Tình Trạng{" "}
                    {sortConfig?.key === "tinhTrang"
                      ? sortConfig.direction === "ascending"
                        ? "🔼"
                        : "🔽"
                      : ""}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("diaChi")}
                  >
                    Địa Chỉ{" "}
                    {sortConfig?.key === "diaChi"
                      ? sortConfig.direction === "ascending"
                        ? "🔼"
                        : "🔽"
                      : ""}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Xem chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.maSo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.tinhTrang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.diaChi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      <a href={`room/${row.id}`}>Xem</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              Page{" "}
              <strong>
                {currentPage + 1} of {totalPages}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
