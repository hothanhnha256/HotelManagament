"use client";

import { useState, useEffect, useMemo } from "react";
import { dataRoom } from "./interface/roomInterface";
import CreateRoom from "./createRoom";
import RoomDetail from "./openRoomDetail/RoomDetail";
import {roomStatusMapping, roomTypeMapping} from "../../../utils/dataMapping"

interface AdjustPriceRoomProps {
  month: string;
  year: string;
  normalRoomMinPrice: string;
  normalRoomPublicPrice: string;
  vipRoomMinPrice: string;
  vipRoomPublicPrice: string;
}
export default function RoomManagement() {
  const [data, setData] = useState<dataRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isCreate, setIsCreate] = useState(false);
  const [isAdjustPrice, setIsAdjustPrice] = useState(false);
  const [isDeletePrice, setIsDeletePrice] = useState(false);
  const [error, setError] = useState<string>("");
  const [totalPages, setTotalPages] = useState(0);
  const [roomDetail, setRoomDetail] = useState<dataRoom | null>(null);
  const [isRoomDetailOpen, setIsRoomDetailOpen] = useState(false);

  const [adjustPriceData, setAdjustPriceData] = useState<AdjustPriceRoomProps>({
    month: "",
    year: "",
    normalRoomMinPrice: "",
    normalRoomPublicPrice: "",
    vipRoomMinPrice: "",
    vipRoomPublicPrice: "",
  });

  const [deletePriceData, setDeletePriceData] = useState({
    month: "",
    year: "",
  });

  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const [filterTinhTrang, setFilterTinhTrang] = useState("");
  const [filterChiNhanh, setFilterChiNhanh] = useState("");
  const [filterLoaiPhong, setFilterLoaiPhong] = useState("");

  const fetchDataRoom = async (
    limit: number,
    page: number,
    branchId: string,
    status: string,
    type: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/rooms/all?limit=${limit}&page=${page}&branchId=${branchId}&status=${status}&type=${type}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",

            "Content-Type": "application/json",
          },
        }
      );
      console.log("response: ", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Rooms: ", result);
      setData(result.data);
      console.log("Data: ", data);
      setTotalPages(Math.ceil(result.total / limit));
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  const adjustPriceRoom = async () => {
    console.log("Adjust price data: ", adjustPriceData);
    console.log(
      new URLSearchParams({
        month: adjustPriceData.month,
        year: adjustPriceData.year,
        normalRoomMinPrice: adjustPriceData.normalRoomMinPrice,
        normalRoomPublicPrice: adjustPriceData.normalRoomPublicPrice,
        vipRoomMinPrice: adjustPriceData.vipRoomMinPrice,
        vipRoomPublicPrice: adjustPriceData.vipRoomPublicPrice,
      }).toString()
    );
    try {
      const response = await fetch(`${APIURL}/rooms/price/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          month: adjustPriceData.month,
          year: adjustPriceData.year,
          normalRoomMinPrice: adjustPriceData.normalRoomMinPrice,
          normalRoomPublicPrice: adjustPriceData.normalRoomPublicPrice,
          vipRoomMinPrice: adjustPriceData.vipRoomMinPrice,
          vipRoomPublicPrice: adjustPriceData.vipRoomPublicPrice,
        }).toString(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Adjusted price: ", result);
      alert("Điều chỉnh giá phòng thành công");
      setIsAdjustPrice(false);
    } catch (error) {
      console.log("Failed to adjust price: ", error);
    }
  };

  const deletePriceRoom = async () => {
    try {
      const response = await fetch(
        `${APIURL}/rooms/price/all?month=${deletePriceData.month}&year=${deletePriceData.year}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Deleted price: ", result);
      alert("Xoá giá phòng thành công");
      setIsDeletePrice(false);
    } catch (error) {}
  };

  useEffect(() => {
    fetchDataRoom(
      rowsPerPage,
      currentPage + 1,
      filterChiNhanh,
      filterTinhTrang,
      filterLoaiPhong
    );
    fetchDiscount();
  }, [
    rowsPerPage,
    currentPage,
    filterChiNhanh,
    filterTinhTrang,
    filterLoaiPhong,
  ]);

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

  const handleAdjustPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdjustPriceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeletePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeletePriceData((prev) => ({ ...prev, [name]: value }));
  };

  //For APPLY DISCOUNT
  const [discountData, setDiscountData] = useState<
    | [
        {
          MaGiamGia: string;
          ThoiGianBatDau: string;
          ThoiGianKetThuc: string;
          PhanTramGiamGia: string;
        }
      ]
    | []
  >([]);

  const [discountId, setDiscountId] = useState("");

  const fetchDiscount = async () => {
    try {
      const response = await fetch(`${APIURL}/discounts/all?limit=10&page=1`, {
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
      setDiscountData(result.data);
      console.log("Discount data: ", discountData);
      console.log("Discount data: ", result.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const [roomToApplyDiscount, setRoomToApplyDiscount] = useState("");

  const handleApplyDiscount = async () => {
    try {
      const response = await fetch(
        `${APIURL}/rooms/${roomToApplyDiscount}/discount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            discountId: discountId,
          }).toString(),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      alert("Áp dụng mã giảm giá thành công");
    } catch (error) {
      console.log("Failed to apply discount: ", error);
      alert("Failed to apply discount");
    }
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
            Quản lý phòng
          </h2>
          <div className="flex flex-col md:flex-row place-content-between mb-4 gap-2">
            <select
              value={filterTinhTrang}
              onChange={(e) => setFilterTinhTrang(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Tất cả tình trạng</option>
              <option value="in use">Đang sử dụng</option>
              <option value="empty">Trống</option>
              <option value="maintenance">Bảo trì</option>
            </select>
            <select
              value={filterChiNhanh}
              onChange={(e) => setFilterChiNhanh(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Tất cả chi nhánh</option>
              <option value="CN01">CN1</option>
              <option value="CN02">CN2</option>
            </select>
            <select
              value={filterLoaiPhong}
              onChange={(e) => setFilterLoaiPhong(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Tất cả loại phòng</option>
              <option value="vip">Phòng VIP</option>
              <option value="normal">Phòng thường</option>
            </select>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={() => setIsCreate(true)}
            >
              Tạo mới
            </button>
            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={() => setIsAdjustPrice(true)}
            >
              Điều chỉnh giá phòng
            </button>
          </div>
          {isCreate && (
            <CreateRoom
              setIsCreate={setIsCreate}
              fetchDataRoom={() =>
                fetchDataRoom(
                  rowsPerPage,
                  currentPage + 1,
                  filterChiNhanh,
                  filterTinhTrang,
                  filterLoaiPhong
                )
              }
            />
          )}
          {isAdjustPrice && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">
                  Điều chỉnh giá phòng
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Tháng</label>
                  <input
                    type="text"
                    name="month"
                    value={adjustPriceData.month}
                    onChange={handleAdjustPriceChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Năm</label>
                  <input
                    type="text"
                    name="year"
                    value={adjustPriceData.year}
                    onChange={handleAdjustPriceChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Giá phòng thường
                  </label>
                  <input
                    type="text"
                    name="normalRoomMinPrice"
                    value={adjustPriceData.normalRoomMinPrice}
                    onChange={handleAdjustPriceChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Giá phòng VIP</label>
                  <input
                    type="text"
                    name="vipRoomMinPrice"
                    value={adjustPriceData.vipRoomMinPrice}
                    onChange={handleAdjustPriceChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Giá phòng thường (giá công khai)
                  </label>
                  <input
                    type="text"
                    name="normalRoomPublicPrice"
                    value={adjustPriceData.normalRoomPublicPrice}
                    onChange={handleAdjustPriceChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Giá phòng VIP (giá công khai)
                  </label>
                  <input
                    type="text"
                    name="vipRoomPublicPrice"
                    value={adjustPriceData.vipRoomPublicPrice}
                    onChange={handleAdjustPriceChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="flex w-full place-content-center gap-3">
                  <button
                    className="p-2 bg-blue-500 text-white rounded w-32"
                    onClick={adjustPriceRoom}
                  >
                    Điều chỉnh
                  </button>
                  <button
                    className="p-2 bg-gray-500 text-white rounded w-32"
                    onClick={() => setIsAdjustPrice(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded w-32"
                    onClick={() => setIsDeletePrice(true)}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          )}
          {isDeletePrice && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Xoá giá phòng</h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Tháng</label>
                  <input
                    type="text"
                    name="month"
                    value={deletePriceData.month}
                    onChange={handleDeletePriceChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Năm</label>
                  <input
                    type="text"
                    name="year"
                    value={deletePriceData.year}
                    onChange={handleDeletePriceChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="flex w-full place-content-center gap-3">
                  <button
                    className="p-2 bg-red-500 text-white rounded w-32"
                    onClick={deletePriceRoom}
                  >
                    Xoá
                  </button>
                  <button
                    className="p-2 bg-gray-500 text-white rounded w-32"
                    onClick={() => setIsDeletePrice(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mã Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mã Chi Nhánh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tình Trạng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Loại Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cập nhật
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Xem chi tiết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Áp dụng giảm giá
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.MaPhong}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.MaPhong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {row.MaChiNhanh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {roomStatusMapping(row.TrangThai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {roomTypeMapping(row.LoaiPhong)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      <button
                        onClick={() => {
                          setRoomDetail(row);
                          setIsRoomDetailOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Cập nhật
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      <a href={`room/${row.MaPhong}`}>Xem</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      <select
                        value={discountId}
                        onChange={(e) => setDiscountId(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                      >
                        <option value="">Chọn mã giảm giá</option>
                        {discountData.map((discount) => (
                          <option value={discount.MaGiamGia}>
                            {discount.MaGiamGia}: {discount.PhanTramGiamGia}%
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setRoomToApplyDiscount(row.MaPhong);
                          handleApplyDiscount();
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Áp dụng
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isRoomDetailOpen && (
            <RoomDetail
              entry={roomDetail}
              onClose={() => setIsRoomDetailOpen(false)}
              fetchDataRoom={() =>
                fetchDataRoom(
                  rowsPerPage,
                  currentPage + 1,
                  filterChiNhanh,
                  filterTinhTrang,
                  filterLoaiPhong
                )
              }
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
              Đi tới trang{" "}
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
