import React, { useState } from "react";
import Calendar from "../calendar";

interface PriceListDetailProps {
  room: {
    id: string;
    name: string;
    type: "VIP" | "Normal";
    status: string;
    prices: { date: string; price: number }[];
  };
  onClose: () => void;
}

export default function PriceListDetail({
  room,
  onClose,
}: PriceListDetailProps) {
  const [prices, setPrices] = useState(room.prices);

  const handlePriceChange = (date: string, newPrice: number) => {
    setPrices((prevPrices) =>
      prevPrices.map((price) =>
        price.date === date ? { ...price, price: newPrice } : price
      )
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Price Details for {room.name}
          </h2>
          <button
            className="ml-4 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white font-semibold py-1 px-2 border border-gray-300 dark:border-gray-600 rounded"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <Calendar prices={prices} onPriceChange={handlePriceChange} />
      </div>
    </div>
  );
}
