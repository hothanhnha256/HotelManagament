import React, { useState, useEffect } from "react";
export interface DataBookingRoomProps {
  onClose: () => void;
  createdAt: string;
  roomId: string;
}
export interface Report {
  ID: string;
  ThoiGian: string;
  NoiDung: string;
}
export interface GoodUse {
  ID: string;
  SoLuong: string;
  Gia: string;
  MaBanBaoCaoPhong: string;
  TenSanPham: string;
}
export interface DataBookingRoom {
  report: Report[];
  good_usages: GoodUse[];
}
export default function OpenSeeReport(props: DataBookingRoomProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<DataBookingRoom | null>(null);

  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/rooms/${props.roomId}/${props.createdAt}/report`,
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
    } catch (error) {
      console.log("Failed to fetch data: ", error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleFetchData();
  }, []);
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
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">
          Báo cáo sử dụng
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
          data && (
            <div className="space-y-6">
              {/* Order Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-300">
                  Đơn đặt phòng
                </h2>
                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-900">
                  {data.report.map((report) => (
                    <div key={report.ID}>
                      <p className="text-gray-700 dark:text-gray-300 capitalize">
                        ID: {report.ID}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 capitalize">
                        Thời gian: {report.ThoiGian}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 capitalize">
                        Nội dung: {report.NoiDung}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* GoodUsages */}

              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-300">
                  Sản phẩm sử dụng
                </h2>
                {data.good_usages.map((goodUsage) => (
                  <div
                    key={goodUsage.ID}
                    className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-900 mb-4"
                  >
                    <p className="text-gray-700 dark:text-gray-300 capitalize">
                      ID: {goodUsage.ID}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 capitalize">
                      Số lượng: {goodUsage.SoLuong}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 capitalize">
                      Giá: {goodUsage.Gia}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 capitalize">
                      Mã báo cáo phòng: {goodUsage.MaBanBaoCaoPhong}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 capitalize">
                      Tên sản phẩm: {goodUsage.TenSanPham}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
