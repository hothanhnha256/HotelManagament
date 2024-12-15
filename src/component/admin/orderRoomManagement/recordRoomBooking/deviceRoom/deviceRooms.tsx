"use client";
import { useState, useEffect } from "react";

export interface DeviceRoomsProps {
  SoLuong: string;
  MaDoTieuDung: string;
}
export interface DeviceRoomServiceInterface {
  onClose: () => void;
  createdAt: string;
  roomId: string;
}
export interface ReportProps {
  goodId: string;
  quantity: number;
}

export default function DeviceUseInRooms(props: DeviceRoomServiceInterface) {
  const [data, setData] = useState<DeviceRoomsProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [reportProps, setReportProps] = useState<ReportProps[]>([]);
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDataDeviceRooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APIURL}/rooms/${props.roomId}/goods`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data);
      setIsLoading(false);
    } catch (error) {
      //console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  const handleCreateReport = async () => {
    const requestBody = new URLSearchParams();
    requestBody.append("goods", JSON.stringify(reportProps));

    //console.log("Request body: ", requestBody.toString());
    //console.log("Report props: ", reportProps);
    try {
      const response = await fetch(
        `${APIURL}/rooms/${props.roomId}/${props.createdAt}/report`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: requestBody.toString(),
        }
      );

      const result = await response.json();
      //console.log("Result: ", result);
      if (!response.ok) {
        console.error("Failed to create report: ", response.status);
        alert("Failed to create report: " + result.error);
        return;
      }
      alert("Báo cáo đã được tạo thành công");
    } catch (error) {
      //console.log("Failed to create report: ", error);
    }
  };

  useEffect(() => {
    fetchDataDeviceRooms();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 2000); // Adjust the delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(0);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleQuantityChange = (goodId: string, quantity: number) => {
    setReportProps((prev) => {
      const existing = prev.find((item) => item.goodId === goodId);
      if (existing) {
        return prev.map((item) =>
          item.goodId === goodId ? { ...item, quantity } : item
        );
      } else {
        return [...prev, { goodId, quantity }];
      }
    });
  };

  const filteredData = data.filter((item) =>
    item.MaDoTieuDung.toLowerCase().includes(debouncedSearchInput.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl h-5/6 overflow-y-auto">
        <div className="absolute top-4 right-4">
          <button
            onClick={props.onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Đóng
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Bản báo cáo đồ dùng
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
            </div>

            {filteredData.length === 0 ? (
              <div>
                <p>Không có dữ liệu</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mã đồ tiêu dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Số lượng sử dụng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                    {paginatedData.map((deviceRoom) => (
                      <tr key={deviceRoom.MaDoTieuDung}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                          {deviceRoom.MaDoTieuDung}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                          {deviceRoom.SoLuong}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                          <input
                            type="number"
                            value={
                              reportProps.find(
                                (item) =>
                                  item.goodId === deviceRoom.MaDoTieuDung
                              )?.quantity || 0
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                deviceRoom.MaDoTieuDung,
                                Number(e.target.value)
                              )
                            }
                            className="p-2 border border-gray-300 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                      Math.min(Number(e.target.value) - 1, totalPages)
                    )
                  }
                  className="w-10 text-center py-1 border rounded placeholder-gray-400"
                />{" "}
                /{totalPages}
              </span>
            </div>
            <button
              onClick={handleCreateReport}
              className="px-4 py-2 bg-blue-500 text-white rounded mt-4 flex w-full justify-center"
            >
              Tạo báo cáo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
