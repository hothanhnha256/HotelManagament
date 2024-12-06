"use client";
import { useState, useEffect, useMemo } from "react";
import DeviceRoomsDetail from "./openDeviceRoomsDetail/deviceRoomsDetail";
import CreateDeviceRooms from "./createDeviceRooms/createDeviceRooms";
interface DeviceRooms {
  id: string;
  name: string;
  type: string;
  status: string;
}

const fakeDataDeviceRoomss: DeviceRooms[] = [
  { id: "1", name: "DeviceRooms 1", type: "Type A", status: "Active" },
  { id: "2", name: "DeviceRooms 2", type: "Type B", status: "Inactive" },
  { id: "3", name: "DeviceRooms 3", type: "Type A", status: "Active" },
  { id: "4", name: "DeviceRooms 4", type: "Type B", status: "Inactive" },
  { id: "5", name: "DeviceRooms 5", type: "Type A", status: "Active" },
  { id: "6", name: "DeviceRooms 6", type: "Type B", status: "Inactive" },
  { id: "7", name: "DeviceRooms 7", type: "Type A", status: "Active" },
  { id: "8", name: "DeviceRooms 8", type: "Type B", status: "Inactive" },
  // Add more fake data as needed
];

export default function DeviceRooms() {
  const [data, setData] = useState<DeviceRooms[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("");
  const [openCreateDeviceRooms, setOpenCreateDeviceRooms] = useState(false);
  const [openDeviceRoomsDetail, setOpenDeviceRoomsDetail] = useState(false);
  const [selectedDeviceRooms, setSelectedDeviceRooms] = useState("");

  const fetchDataDeviceRoomss = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(fakeDataDeviceRoomss);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchDataDeviceRoomss();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchInput) {
      filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.type.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((item) =>
        item.status.toLowerCase().includes(filterStatus.toLowerCase())
      );
    }

    return filtered;
  }, [data, searchInput, filterStatus]);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Đồ dùng trong phòng
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
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or type"
              className="p-2 border border-gray-300 rounded"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button
              onClick={() => setOpenCreateDeviceRooms(true)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Create DeviceRooms
            </button>
          </div>

          {filteredData.length === 0 ? (
            <div>No data available</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                  {paginatedData.map((DeviceRooms) => (
                    <tr key={DeviceRooms.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {DeviceRooms.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {DeviceRooms.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {DeviceRooms.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {DeviceRooms.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        <button
                          onClick={() => setOpenDeviceRoomsDetail(true)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {openCreateDeviceRooms && (
            <CreateDeviceRooms
              setIsCreate={setOpenCreateDeviceRooms}
              fetchDataDeviceRooms={() => fetchDataDeviceRoomss()}
            />
          )}
          {openDeviceRoomsDetail && (
            <DeviceRoomsDetail
              onClose={() => setOpenDeviceRoomsDetail(false)}
              id={selectedDeviceRooms}
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
              Go to page{" "}
              <input
                type="number"
                value={currentPage + 1}
                onChange={(e) =>
                  setCurrentPage(
                    Math.min(Number(e.target.value) - 1, totalPages)
                  )
                }
                className="w-10 text-center  py-1 border rounded
                  placeholder-gray-400
                "
              />{" "}
              of {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
