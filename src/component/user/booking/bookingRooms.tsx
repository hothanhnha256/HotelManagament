"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { currencyFormat } from "@/utils/formatter";
import { roomTypeMapping } from "@/utils/dataMapping";
export interface Services {
    Ten: string;
    Mota: string;
}
export interface Facitities {
    TenTrangBi: string;
    imageURL: string;
}
interface UserProfile {
    ID: string;
    Ten: string;
    CCCD: string;
    SoDienThoai: string;
    NgaySinh: string;
    GioiTinh: string;
    Email: string;
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
    const [profile, setProfile] = useState<UserProfile | null>(null);
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

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${APIURL}/auth/user/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                    Authorization: `Bearer ${Cookies.get("tokenuser")}`,
                },
            });
            const data = await res.json();
            if (data.status === "success") {
                setProfile(data.data);
            } else {
            }
        } catch (error) {
            console.log("An error occurred while fetching profile data");
        }
    };

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
                        "ngrok-skip-browser-warning": "true",
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
            if (prevSelectedRooms.some((selectedRoom) => selectedRoom.MaPhong === room.MaPhong)) {
                return prevSelectedRooms.filter((selectedRoom) => selectedRoom.MaPhong !== room.MaPhong);
            } else {
                return [...prevSelectedRooms, room];
            }
        });
    };

    const handleBooking = async () => {
        if (Cookies.get("tokenuser") === undefined) {
            alert("Bạn cần đăng nhập để đặt phòng");
            return;
        }
        if (selectedRooms.length === 0) return;

        const roomIds = selectedRooms.map((room) => room.MaPhong);
        const requestBody = new URLSearchParams({
            roomIds: JSON.stringify(roomIds),
            checkInDate: format(startDate!, "yyyy-MM-dd"),
            checkOutDate: format(endDate!, "yyyy-MM-dd"),
            deposit: bookingData.deposit.toString(),
        });
        requestBody.append("cusName", profile?.Ten || "");
        requestBody.append("cusPhoneNumber", profile?.SoDienThoai || "");
        requestBody.append("cusCitizenId", profile?.CCCD || "");
        requestBody.append("cusSex", profile?.GioiTinh || "");
        requestBody.append("cusDOB", profile ? format(new Date(profile.NgaySinh), "yyyy-MM-dd") : "");

        try {
            const response = await fetch(`${APIURL}/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: requestBody.toString(),
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
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Tìm kiếm và đặt phòng</h1>

            <div className="mb-6 flex space-x-6">
                <div className="w-full">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                        Chọn ngày bắt đầu
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200 ease-in-out"
                    />
                </div>

                <div className="w-full">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                        Chọn ngày kết thúc
                    </label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200 ease-in-out"
                    />
                </div>
            </div>
            {/* <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Chọn ngày bắt đầu</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="p-2 border border-gray-300 rounded w-full"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Chọn ngày kết thúc</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="p-2 border border-gray-300 rounded w-full"
                />
            </div> */}

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
                                    className="p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
                                >
                                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                                        Phòng {room.SoPhong}
                                    </h2>

                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        <span className="font-semibold">Loại phòng:</span>{" "}
                                        <span
                                            className={
                                                room.LoaiPhong === "vip"
                                                    ? "text-yellow-600 font-semibold"
                                                    : "text-gray-600"
                                            }
                                        >
                                            {roomTypeMapping(room.LoaiPhong)}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center ">
                                        <span className="font-semibold">Sức chứa:</span>
                                        {Array.from({ length: room.SucChua }).map((_, index) => (
                                            <svg
                                                key={index}
                                                className="w-4 h-4 text-gray-500 ml-1"
                                                width="800px"
                                                height="800px"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
                                                    fill="#000000"
                                                />
                                                <path
                                                    d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
                                                    fill="#000000"
                                                />
                                            </svg>
                                        ))}
                                    </p>

                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                            Dịch vụ
                                        </h3>
                                        <ul className="space-y-1">
                                            {room.services?.map((service) => (
                                                <li key={service.Ten} className="text-gray-600 dark:text-gray-300">
                                                    <span className="block font-medium">{service.Ten}</span>
                                                    <span className="text-sm">{service.Mota}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                            Trang thiết bị
                                        </h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {room.facilities?.map((facility) => (
                                                // <li
                                                //     key={facility.TenTrangBi}
                                                //     className="text-gray-600 dark:text-gray-300"
                                                // >
                                                //     {facility.TenTrangBi}
                                                // </li>
                                                <li key={facility.TenTrangBi} className="flex items-center space-x-2">
                                                    <svg
                                                        className="w-5 h-5 text-gray-500"
                                                        width="800px"
                                                        height="800px"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M15.4933 6.93502C15.8053 7.20743 15.8374 7.68122 15.565 7.99325L7.70786 16.9933C7.56543 17.1564 7.35943 17.25 7.14287 17.25C6.9263 17.25 6.72031 17.1564 6.57788 16.9933L3.43502 13.3933C3.16261 13.0812 3.19473 12.6074 3.50677 12.335C3.8188 12.0626 4.29259 12.0947 4.565 12.4068L7.14287 15.3596L14.435 7.00677C14.7074 6.69473 15.1812 6.66261 15.4933 6.93502Z"
                                                            fill="#1C274C"
                                                        />
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M20.5175 7.01946C20.8174 7.30513 20.829 7.77986 20.5433 8.07981L11.9716 17.0798C11.8201 17.2389 11.6065 17.3235 11.3872 17.3114C11.1679 17.2993 10.9649 17.1917 10.8318 17.0169L10.4035 16.4544C10.1526 16.1249 10.2163 15.6543 10.5458 15.4034C10.8289 15.1878 11.2161 15.2044 11.4787 15.4223L19.4571 7.04531C19.7428 6.74537 20.2175 6.73379 20.5175 7.01946Z"
                                                            fill="#1C274C"
                                                        />
                                                    </svg>

                                                    <span className="text-sm">{facility.TenTrangBi}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                            Giá phòng
                                        </h3>
                                        <ul className="space-y-2 max-h-56 overflow-y-auto">
                                            {room.GiaPhong.map((price) => (
                                                <li
                                                    key={price.ThoiGianBatDauApDung}
                                                    className="text-gray-600 dark:text-gray-300"
                                                >
                                                    <p>
                                                        {format(new Date(price.ThoiGianBatDauApDung), "dd/MM/yyyy")} -{" "}
                                                        <span
                                                            className={`font-semibold ${
                                                                price.GiaGiam
                                                                    ? "line-through text-gray-400 dark:text-gray-500"
                                                                    : "text-gray-800 dark:text-gray-100"
                                                            }`}
                                                        >
                                                            {currencyFormat(price.GiaCongBo)}
                                                        </span>
                                                        {price.GiaGiam && (
                                                            <span className="ml-2 text-green-500 font-semibold">
                                                                {currencyFormat(price.GiaCongBo - price.GiaGiam)}
                                                            </span>
                                                        )}
                                                    </p>

                                                    {/* {price.GiaGiam && (
                                                        <p>
                                                            <span className="text-red-500 font-semibold">
                                                                Giảm ngay: {currencyFormat(price.GiaGiam)}
                                                            </span>
                                                        </p>
                                                    )}
                                                    {price.GiaGiam && (
                                                        <p>
                                                            <span className="text-green-500 font-semibold">
                                                                Giá cuối cùng:{" "}
                                                                {currencyFormat(price.GiaCongBo - price.GiaGiam)}
                                                            </span>
                                                        </p>
                                                    )} */}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        className={`mt-6 w-full py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${
                                            selectedRooms.some((selectedRoom) => selectedRoom.MaPhong === room.MaPhong)
                                                ? "bg-red-500 text-white hover:bg-red-600"
                                                : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                        onClick={() => handleRoomSelection(room)}
                                    >
                                        {selectedRooms.some((selectedRoom) => selectedRoom.MaPhong === room.MaPhong)
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
                                onClick={() => {
                                    setIsBookingModalOpen(true);
                                    fetchProfile();
                                }}
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
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
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
                                onChange={(e) => setCurrentPage(Math.min(Number(e.target.value) - 1, totalPages - 1))}
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
                            {profile?.Ten}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Số điện thoại</label>
                            {profile?.SoDienThoai}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">CMND/CCCD</label>
                            {profile?.CCCD}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Giới tính</label>
                            {profile?.GioiTinh}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Ngày sinh</label>
                            {profile ? format(new Date(profile.NgaySinh), "dd/MM/yyyy") : ""}
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
                            <button onClick={handleBooking} className="px-4 py-2 bg-blue-500 text-white rounded">
                                Đặt phòng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
