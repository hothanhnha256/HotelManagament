import React, { useState } from "react";

interface CalendarProps {
  prices: { date: string; price: number }[];
  onPriceChange: (date: string, newPrice: number) => void;
}

export default function Calendar({ prices, onPriceChange }: CalendarProps) {
  const [editingPrice, setEditingPrice] = useState<{ [key: string]: number }>(
    {}
  );
  const [showConfirm, setShowConfirm] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [message, setMessage] = useState<{ [key: string]: string }>({});

  const handlePriceChange = (date: string, newPrice: number) => {
    setEditingPrice((prev) => ({ ...prev, [date]: newPrice }));
    setShowConfirm((prev) => ({ ...prev, [date]: true }));
  };

  const handleConfirm = async (date: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onPriceChange(date, editingPrice[date]);
      setMessage((prev) => ({
        ...prev,
        [date]: "Price updated successfully!",
      }));
    } catch (error) {
      setMessage((prev) => ({ ...prev, [date]: "Failed to update price." }));
    } finally {
      setShowConfirm((prev) => ({ ...prev, [date]: false }));
    }
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper function to get the day of the week for a given date
  const getDayOfWeek = (date: string) => {
    const day = new Date(date).getDay();
    return daysOfWeek[day];
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-y-scroll h-[calc(70vh)]">
      <div className="grid grid-cols-7 gap-4 mb-4">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center font-bold text-gray-700 dark:text-gray-300"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4">
        {prices.map((price) => (
          <div
            key={price.date}
            className="bg-gradient-to-r from-teal-400 to-indigo-500 p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105"
          >
            <p className="text-sm font-medium text-white">{price.date}</p>
            <input
              type="number"
              value={editingPrice[price.date] ?? price.price}
              onChange={(e) =>
                handlePriceChange(price.date, parseFloat(e.target.value))
              }
              className="mt-2 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
            />
            {showConfirm[price.date] && (
              <button
                onClick={() => handleConfirm(price.date)}
                className="mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300"
              >
                Confirm
              </button>
            )}
            {message[price.date] && (
              <p
                className={`mt-2 text-sm ${
                  message[price.date].includes("successfully")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {message[price.date]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
