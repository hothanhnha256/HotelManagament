"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export interface LaundryProps {
  MaDon: string;
  MaDichVu: string;
  MaPhong: string;
  ThoiGianTaoBanGhiPhong: string;
  ThoiGian: string;
  SoKg: string;
  TongTien: string;
  TrangThai: string;
}

export interface TransportProps {
  MaDon: string;
  MaDichVu: string;
  MaPhong: string;
  ThoiGianTaoBanGhiPhong: string;
  ThoiGian: string;
  DiemDi: string;
  DiemDen: string;
  TongTien: string;
  TrangThai: string;
}

export interface FoodProps {
  MaDon: string;
  MaDichVu: string;
  MaPhong: string;
  ThoiGianTaoBanGhiPhong: string;
  ThoiGian: string;
  SoLuong: number;
  TongTien: string;
  TrangThai: string;
}

export interface MeetingRoomProps {
  MaDon: string;
  MaDichVu: string;
  MaPhong: string;
  ThoiGianTaoBanGhiPhong: string;
  ThoiGian: string;
  ThoiGianBatDau: string;
  ThoiGianKetThuc: string;
  TongTien: string;
  TrangThai: string;
}

export interface BookingRoomServiceProps {
  laundry: LaundryProps[];
  transport: TransportProps[];
  food: FoodProps[];
  meetingRoom: MeetingRoomProps[];
}

export interface BookingRoomServiceInterface {
  onClose: () => void;
  createdAt: string;
  roomId: string;
}

