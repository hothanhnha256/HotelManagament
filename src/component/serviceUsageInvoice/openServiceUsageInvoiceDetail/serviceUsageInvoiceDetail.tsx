import React, { useEffect, useState } from "react";

export interface ServiceUsageInvoiceProps {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  total: number;
  status: string;
}

export interface ServiceUsageInvoiceInterface {
  id: string;
  onClose: () => void;
}
const fakeDataOrders: ServiceUsageInvoiceProps = {
  id: "1",
  date: "2021-09-01",
  customerName: "John Doe",
  customerPhone: "1234567890",
  customerEmail: "hotahnhnha@gmaik",
  customerAddress: "123 Main St",
  total: 100,
  status: "Pending",
};
export default function ServiceUsageInvoiceDetail(
  props: ServiceUsageInvoiceInterface
) {
  const [order, setOrder] = useState<ServiceUsageInvoiceProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchOrder = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setOrder(fakeDataOrders);
      setIsLoading(false);
    }, 50);
  };
  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            OServiceUsageInvoices
          </h2>
          <button
            className="ml-4 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white font-semibold py-1 px-2 border border-gray-300 dark:border-gray-600 rounded"
            onClick={props.onClose}
          >
            X
          </button>
        </div>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : order ? (
          <div className="text-black dark:text-white">
            <p>
              <strong>ID:</strong> {order.id}
            </p>
            <p>
              <strong>Date:</strong> {order.date}
            </p>
            <p>
              <strong>Customer Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Customer Phone:</strong> {order.customerPhone}
            </p>
            <p>
              <strong>Customer Email:</strong> {order.customerEmail}
            </p>
            <p>
              <strong>Customer Address:</strong> {order.customerAddress}
            </p>
            <p>
              <strong>Total:</strong> ${order.total.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </div>
        ) : (
          <div>No oServiceUsageInvoices available</div>
        )}
      </div>
    </div>
  );
}
