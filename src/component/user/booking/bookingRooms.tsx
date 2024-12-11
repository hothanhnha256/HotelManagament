"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

export interface Services {
  Ten: string;
  Mota: string;
}
export interface Facitities {
  TenTrangBi: string;
  imageURL: string;
}

export interface RoomPrice {
  ThoiGianBatDauApDung: string;
  ThoiGianKetThucApDung: string;
  GiaCongBo: number;
  GiaGiam: number | null;
}

export interface Room {
  MaPhong: string;
  MaChiNhanh: string;
  TrangThai: string;
  LoaiPhong: string;
  SoPhong: number;
  MoTa: string | null;
  IDNhanVienDonPhong: string | null;
  IDNhanVienPhong: string | null;
  IDGiamGia: string | null;
  SucChua: number;
  MaPhongLienKet: string | null;
  services: Services[];
  facilities: Facitities[];
  GiaPhong: RoomPrice[];
}

export default function BookingRooms() {
  const [data, setData] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [branchId, setBranchId] = useState("CN01");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [bookingData, setBookingData] = useState({
    cusName: "",
    cusPhoneNumber: "",
    cusCitizenId: "",
    cusSex: "male",
    cusDOB: "",
    deposit: 0,
  });
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDataRooms = async (
    limit: number,
    page: number,
    branchId: string,
    startDate: string,
    endDate: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/rooms/available?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${page}&branchId=${branchId}`,
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
      console.log("Response: ", response);
      const result = await response.json();
      console.log("Result: ", result);
      setData(result.data);
      console.log("Data: ", result.data);
      setTotalPages(Math.ceil(result.total / limit));
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchDataRooms(
        rowsPerPage,
        currentPage + 1,
        branchId,
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
    }
  }, [rowsPerPage, currentPage, startDate, endDate, branchId]);

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

  const handleRoomSelection = (room: Room) => {
    setSelectedRooms((prevSelectedRooms) => {
      if (
        prevSelectedRooms.some(
          (selectedRoom) => selectedRoom.MaPhong === room.MaPhong
        )
      ) {
        return prevSelectedRooms.filter(
          (selectedRoom) => selectedRoom.MaPhong !== room.MaPhong
        );
      } else {
        return [...prevSelectedRooms, room];
      }
    });
  };

  const handleBooking = async () => {
    if (selectedRooms.length === 0) return;

    const roomIds = selectedRooms.map((room) => room.MaPhong);
    const requestBody = new URLSearchParams({
      roomIds: JSON.stringify(roomIds),
      checkInDate: format(startDate!, "yyyy-MM-dd"),
      checkOutDate: format(endDate!, "yyyy-MM-dd"),
      cusName: bookingData.cusName,
      cusPhoneNumber: bookingData.cusPhoneNumber,
      cusCitizenId: bookingData.cusCitizenId,
      cusSex: bookingData.cusSex,
      cusDOB: bookingData.cusDOB,
      deposit: bookingData.deposit.toString(),
    }).toString();

    try {
      const response = await fetch(`${APIURL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
      });
      console.log("Booking request body: ", requestBody);
      console.log("Booking response: ", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Booking successful: ", result);
      alert("Đặt phòng thành công");
      setIsBookingModalOpen(false);
      setSelectedRooms([]);
    } catch (error) {
      console.log("Failed to book room: ", error);
    }
  };

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Tìm kiếm và đặt phòng
      </h1>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Chọn ngày bắt đầu
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Chọn ngày kết thúc
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

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
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="CN01">Chi nhánh 1</option>
              <option value="CN02">Chi nhánh 2</option>
            </select>
          </div>

          {data.length === 0 ? (
            <div>
              <p>Không có dữ liệu</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((room) => (
                <div
                  key={room.MaPhong}
                  className="p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-300">
                    Phòng {room.SoPhong}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Loại phòng: {room.LoaiPhong}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Sức chứa: {room.SucChua}
                  </p>
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                      Dịch vụ
                    </h3>
                    {room.services?.map((key) => (
                      <div
                        key={key.Ten}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {key.Ten}

                        <p>{key.Mota}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                      Trang thiết bị
                    </h3>
                    {room.facilities?.map((key) => (
                      <div
                        key={key.TenTrangBi}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {key.TenTrangBi}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                      Giá phòng:
                    </h3>
                    {room.GiaPhong.map((price) => (
                      <div
                        key={price.ThoiGianBatDauApDung}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {format(
                          new Date(price.ThoiGianBatDauApDung),
                          "dd/MM/yyyy"
                        )}{" "}
                        - {price.GiaCongBo} VND
                        {price.GiaGiam && (
                          <span className="text-red-500">
                            {" "}
                            (Giảm: {price.GiaGiam} VND)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    className={`mt-4 px-4 py-2 rounded ${
                      selectedRooms.some(
                        (selectedRoom) => selectedRoom.MaPhong === room.MaPhong
                      )
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                    onClick={() => handleRoomSelection(room)}
                  >
                    {selectedRooms.some(
                      (selectedRoom) => selectedRoom.MaPhong === room.MaPhong
                    )
                      ? "Bỏ Chọn"
                      : "Chọn Phòng"}
                  </button>
                </div>
              ))}
            </div>
          )}
          {selectedRooms.length > 0 && (
            <div className="fixed bottom-10 right-10">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Đặt phòng
              </button>
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

      {isBookingModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Đặt phòng</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tên khách hàng</label>
              <input
                type="text"
                value={bookingData.cusName}
                onChange={(e) =>
                  setBookingData({ ...bookingData, cusName: e.target.value })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="text"
                value={bookingData.cusPhoneNumber}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    cusPhoneNumber: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">CMND/CCCD</label>
              <input
                type="text"
                value={bookingData.cusCitizenId}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    cusCitizenId: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Giới tính</label>
              <select
                value={bookingData.cusSex}
                onChange={(e) =>
                  setBookingData({ ...bookingData, cusSex: e.target.value })
                }
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Ngày sinh</label>
              <input
                type="date"
                value={bookingData.cusDOB}
                onChange={(e) =>
                  setBookingData({ ...bookingData, cusDOB: e.target.value })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Đặt cọc</label>
              <input
                type="number"
                value={bookingData.deposit}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    deposit: Number(e.target.value),
                  })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleBooking}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Đặt phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
