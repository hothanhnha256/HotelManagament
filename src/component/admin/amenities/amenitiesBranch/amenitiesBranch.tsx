"use client";
import { useState, useEffect, useCallback } from "react";
import AmenitiesBranchDetail from "./openAmenitiesBranchDetail/amenitiesBranchDetail";
import CreateAmenitiesBranch from "./createAmenitiesBranch/createAmenitiesBranch";

export interface AmenitiesBranchProps {
  ID: string;
  Ten: string;
  MoTa: string;
  MaChiNhanh: string;
}

export default function AmenitiesBranch() {
  const [data, setData] = useState<AmenitiesBranchProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateAmenitiesBranch, setOpenCreateAmenitiesBranch] =
    useState(false);
  const [openAmenitiesBranchDetail, setOpenAmenitiesBranchDetail] =
    useState(false);
  const [selectedAmenitiesBranch, setSelectedAmenitiesBranch] =
    useState<AmenitiesBranchProps | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDataAmenitiesBranch = async (
    limit: number,
    page: number,
    name: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/amenities/branch?limit=${limit}&page=${page}&name=${name}`,
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
      console.log(result);
      
      setData(result.data);
      setTotalPages(Math.ceil(result.total / limit));
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAmenitiesBranch(
      rowsPerPage,
      currentPage + 1,
      debouncedSearchInput
    );
  }, [rowsPerPage, currentPage, debouncedSearchInput]);

  const deleteDataAmenitiesBranch = async (id: string) => {
    try {
      const response = await fetch(`${APIURL}/amenities/branch/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Deleted AmenitiesBranch: ", result);
      fetchDataAmenitiesBranch(
        rowsPerPage,
        currentPage + 1,
        debouncedSearchInput
      );
    } catch (error) {
      console.log("Failed to delete data: ", error);
    }
  };

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

  const renderTable = () => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    return (
      <div className="overflow-x-auto">
        <table className="w-screen divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Chi nhánh
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
            {paginatedData.map((amenity) => (
              <tr key={amenity.ID}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-300">
                  {amenity.ID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                  {amenity.Ten}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                  {amenity.MoTa}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                  {amenity.MaChiNhanh}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                  <button
                    onClick={() => {
                      setSelectedAmenitiesBranch(amenity);
                      setOpenAmenitiesBranchDetail(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Cập nhật
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                  <button
                    onClick={() => deleteDataAmenitiesBranch(amenity.ID)}
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
    );
  };

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Quản lý tiện ích chi nhánh
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
              onClick={() => setOpenCreateAmenitiesBranch(true)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Tạo mới
            </button>
          </div>

          {renderTable()}

          {openCreateAmenitiesBranch && (
            <CreateAmenitiesBranch
              setIsCreate={setOpenCreateAmenitiesBranch}
              fetchDataAmenitiesBranch={() =>
                fetchDataAmenitiesBranch(
                  rowsPerPage,
                  currentPage + 1,
                  debouncedSearchInput
                )
              }
            />
          )}
          {openAmenitiesBranchDetail && selectedAmenitiesBranch && (
            <AmenitiesBranchDetail
              onClose={() => setOpenAmenitiesBranchDetail(false)}
              entry={selectedAmenitiesBranch}
              refreshData={() =>
                fetchDataAmenitiesBranch(
                  rowsPerPage,
                  currentPage + 1,
                  debouncedSearchInput
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
