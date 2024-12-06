"use client";
import { useState, useEffect, useMemo } from "react";
import PriceListDetail from "./openPriceListDetail/priceListDetail";
import { AdjustPriceListDetail } from "./adjustPriceList/adjustPriceListInterface";
import AdjustPriceList from "./adjustPriceList/adjustPriceList";
import Calendar from "./calendar";

interface Room {
  id: string;
  name: string;
  type: "VIP" | "Normal";
  status: string;
  prices: { date: string; price: number }[];
}

const fakeDataRooms: Room[] = [
  {
    id: "1",
    name: "Room 101",
    type: "VIP",
    status: "Active",
    prices: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      price: 200 + i,
    })),
  },
  {
    id: "2",
    name: "Room 102",
    type: "Normal",
    status: "Active",
    prices: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      price: 100 + i,
    })),
  },
  // Add more fake data as needed
];

export default function PriceList() {
  const [data, setData] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filterType, setFilterType] = useState<"VIP" | "Normal" | "">("");
  const [openAdjust, setOpenAdjust] = useState(false);
  const [openPriceListDetail, setOpenPriceListDetail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const fetchDataRooms = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(fakeDataRooms);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchDataRooms();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchInput) {
      filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.type.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    return filtered;
  }, [data, searchInput, filterType]);

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Price Management
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
        <div className="justify-between items-center mb-4 w-full">
          <div className="flex flex-col md:flex-row place-content-between mb-4 gap-2">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or type"
              className="p-2 border border-gray-300 rounded"
            />
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "VIP" | "Normal" | "")
              }
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">All Types</option>
              <option value="VIP">VIP</option>
              <option value="Normal">Normal</option>
            </select>
            <button
              onClick={() => setOpenAdjust(true)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Setting Price by Type
            </button>
          </div>

          {filteredData.length === 0 ? (
            <div>No data available</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                  {filteredData.map((room) => (
                    <tr key={room.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {room.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {room.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {room.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        {room.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            setOpenPriceListDetail(true);
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {openAdjust && (
            <AdjustPriceList
              setIsAdjust={setOpenAdjust}
              fetchDataPriceList={() => fetchDataRooms()}
            />
          )}
          {openPriceListDetail && selectedRoom && (
            <PriceListDetail
              onClose={() => setOpenPriceListDetail(false)}
              room={selectedRoom}
            />
          )}
        </div>
      )}
    </div>
  );
}
