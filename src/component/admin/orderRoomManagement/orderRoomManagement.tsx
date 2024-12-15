"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import OpenRecordRoomBooking from "./recordRoomBooking/openRecordRoomBooking";
import CheckoutRoom from "./recordRoomBooking/checkout/openCheckout";
import { currencyFormat } from "@/utils/formatter";
import { orderStatusMapping } from "@/utils/dataMapping";
export interface DataOrder {
  MaDon: string;
  IDLeTan: string;
  IDKhachHang: string;
  ThoiGianDat: string;
  TrangThaiDon: string;
  NgayNhanPhong: string;
  NgayTraPhong: string;
  Nguon: string;
  SoTienDatCoc: string;
}

export interface DataBookingRoom {
  MaPhong: string;
  ThoiGianTaoBanGhiPhong: string;
  MaDatPhong: string;
  IDBanBaoCao: string;
  GiaTien: string;
}

export interface DataRecordRoom {
  order: DataOrder;
  rooms: DataBookingRoom[];
}

export default function OrderRoomManagement() {
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderIdCheckout, setOrderIdCheckout] = useState("");

  const [data, setData] = useState<DataRecordRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpenRoomRecord, setIsOpenRoomRecord] = useState(false);
  const [error, setError] = useState<string>("");
  const [totalPages, setTotalPages] = useState(0);
  const [orderRoomDetail, setOrderRoomDetail] = useState<
    DataBookingRoom[] | null
  >(null);
  const [isOrderRoomDetailOpen, setIsOrderRoomDetailOpen] = useState(false);

  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const [filterCusNoNumber, setFilterCusNoNumber] = useState("");

  const fetchDataOrderRoom = async (limit: number, page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/booking/all?limit=${limit}&page=${page}&cusPhoneNumber=${searchInput}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data);
      //console.log("Data: ", result.data);
      setTotalPages(Math.ceil(result.total / limit));
      setIsLoading(false);
    } catch (error) {
      //console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataOrderRoom(rowsPerPage, currentPage + 1);
  }, [rowsPerPage, currentPage, debouncedSearchInput]);

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

  //for approve or cancel booking
  const [action, setAction] = useState("");

  const handleApproveBooking = async (orderId: string) => {
    //console.log("Order ID: ", orderId);
    //console.log("Action: ", action);
    //console.log("API URL: ", `${APIURL}/booking/${orderId}`);
    try {
      const response = await fetch(`${APIURL}/booking/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "ngrok-skip-browser-warning": "true",
        },
        body: new URLSearchParams({
          action: action,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      //console.log("Result: ", result);
      alert(action + " booking successfully!");
      fetchDataOrderRoom(rowsPerPage, currentPage + 1);
    } catch (error) {}
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
            Quản lý đặt phòng
          </h2>
          <div className="flex flex-col md:flex-row place-content-between mb-4 gap-2">
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            {/* <input
              value={searchInput}
              onChange={handleSearch}
              placeholder="Tìm kiếm theo số điện thoại"
              className="p-2 border border-gray-300 rounded"
            /> */}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mã Đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nguồn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Số tiền đặt cọc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ngày nhận
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ngày trả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID lễ tân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Xem chi tiết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Checkout
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.order.MaDon}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.order.MaDon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.order.Nguon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {currencyFormat(parseFloat(row.order.SoTienDatCoc))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.order.TrangThaiDon === "confirmed" ? (
                        <span className="text-green-600 font-semibold">
                          Đã xác nhận
                        </span>
                      ) : row.order.TrangThaiDon === "not confirmed" ? (
                        <span className="text-yellow-600 font-semibold">
                          Chưa xác nhận
                        </span>
                      ) : row.order.TrangThaiDon === "cancelled" ? (
                        <span className="text-red-600 font-semibold">
                          Đã hủy
                        </span>
                      ) : (
                        ""
                      )}
                      {row.order.TrangThaiDon === "not confirmed" && (
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => {
                              setAction("accept");
                              handleApproveBooking(row.order.MaDon);
                            }}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => {
                              setAction("refuse");
                              handleApproveBooking(row.order.MaDon);
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Hủy đơn
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {format(
                        new Date(row.order.ThoiGianDat),
                        "dd/MM/yyyy HH:mm:ss"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {format(new Date(row.order.NgayNhanPhong), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {format(new Date(row.order.NgayTraPhong), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.order.IDLeTan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.order.IDKhachHang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      <button
                        onClick={() => {
                          setOrderRoomDetail(row.rooms);
                          setIsOrderRoomDetailOpen(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Xem
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      <button
                        onClick={() => {
                          setIsCheckout(true);
                          setOrderIdCheckout(row.order.MaDon);
                        }}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Checkout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isOrderRoomDetailOpen && (
            <OpenRecordRoomBooking
              dataBookingRoom={orderRoomDetail}
              onClose={() => setIsOrderRoomDetailOpen(false)}
            />
          )}
          {isCheckout && (
            <CheckoutRoom
              onClose={() => setIsCheckout(false)}
              orderId={orderIdCheckout}
            />
          )}

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
              Đi đến trang{" "}
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
              của {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
