"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface PriceData {
  ID: number;
  ThoiGianBatDauApDung: string;
  ThoiGianKetThucApDung: string;
  GiaThapNhat: string;
  GiaCongBo: string;
  MaPhong: string;
}

interface PriceOfRoomProps {
  idRoom: string;
}

export default function PriceOfRoom({ idRoom }: PriceOfRoomProps) {
  const [data, setData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [publicPrice, setPublicPrice] = useState("");
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchDataPriceOfRoom = async (month: string) => {
    setIsLoading(true);
    const encodedMonth = encodeURIComponent(`["${month}"]`);
    const url = `${APIURL}/rooms/${idRoom}/price/?months=${encodedMonth}`;
    console.log(url);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data[0].data);
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch data: ", error);
      setIsLoading(false);
    }
  };

  const adjustPrice = async () => {
    const startDate = format(selectedDays[0], "yyyy-MM-dd");
    const endDate = format(selectedDays[selectedDays.length - 1], "yyyy-MM-dd");
    const requestBody = new URLSearchParams({
      minPrice,
      startDate,
      endDate,
      publicPrice,
    }).toString();
    console.log("Request body: ", requestBody);

    try {
      const response = await fetch(`${APIURL}/rooms/${idRoom}/price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Adjusted price: ", result);
      fetchDataPriceOfRoom(format(selectedMonth!, "yyyy-MM"));
    } catch (error) {
      console.log("Failed to adjust price: ", error);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      const month = format(selectedMonth, "yyyy-MM");
      fetchDataPriceOfRoom(month);
    }
  }, [selectedMonth, idRoom]);

  const daysInMonth = selectedMonth
    ? eachDayOfInterval({
        start: startOfMonth(selectedMonth),
        end: endOfMonth(selectedMonth),
      })
    : [];

  const toggleDaySelection = (day: Date) => {
    if (selectedDays.length === 2) {
      setSelectedDays([day]);
    } else if (
      selectedDays.some(
        (selectedDay) => selectedDay.getTime() === day.getTime()
      )
    ) {
      setSelectedDays(
        selectedDays.filter(
          (selectedDay) => selectedDay.getTime() !== day.getTime()
        )
      );
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Quản lý giá
      </h1>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Chọn tháng
        </label>
        <DatePicker
          selected={selectedMonth}
          onChange={(date) => setSelectedMonth(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
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
        <>
          <div className="grid grid-cols-7 gap-4 mb-4">
            {daysInMonth.map((day) => {
              const price = data.find(
                (p) =>
                  format(new Date(p.ThoiGianBatDauApDung), "yyyy-MM-dd") ===
                  format(day, "yyyy-MM-dd")
              );
              const isSelected = selectedDays.some(
                (selectedDay) => selectedDay.getTime() === day.getTime()
              );
              const isStartDate =
                selectedDays[0] && selectedDays[0].getTime() === day.getTime();
              const isEndDate =
                selectedDays[1] && selectedDays[1].getTime() === day.getTime();
              return (
                <div
                  key={day.toString()}
                  className={`p-2 border border-gray-300 rounded cursor-pointer ${
                    isSelected ? "bg-blue-200" : "bg-white dark:bg-gray-800"
                  } ${isStartDate ? "bg-green-200" : ""} ${
                    isEndDate ? "bg-red-200" : ""
                  }`}
                  onClick={() => toggleDaySelection(day)}
                >
                  <div className="font-bold text-center">
                    {format(day, "dd/MM/yyyy")}
                  </div>
                  {price ? (
                    <>
                      <div className="text-sm">
                        Giá thấp nhất: {price.GiaThapNhat}
                      </div>
                      <div className="text-sm">
                        Giá công bố: {price.GiaCongBo}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm">Không có dữ liệu</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Giá thấp nhất
            </label>
            <input
              type="text"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Giá công bố
            </label>
            <input
              type="text"
              value={publicPrice}
              onChange={(e) => setPublicPrice(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <button
            onClick={adjustPrice}
            className="p-2 bg-blue-500 text-white rounded w-full"
          >
            Điều chỉnh giá
          </button>
        </>
      )}
    </div>
  );
}
