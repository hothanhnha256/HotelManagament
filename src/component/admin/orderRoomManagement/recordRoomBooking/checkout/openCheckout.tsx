"use client";
import { useState, useEffect } from "react";

export interface CheckoutRoomCheckoutRoomInterface {
  onClose: () => void;
  orderId: string;
}

export default function CheckoutRoom(props: CheckoutRoomCheckoutRoomInterface) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCheckoutReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/booking/${props.orderId}/checkout`,
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
      setIsLoading(false);
    } catch (error) {
      //console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutReport();
  }, []);

  //FOR ACCEPT CHECKOUT
  const checkoutRoom = async () => {
    try {
      const response = await fetch(
        `${APIURL}/booking/${props.orderId}/checkout`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      //console.log(response);
      const result = await response.json();
      //console.log(result);
      if (!response.ok) {
        alert(result.message);
        return;
      }
      //console.log(result);
      alert("Checkout successfully");
    } catch (error) {
      //console.log("Failed to checkout ", error);
      alert("Failed to checkout");
    }
  };

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
          Thông tin phòng
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
                  {Object.entries(data.order || {}).map(([key, value]) => (
                    <p
                      key={key}
                      className="text-gray-700 dark:text-gray-300 capitalize"
                    >
                      {key}: {String(value) ?? "N/A"}
                    </p>
                  ))}
                </div>
              </div>

              {/* Reports */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-300">
                  Báo cáo
                </h2>
                {data.reports?.report?.map((report: any) => (
                  <div
                    key={report.ID}
                    className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-900 mb-4"
                  >
                    {Object.entries(report).map(([key, value]) => (
                      <p
                        key={key}
                        className="text-gray-700 dark:text-gray-300 capitalize"
                      >
                        {key}: {String(value) ?? "N/A"}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Rooms */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-300">
                  Phòng
                </h2>
                {data.rooms.map((room: any) => (
                  <div
                    key={room.MaPhong}
                    className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-900 mb-4"
                  >
                    {Object.entries(room).map(([key, value]) => (
                      <p
                        key={key}
                        className="text-gray-700 dark:text-gray-300 capitalize"
                      >
                        {key}: {String(value) ?? "N/A"}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Services */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-300">
                  Dịch vụ
                </h2>
                {data.services.map((serviceCategory: any, index: number) =>
                  Object.entries(serviceCategory).map(
                    ([category, services]) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-900 mb-4"
                      >
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-300 capitalize">
                          {category}
                        </h3>
                        {Array.isArray(services) &&
                          services.map((service: any) => (
                            <div
                              key={service.MaDon}
                              className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-900 mb-4"
                            >
                              {Object.entries(service).map(([key, value]) => (
                                <p
                                  key={key}
                                  className="text-gray-700 dark:text-gray-300 capitalize"
                                >
                                  {key}: {String(value) ?? "N/A"}
                                </p>
                              ))}
                            </div>
                          ))}
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          )
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={checkoutRoom}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
