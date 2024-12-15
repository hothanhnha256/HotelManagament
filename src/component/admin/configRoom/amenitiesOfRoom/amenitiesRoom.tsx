"use client";
import { useState, useEffect } from "react";
import AmenitiesRoomDetail from "./openAmenitiesRoomDetail/amenitiesRoomDetail";
import CreateAmenitiesRoom from "./createAmenitiesRoom/createAmenitiesRoom";

export interface AmenitiesRoomProps {
  ID: string;
  Ten: string;
  MoTa: string;
}

export default function AmenitiesOfRoom({ idRoom }: { idRoom: string }) {
  const [data, setData] = useState<AmenitiesRoomProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateAmenitiesRoom, setOpenCreateAmenitiesRoom] = useState(false);
  const [openAmenitiesRoomDetail, setOpenAmenitiesRoomDetail] = useState(false);
  const [selectedAmenitiesRoom, setSelectedAmenitiesRoom] =
    useState<AmenitiesRoomProps | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDataAmenitiesRoom = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APIURL}/amenities/${idRoom}`, {
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
    fetchDataAmenitiesRoom();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / rowsPerPage));
  }, [data, rowsPerPage]);

  const deleteDataAmenitiesRoom = async (id: string) => {
    try {
      const response = await fetch(
        `${APIURL}/amenities/delete/${idRoom}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      //console.log("Deleted AmenitiesRoom: ", result);
      fetchDataAmenitiesRoom();
    } catch (error) {
      //console.log("Failed to delete data: ", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(0);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const filteredData = data.filter((amenity) =>
    amenity.Ten.toLowerCase().includes(searchInput.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Quản lý tiện nghi phòng
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
              onClick={() => setOpenCreateAmenitiesRoom(true)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Thêm tiện nghi
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
                      Mô tả
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {amenity.ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {amenity.Ten}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {amenity.MoTa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        <button
                          onClick={() => {
                            setSelectedAmenitiesRoom(amenity);
                            setOpenAmenitiesRoomDetail(true);
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Cập nhật
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        <button
                          onClick={() => deleteDataAmenitiesRoom(amenity.ID)}
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
          {openCreateAmenitiesRoom && (
            <CreateAmenitiesRoom
              setIsCreate={setOpenCreateAmenitiesRoom}
              fetchDataAmenitiesRoom={fetchDataAmenitiesRoom}
              roomID={idRoom}
            />
          )}
          {openAmenitiesRoomDetail && selectedAmenitiesRoom && (
            <AmenitiesRoomDetail
              onClose={() => setOpenAmenitiesRoomDetail(false)}
              entry={selectedAmenitiesRoom}
              refreshData={fetchDataAmenitiesRoom}
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
