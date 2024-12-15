"use client";
import { useState, useEffect } from "react";
import FacilitiesDetail from "./openFacilitiesDetail/amenitiesDetail";
import CreateFacilities from "./createFacilities/createFacilities";
import { facilityStatusMapping } from "@/utils/dataMapping";

export interface FacilitiesProps {
  ID: string;
  TenTrangBi: string;
  GiaMua: string;
  MaSanPham: string;
  TinhTrang: string;
  MaPhong: string;
  imageURL: string;
}

export default function Facilities({ idRoom }: { idRoom: string }) {
  const [data, setData] = useState<FacilitiesProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateFacilities, setOpenCreateFacilities] = useState(false);
  const [openFacilitiesDetail, setOpenFacilitiesDetail] = useState(false);
  const [selectedFacilities, setSelectedFacilities] =
    useState<FacilitiesProps | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDataFacilities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APIURL}/facilities/${idRoom}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data);
      setTotalPages(Math.ceil(result.data.length / rowsPerPage));
      setIsLoading(false);
    } catch (error) {
      //console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFacilities();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / rowsPerPage));
  }, [data, rowsPerPage]);

  const deleteDataFacilities = async (id: string) => {
    try {
      const response = await fetch(`${APIURL}/facilities/${idRoom}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      //console.log("Deleted Facilities: ", result);
      fetchDataFacilities();
    } catch (error) {
      //console.log("Failed to delete data: ", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(0);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const filteredData = data.filter((facility) => {
    const matchesSearch = facility.TenTrangBi.toLowerCase().includes(
      searchInput.toLowerCase()
    );
    const matchesStatus =
      statusFilter === "all" ||
      facility.TinhTrang.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Quản lý tiện ích
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
              value={searchInput}
              onChange={handleSearch}
              placeholder="Tìm kiếm theo ID"
              className="p-2 border border-gray-300 rounded"
            />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="all">Tất cả</option>
              <option value="good">Good</option>
              <option value="maintenance">Maintenance</option>
            </select>
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
              onClick={() => setOpenCreateFacilities(true)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Tạo mới
            </button>
          </div>

          {paginatedData.length === 0 ? (
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
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Giá mua
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tình trạng
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
                  {paginatedData.map((facility) => (
                    <tr key={facility.ID}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {facility.ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {facility.TenTrangBi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {facility.GiaMua}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {facilityStatusMapping(facility.TinhTrang)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        <button
                          onClick={() => {
                            setSelectedFacilities(facility);
                            setOpenFacilitiesDetail(true);
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Cập nhật
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        <button
                          onClick={() => deleteDataFacilities(facility.ID)}
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
          {openCreateFacilities && (
            <CreateFacilities
              idRoom={idRoom}
              setIsCreate={setOpenCreateFacilities}
              fetchDataFacilities={fetchDataFacilities}
            />
          )}
          {openFacilitiesDetail && selectedFacilities && (
            <FacilitiesDetail
              idRoom={idRoom}
              onClose={() => setOpenFacilitiesDetail(false)}
              entry={selectedFacilities}
              refreshData={fetchDataFacilities}
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
