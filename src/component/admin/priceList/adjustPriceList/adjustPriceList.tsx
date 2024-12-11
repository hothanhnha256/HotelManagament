import { useState } from "react";
import type { AdjustPriceListDetail } from "./adjustPriceListInterface";

interface AdjustPriceListProps {
  setIsAdjust: (isAdjust: boolean) => void;
  fetchDataPriceList: () => void;
}

export default function AdjustPriceList({
  setIsAdjust,
  fetchDataPriceList,
}: AdjustPriceListProps) {
  const [newPriceList, setNewPriceList] = useState<AdjustPriceListDetail>({
    type: "",
    price: 0,
    dateStart: new Date().toISOString().split("T")[0],
    dateEnd: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPriceList((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const dateStart = new Date(newPriceList.dateStart);
    const dateEnd = new Date(newPriceList.dateEnd);

    // Validation
    if (dateStart > dateEnd) {
      setError("Start date cannot be later than end date.");
      return;
    }
    if (newPriceList.price < 0) {
      setError("Price cannot be negative.");
      return;
    }
    if (newPriceList.type !== "VIP" && newPriceList.type !== "Normal") {
      setError("Room type must be either VIP or Normal.");
      return;
    }

    // Simulate creating a new PriceList
    setTimeout(() => {
      // Add the new PriceList to the fake data (in a real app, you would send a request to the server)
      fetchDataPriceList(); // Refetch the data after creating a new PriceList
      setIsAdjust(false); // Close the Adjust PriceList form
    }, 500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Adjust Room Price
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Room Type
            </label>
            <select
              name="type"
              value={newPriceList.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            >
              <option value="">Select Room Type</option>
              <option value="VIP">VIP</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={newPriceList.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              name="dateStart"
              value={newPriceList.dateStart}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              name="dateEnd"
              value={newPriceList.dateEnd}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsAdjust(false)}
              className="mr-4 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