export default function BookingRoomService(
  bookingRoomService: BookingRoomServiceInterface
) {
  const [data, setData] = useState<BookingRoomServiceProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceType, setServiceType] = useState("laundry");
  const [serviceId, setServiceId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState(0);
  const [departure, setDeparture] = useState("");
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [finishTime, setFinishTime] = useState("");
  const [status, setStatus] = useState("completed");
  const [selectedService, setSelectedService] = useState<any>(null);
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDataBookingRoomService = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/booking/room-service?roomId=${bookingRoomService.roomId}&createdAt=${bookingRoomService.createdAt}`,
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
      const result = await response.json();
      console.log("result: ", result.data);
      setData(result.data);
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  const deleteBookingRoomService = async (MaDon: string, type: string) => {
    try {
      const response = await fetch(
        `${APIURL}/booking/room-service/${MaDon}?type=${type}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchDataBookingRoomService();
    } catch (error) {
      console.log("Failed to delete booking room service: ", error);
    }
  };

  const updateBookingRoomService = async (MaDon: string) => {
    const requestBody = new URLSearchParams();
    if (serviceType === "meetingRoom") {
      requestBody.append("type", "meeting room");
    } else {
      requestBody.append("type", serviceType);
    }
    if (serviceType === "food") {
      requestBody.append("quantity", quantity.toString());
    }
    if (serviceType === "laundry") {
      requestBody.append("weight", weight.toString());
    }
    if (serviceType === "transport") {
      requestBody.append("departure", departure);
      requestBody.append("distance", distance?.toString());
      requestBody.append("destination", destination);
    }
    if (serviceType === "meetingRoom") {
      requestBody.append("startTime", startTime);
      requestBody.append("finishTime", finishTime);
    }

    console.log("requestBody: ", requestBody.toString());
    console.log("MaDon: ", MaDon);
    try {
      const response = await fetch(`${APIURL}/booking/room-service/${MaDon}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody.toString(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      alert("Đơn dịch vụ đã được cập nhật thành công");
      fetchDataBookingRoomService();
      setSelectedService(null);
    } catch (error) {
      console.log("Failed to update booking room service: ", error);
    }
  };

  const adjustBookingRoomService = async (
    MaDon: string,
    status: string,
    type: string
  ) => {
    const requestBody = new URLSearchParams();
    if (type === "meetingRoom") {
      requestBody.append("type", "meeting room");
    } else {
      requestBody.append("type", type);
    }
    requestBody.append("status", status);

    console.log("requestBody: ", requestBody.toString());
    console.log("MaDon: ", MaDon);
    try {
      const response = await fetch(`${APIURL}/booking/room-service/${MaDon}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody.toString(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Đơn dịch vụ đã được cập nhật thành công");
      fetchDataBookingRoomService();
      setSelectedService(null);
    } catch (error) {
      console.log("Failed to update booking room service: ", error);
    }
  };

  const [AdjustOrderId, setAdjustOrderId] = useState("");

  const bookRoomService = async () => {
    const requestBody = new URLSearchParams({
      roomId: bookingRoomService.roomId,
      createdAt: bookingRoomService.createdAt,
      serviceId,
      type: serviceType,
      quantity: quantity?.toString(),
      destination,
      weight: weight?.toString(),
      departure,
      distance: distance?.toString(),
      startTime,
      finishTime,
    });

    try {
      const response = await fetch(
        `${APIURL}/booking/room-service/${AdjustOrderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: requestBody.toString(),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      alert("Dịch vụ đã được đặt thành công");
      fetchDataBookingRoomService();
    } catch (error) {
      console.log("Failed to book room service: ", error);
    }
  };

  useEffect(() => {
    fetchDataBookingRoomService();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl h-5/6 overflow-y-auto">
        <div className="absolute top-4 right-4">
          <button
            onClick={bookingRoomService.onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Đóng
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">
          Quản lý dịch vụ phòng
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-300">
            Đặt dịch vụ mới
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Loại dịch vụ
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="laundry">Giặt ủi</option>
                <option value="transport">Vận chuyển</option>
                <option value="food">Thức ăn</option>
                <option value="meetingRoom">Phòng họp</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Mã dịch vụ
              </label>
              <input
                type="text"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Số lượng
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Điểm đến
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Cân nặng
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Điểm đi
              </label>
              <input
                type="text"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Khoảng cách
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Thời gian bắt đầu
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Thời gian kết thúc
              </label>
              <input
                type="datetime-local"
                value={finishTime}
                onChange={(e) => setFinishTime(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>
          <button
            onClick={bookRoomService}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Đặt dịch vụ
          </button>
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
          <div className="space-y-6">
            {data &&
              Object.keys(data).map((serviceType) => (
                <div key={serviceType}>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-300 capitalize">
                    {serviceType}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data[serviceType as keyof BookingRoomServiceProps]?.map(
                      (service: any) => (
                        <div
                          key={service.MaDon}
                          className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900"
                        >
                          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-300">
                            Mã Đơn: {service.MaDon}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            Mã Dịch Vụ: {service.MaDichVu}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Mã Phòng: {service.MaPhong}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Thời Gian Tạo:{" "}
                            {format(
                              new Date(service.ThoiGianTaoBanGhiPhong),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Thời Gian:{" "}
                            {format(
                              new Date(service.ThoiGian),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </p>
                          {service.SoKg && (
                            <p className="text-gray-700 dark:text-gray-300">
                              Số Kg: {service.SoKg}
                            </p>
                          )}
                          {service.DiemDi && (
                            <p className="text-gray-700 dark:text-gray-300">
                              Điểm Đi: {service.DiemDi}
                            </p>
                          )}
                          {service.DiemDen && (
                            <p className="text-gray-700 dark:text-gray-300">
                              Điểm Đến: {service.DiemDen}
                            </p>
                          )}
                          {service.KhoangCach && (
                            <p className="text-gray-700 dark:text-gray-300">
                              Khoảng Cách: {service.KhoangCach}
                            </p>
                          )}
                          {service.SoLuong && (
                            <p className="text-gray-700 dark:text-gray-300">
                              Số Lượng: {service.SoLuong}
                            </p>
                          )}
                          {service.ThoiGianBatDau && (
                            <p className="text-gray-700 dark:text-gray-300">
                              Thời Gian Bắt Đầu:{" "}
                              {format(
                                new Date(service.ThoiGianBatDau),
                                "dd/MM/yyyy HH:mm:ss"
                              )}
                            </p>
                          )}
                          {service.ThoiGianKetThuc && (
                            <p className="text-gray-700 dark:text-gray-300">
                              Thời Gian Kết Thúc:{" "}
                              {format(
                                new Date(service.ThoiGianKetThuc),
                                "dd/MM/yyyy HH:mm:ss"
                              )}
                            </p>
                          )}
                          <p className="text-gray-700 dark:text-gray-300">
                            Tổng Tiền: {service.TongTien} VND
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Trạng Thái: {service.TrangThai}
                          </p>
                          <div
                            className="
    grid grid-cols-2 
    gap-4
    items-center
    mt-4
                          text-xs
  "
                          >
                            <button
                              onClick={() =>
                                deleteBookingRoomService(
                                  service.MaDon,
                                  {
                                    laundry: "laundry",
                                    transport: "transport",
                                    food: "food",
                                    meetingRoom: "meeting room",
                                  }[serviceType] || "laundry"
                                )
                              }
                              className="
      px-4 py-2 bg-red-500 text-white 
      rounded-lg shadow hover:bg-red-600 
      transition-transform transform hover:scale-105
    "
                            >
                              Xóa
                            </button>
                            {service.TrangThai === "not completed" && (
                              <>
                                <button
                                  className="
          px-4 py-2 bg-green-500 text-white 
          rounded-lg shadow hover:bg-green-600 
          transition-transform transform hover:scale-105
        "
                                  onClick={() =>
                                    adjustBookingRoomService(
                                      service.MaDon,

                                      "completed",
                                      {
                                        laundry: "laundry",
                                        transport: "transport",
                                        food: "food",
                                        meetingRoom: "meeting room",
                                      }[serviceType] || "laundry"
                                    )
                                  }
                                >
                                  Hoàn Thành
                                </button>
                                <button
                                  className="
          px-4 py-2 bg-gray-500 text-white 
          rounded-lg shadow hover:bg-gray-600 
          transition-transform transform hover:scale-105
        "
                                  onClick={() =>
                                    adjustBookingRoomService(
                                      service.MaDon,
                                      "cancelled",
                                      {
                                        laundry: "laundry",
                                        transport: "transport",
                                        food: "food",
                                        meetingRoom: "meeting room",
                                      }[serviceType] || "laundry"
                                    )
                                  }
                                >
                                  Hủy Đơn
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                setSelectedService(service);
                                setServiceType(serviceType);
                                setQuantity(service.SoLuong);
                                setWeight(service.SoKg);
                                setDestination(service.DiemDen);
                                setDeparture(service.DiemDi);
                                setDistance(service.KhoangCach);
                                if (service.ThoiGianBatDau) {
                                  setStartTime(
                                    format(
                                      new Date(service.ThoiGianBatDau),
                                      "yyyy-MM-dd'T'HH:mm"
                                    )
                                  );
                                }
                                if (service.ThoiGianKetThuc) {
                                  setFinishTime(
                                    format(
                                      new Date(service.ThoiGianKetThuc),
                                      "yyyy-MM-dd'T'HH:mm"
                                    )
                                  );
                                }
                                setAdjustOrderId(service.MaDon);
                              }}
                              className="
      px-4 py-2 bg-blue-500 text-white 
      rounded-lg shadow hover:bg-blue-600 
      transition-transform transform hover:scale-105
    "
                            >
                              Sửa
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {selectedService && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                >
                  Đóng
                </button>
              </div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-300">
                Sửa đơn dịch vụ
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {serviceType === "food" && (
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Số lượng
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="p-2 border border-gray-300 rounded w-full"
                    />
                  </div>
                )}
                {serviceType === "laundry" && (
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Số Kg
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="p-2 border border-gray-300 rounded w-full"
                    />
                  </div>
                )}
                {serviceType === "transport" && (
                  <>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Điểm đi
                      </label>
                      <input
                        type="text"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Điểm đến
                      </label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Khoảng cách
                      </label>
                      <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                  </>
                )}
                {serviceType === "meetingRoom" && (
                  <>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Thời gian bắt đầu
                      </label>
                      <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Thời gian kết thúc
                      </label>
                      <input
                        type="datetime-local"
                        value={finishTime}
                        onChange={(e) => setFinishTime(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                  </>
                )}
                <button
                  onClick={() =>
                    updateBookingRoomService(selectedService.MaDon)
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
