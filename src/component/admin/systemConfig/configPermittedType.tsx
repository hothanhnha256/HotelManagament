"use client";
import { useState, useEffect } from "react";
import { configProps } from "./interface/configProps";
import { formatDate } from "./allPermittedType";
import { fileType } from "./enums";
import Notification from "../../ui/notification";

export interface datafetch {
  defaultNoPages: number;
  permittedFileTypes: configProps[];
  quarter: string;
  year: string;
  updatedAt: string;
}

export interface configParams {
  id: string;
  onClose: () => void;
}

export default function ConfigPermittedType(props: configParams) {
  const [data, setData] = useState<datafetch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFileType, setShowAddFileType] = useState(false);
  const [defaultNoPages, setDefaultNoPages] = useState<number | null>(null);
  const [availableFileTypes, setAvailableFileTypes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_URL;
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/system-config/${props.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data.data);
      console.log(data.data);
      setDefaultNoPages(data.data.defaultNoPages);
      setIsLoading(false);

      const existingFileTypes = data.data.permittedFileTypes.map(
        (item: configProps) => item.fileType
      );
      const availableFileTypes = Object.keys(fileType).filter(
        (key) => !existingFileTypes.includes(key)
      );
      setAvailableFileTypes(availableFileTypes);
    } catch (error) {
      setError("Failed to load data. Please try again.");
      console.error(error);
    }
  };

  const addFileType = async (fileType: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/system-config/${props.id}/file-type`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fileType }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSuccessMessage("File type added successfully.");
      fetchData();
      setShowAddFileType(false);
    } catch (error) {
      setError("Error adding file type.");
      console.error(error);
    }
  };

  const deleteFileType = async (fileType: string) => {
    fileType = fileType.replace("/", "%2F");
    try {
      const response = await fetch(
        `${apiUrl}/system-config/${props.id}/file-type/${fileType}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSuccessMessage("File type deleted successfully.");
      fetchData();
    } catch (error) {
      setError("Error deleting file type.");
      console.error(error);
    }
  };

  const handleDefaultNoPagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDefaultNoPages(Number(e.target.value));
  };

  const saveDefaultNoPages = async () => {
    try {
      const response = await fetch(`${apiUrl}/system-config/${props.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ defaultNoPages: defaultNoPages }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSuccessMessage("Default page number saved successfully.");
      fetchData();
    } catch (error) {
      setError("Failed to save default page number.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-2xl mx-4 p-8 rounded-lg shadow-lg relative">
        <button
          onClick={props.onClose}
          className="bg-red-500 absolute right-0 top-0 text-white font-bold py-1 px-4 rounded hover:text-red-500 hover:bg-white hover:border-red-500 border border-red-500 transition-all duration-300 ease-in-out hover:scale-105 transform"
        >
          Đóng
        </button>

        {/* Notifications */}
        {error && (
          <Notification
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}
        {successMessage && (
          <Notification
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage(null)}
          />
        )}

        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          </div>
        ) : (
          <div className="w-full h-80 overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Năm {data?.year} Học kỳ: {data?.quarter}
              </h2>
            </div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold">
                Danh sách loại file được phép
              </h2>
              <div className="relative inline-block">
                <button
                  onClick={() => setShowAddFileType(!showAddFileType)}
                  className="text-blue-500 font-bold border border-blue-500 px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out"
                >
                  Thêm
                </button>
                <div
                  className={`absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                    showAddFileType
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  <ul className="py-1">
                    {availableFileTypes.map((type) => (
                      <li key={type} className="px-4 py-2 hover:bg-gray-100">
                        <button
                          onClick={() => addFileType(type)}
                          className="text-blue-500 font-bold w-full text-left"
                        >
                          {fileType[type as keyof typeof fileType]}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* File types table */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IdConfig
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại file
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xóa
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.permittedFileTypes.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.configId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fileType[item.fileType as keyof typeof fileType]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button
                        onClick={() => deleteFileType(item.fileType)}
                        className="text-red-500 font-bold hover:text-red-700 transition-all duration-300"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Default pages */}
            <div className="mt-6 flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số trang mặc định
                </label>
                <input
                  type="number"
                  value={defaultNoPages ?? ""}
                  onChange={handleDefaultNoPagesChange}
                  className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </div>
              <button
                onClick={saveDefaultNoPages}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-300"
              >
                Lưu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
