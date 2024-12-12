"use client";
import { useState, useEffect, useCallback } from "react";
import DeviceRoomsDetail from "./openDeviceRoomsDetail/deviceRoomsDetail";
import CreateDeviceRooms from "./createDeviceRooms/createDeviceRooms";
import { currencyFormat } from "@/utils/formatter";

export interface DeviceRoomsProps {
    ID: string;
    TenSanPham: string;
    SoLuong: number;
    GiaNhapDonVi: string;
    GiaBanDonVi: string;
}

export default function DeviceRooms({ roomID }: { roomID: string | undefined }) {
    const [data, setData] = useState<DeviceRoomsProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openCreateDeviceRooms, setOpenCreateDeviceRooms] = useState(false);
    const [openDeviceRoomsDetail, setOpenDeviceRoomsDetail] = useState(false);
    const [selectedDeviceRooms, setSelectedDeviceRooms] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const [goodIdAddToRoom, setGoodIdAddToRoom] = useState("");
    const [quantityAddToRoom, setQuantityAddToRoom] = useState(0);

    const [isAddDeviceToRoom, setIsAddDeviceToRoom] = useState(false);

    const fetchDataDeviceRooms = async (limit: number, page: number, searchId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${APIURL}/goods?limit=${limit}&page=${page}&search=${searchId}`, {
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
            setTotalPages(Math.ceil(result.total / limit));
            setIsLoading(false);
        } catch (error) {
            console.log("Failed to fetch data: ", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataDeviceRooms(rowsPerPage, currentPage + 1, debouncedSearchInput);
    }, [rowsPerPage, currentPage, debouncedSearchInput]);

    const deleteDataDeviceRooms = async (id: string) => {
        try {
            const response = await fetch(`${APIURL}/goods/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Deleted DeviceRooms: ", result);
            fetchDataDeviceRooms(rowsPerPage, currentPage + 1, debouncedSearchInput);
        } catch (error) {
            console.log("Failed to delete data: ", error);
        }
    };

    const AddDeviceToRooms = async () => {
        const requestBody = {
            goodId: goodIdAddToRoom,
            quantity: quantityAddToRoom,
        };
        try {
            const response = await fetch(`${APIURL}/rooms/${roomID}/goods`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Add DeviceRooms: ", result);
            fetchDataDeviceRooms(rowsPerPage, currentPage + 1, debouncedSearchInput);
        } catch (error) {
            console.log("Failed to add data: ", error);
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
        }, 2000); // Adjust the delay as needed

        return () => {
            clearTimeout(handler);
        };
    }, [searchInput]);

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(0);
    };

    return (
        <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Quản lý đồ dùng trong phòng</h1>

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
                            onClick={() => setOpenCreateDeviceRooms(true)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                            Tạo mới
                        </button>
                    </div>

                    {data.length === 0 ? (
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
                                            Tên sản phẩm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Số lượng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Giá nhập đơn vị
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Giá bán đơn vị
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Cập nhật
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Xóa
                                        </th>
                                        {roomID !== "" ? (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Thêm vào phòng
                                            </th>
                                        ) : (
                                            <></>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                                    {data.map((deviceRoom) => (
                                        <tr key={deviceRoom.ID}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                                {deviceRoom.ID}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                                {deviceRoom.TenSanPham}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                                {deviceRoom.SoLuong}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                                {currencyFormat(parseFloat(deviceRoom.GiaNhapDonVi))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                                {currencyFormat(parseFloat(deviceRoom.GiaBanDonVi))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDeviceRooms(deviceRoom.ID);
                                                        setOpenDeviceRoomsDetail(true);
                                                    }}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                                >
                                                    Cập nhật
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                                <button
                                                    onClick={() => deleteDataDeviceRooms(deviceRoom.ID)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                            {roomID !== "" ? (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    <button
                                                        onClick={() => {
                                                            setGoodIdAddToRoom(deviceRoom.ID);
                                                            setIsAddDeviceToRoom(true);
                                                        }}
                                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                                    >
                                                        Thêm vào phòng
                                                    </button>
                                                </td>
                                            ) : (
                                                <></>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {openCreateDeviceRooms && (
                        <CreateDeviceRooms
                            setIsCreate={setOpenCreateDeviceRooms}
                            fetchDataDeviceRooms={() =>
                                fetchDataDeviceRooms(rowsPerPage, currentPage + 1, debouncedSearchInput)
                            }
                        />
                    )}
                    {isAddDeviceToRoom && (
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-4 rounded-lg">
                                <h1 className="text-xl font-bold mb-4">Thêm vào phòng</h1>
                                <input
                                    type="number"
                                    value={quantityAddToRoom}
                                    onChange={(e) => setQuantityAddToRoom(Number(e.target.value))}
                                    placeholder="Nhập số lượng"
                                    className="p-2 border border-gray-300 rounded"
                                />
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => {
                                            setIsAddDeviceToRoom(false);
                                            setQuantityAddToRoom(0);
                                        }}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={() => {
                                            AddDeviceToRooms();
                                            setIsAddDeviceToRoom(false);
                                            setQuantityAddToRoom(0);
                                        }}
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {openDeviceRoomsDetail && (
                        <DeviceRoomsDetail
                            onClose={() => setOpenDeviceRoomsDetail(false)}
                            entry={
                                data.find((item) => item.ID === selectedDeviceRooms) || {
                                    ID: "",
                                    TenSanPham: "",
                                    SoLuong: 0,
                                    GiaNhapDonVi: "",
                                    GiaBanDonVi: "",
                                }
                            }
                            refreshData={() => fetchDataDeviceRooms(rowsPerPage, currentPage + 1, debouncedSearchInput)}
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
                                onChange={(e) => setCurrentPage(Math.min(Number(e.target.value) - 1, totalPages))}
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
