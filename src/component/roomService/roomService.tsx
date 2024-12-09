"use client";
import { useState, useEffect } from "react";
import RoomServiceDetail from "./openRoomServiceDetail/roomServiceDetail";
import CreateRoomService from "./createRoomService/createRoomService";

export interface RoomServiceProps {
  MaDichVu: string;
  TuyChonGiat?: string;
  LoaiXe?: string;
  SucChua?: number;
  MucGia: number;
  MoTa: string;
}

export type RoomServiceCategory =
  | "laundry"
  | "transport"
  | "food"
  | "meetingRoom";

export default function RoomService() {
  const [data, setData] = useState<
    Partial<Record<RoomServiceCategory, RoomServiceProps[]>>
  >({
    laundry: [],
    transport: [],
    food: [],
    meetingRoom: [],
  });
  const [filteredData, setFilteredData] = useState<
    Partial<Record<RoomServiceCategory, RoomServiceProps[]>>
  >({
    laundry: [],
    transport: [],
    food: [],
    meetingRoom: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateRoomService, setOpenCreateRoomService] = useState(false);
  const [openRoomServiceDetail, setOpenRoomServiceDetail] = useState(false);
  const [selectedRoomService, setSelectedRoomService] =
    useState<RoomServiceProps | null>(null);
  const [selectedRoomServiceType, setSelectedRoomServiceType] =
    useState<RoomServiceCategory>("laundry");
  const [totalPages, setTotalPages] = useState(0);
  const [filterType, setFilterType] = useState<RoomServiceCategory | "all">(
    "all"
  );
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDataRoomService = async (type: RoomServiceCategory | "all") => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APIURL}/room-service/all?type=${type}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (type === "all") {
        setData(result.data);
        setFilteredData(result.data);
      } else {
        setData({ [type]: result.data[0] });
        setFilteredData({ [type]: result.data[0] });
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataRoomService(filterType);
  }, [filterType]);

  useEffect(() => {
    const filtered = Object.keys(data).reduce((acc, key) => {
      const category = key as RoomServiceCategory;
      acc[category] =
        data[category]?.filter((service) =>
          service.MaDichVu.toLowerCase().includes(name.toLowerCase())
        ) || [];
      return acc;
    }, {} as Partial<Record<RoomServiceCategory, RoomServiceProps[]>>);
    setFilteredData(filtered);
    setCurrentPage(0);
  }, [name, data]);

  useEffect(() => {
    const totalItems =
      filterType === "all"
        ? Object.values(filteredData).flat().length
        : filteredData[filterType]?.length || 0;
    setTotalPages(Math.ceil(totalItems / rowsPerPage));
  }, [filteredData, rowsPerPage, filterType]);

  const deleteDataRoomService = async (
    id: string,
    type: RoomServiceCategory
  ) => {
    console.log("Deleting RoomService: ", id);
    console.log("Type: ", type);
    try {
      const response =
        type == "meetingRoom"
          ? await fetch(
              `${APIURL}/room-service?serviceId=${id}&type=meeting room`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
          : await fetch(`${APIURL}/room-service?serviceId=${id}&type=${type}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Deleted RoomService: ", result);
      fetchDataRoomService(filterType);
    } catch (error) {
      console.log("Failed to delete data: ", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as RoomServiceCategory | "all");
    setCurrentPage(0);
  };

  const renderTable = (category: RoomServiceCategory) => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData =
      filteredData[category]?.slice(startIndex, endIndex) || [];

    return (
      <div key={category} className="mb-6">
        <h2 className="text-xl font-bold mb-2 text-black dark:text-white capitalize">
          {category}
        </h2>
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
                    Mã Dịch Vụ
                  </th>
                  {category === "laundry" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tùy Chọn Giặt
                    </th>
                  )}
                  {category === "transport" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Loại Xe
                    </th>
                  )}
                  {category === "meetingRoom" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Sức Chứa
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mức Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mô Tả
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
                {paginatedData.map((service: RoomServiceProps) => (
                  <tr key={service.MaDichVu}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {service.MaDichVu}
                    </td>
                    {category === "laundry" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {service.TuyChonGiat}
                      </td>
                    )}
                    {category === "transport" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {service.LoaiXe}
                      </td>
                    )}
                    {category === "meetingRoom" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {service.SucChua}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {service.MucGia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {service.MoTa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      <button
                        onClick={() => {
                          setSelectedRoomService(service);
                          setSelectedRoomServiceType(category);
                          setOpenRoomServiceDetail(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Cập nhật
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      <button
                        onClick={() =>
                          deleteDataRoomService(service.MaDichVu, category)
                        }
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
      </div>
    );
  };

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Quản lý dịch vụ phòng
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
              placeholder="Tìm kiếm theo mã dịch vụ"
              className="p-2 border border-gray-300 rounded"
            />
            <select
              value={filterType}
              onChange={handleFilterTypeChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="all">Tất cả</option>
              <option value="laundry">Giặt ủi</option>
              <option value="transport">Vận chuyển</option>
              <option value="food">Thức ăn</option>
              <option value="meeting room">Phòng họp</option>
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
              onClick={() => setOpenCreateRoomService(true)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Tạo mới
            </button>
          </div>

          {filterType === "all"
            ? (Object.keys(filteredData) as RoomServiceCategory[]).map(
                (category) => renderTable(category)
              )
            : renderTable(filterType)}

          {openCreateRoomService && (
            <CreateRoomService
              setIsCreate={setOpenCreateRoomService}
              fetchDataRoomService={() => fetchDataRoomService(filterType)}
            />
          )}
          {openRoomServiceDetail && selectedRoomService && (
            <RoomServiceDetail
              onClose={() => setOpenRoomServiceDetail(false)}
              type={selectedRoomServiceType}
              entry={selectedRoomService}
              refreshData={() => fetchDataRoomService(filterType)}
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
