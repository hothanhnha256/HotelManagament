"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaFastBackward,
  FaFastForward,
} from "react-icons/fa";

export interface Room {
  MaPhong: string;
  ThoiGianTaoBanGhiPhong: string;
  MaDatPhong: string;
  IDBanBaoCao: string | null;
  GiaTien: string;
}

export interface Order {
  MaDon: string;
  IDLeTan: string | null;
  IDKhachHang: string;
  ThoiGianDat: string;
  TrangThaiDon: string;
  NgayNhanPhong: string;
  NgayTraPhong: string;
  Nguon: string;
  SoTienDatCoc: string;
}

export interface BookingData {
  order: Order;
  rooms: Room[];
}
export default function HistoryRooms() {
  const [data, setData] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async (
    limit: number,
    page: number,
    cusPhoneNumber: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/booking/all?cusPhoneNumber=0386467955&limit=${limit}&page=${page}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setData(result.data);
      setTotalPages(Math.ceil(result.total / limit));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(rowsPerPage, currentPage + 1, "0386467955");
  }, [rowsPerPage, currentPage]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchInput(searchInput), 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleSearch = (e: any) => {
    setSearchInput(e.target.value);
    setCurrentPage(0);
  };

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Lịch sử đặt phòng
      </h1>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500">Không có dữ liệu</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((booking) => (
            <div
              key={booking.order.MaDon}
              className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Mã Đơn: {booking.order.MaDon}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Ngày đặt:{" "}
                {format(
                  new Date(booking.order.ThoiGianDat),
                  "dd/MM/yyyy HH:mm:ss"
                )}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Trạng thái:{" "}
                <span className="font-bold">{booking.order.TrangThaiDon}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Số tiền đặt cọc: {booking.order.SoTienDatCoc} VND
              </p>
              <div className="mt-2">
                <h3 className="text-gray-800 dark:text-gray-200 font-semibold">
                  Phòng:
                </h3>
                {booking.rooms.map((room) => (
                  <div
                    key={room.MaPhong}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    <p>- Mã Phòng: {room.MaPhong}</p>
                    <p> Giá: {room.GiaTien} VND</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          className="p-2 rounded border bg-gray-200 hover:bg-gray-300"
        >
          <FaFastBackward />
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="p-2 rounded border bg-gray-200 hover:bg-gray-300"
        >
          <FaChevronLeft />
        </button>
        <span className="p-2">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1}
          className="p-2 rounded border bg-gray-200 hover:bg-gray-300"
        >
          <FaChevronRight />
        </button>
        <button
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 rounded border bg-gray-200 hover:bg-gray-300"
        >
          <FaFastForward />
        </button>
      </div>
    </div>
  );
}
