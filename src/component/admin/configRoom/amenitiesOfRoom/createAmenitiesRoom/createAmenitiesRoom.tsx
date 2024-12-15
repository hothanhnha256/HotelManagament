import { useState } from "react";
import type { CreateAmenitiesRoomDetail } from "./createAmenitiesRoomInterface";
import AmenitiesRoom from "@/component/admin/amenities/amenitiesRoom/amenitiesRoom";
interface CreateAmenitiesRoomProps {
  setIsCreate: (isCreate: boolean) => void;
  fetchDataAmenitiesRoom: () => void;
  roomID: string;
}

export default function CreateAmenitiesRoom({
  setIsCreate,
  fetchDataAmenitiesRoom,
  roomID,
}: CreateAmenitiesRoomProps) {
  const [newAmenitiesRoom, setNewAmenitiesRoom] =
    useState<CreateAmenitiesRoomDetail>({
      ten: "",
      moTa: "",
    });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAmenitiesRoom((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (!newAmenitiesRoom.ten) {
      setError("Tên không được để trống.");
      return false;
    }
    setError(null);
    return true;
  };

  const APIURL = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    // Prepare form data in x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append("ten", newAmenitiesRoom.ten);
    formData.append("moTa", newAmenitiesRoom.moTa);

    try {
      const response = await fetch(`${APIURL}/amenities/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      //console.log("Create new AmenitiesRoom: ", result);
      fetchDataAmenitiesRoom();
      setIsCreate(false); // Close the form after successful creation
    } catch (error) {
      //console.log("Failed to create AmenitiesRoom ", error);
      setError("Failed to create AmenitiesRoom. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full overflow-auto max-h-[95vh] max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Thêm tiện nghi mới
          </h2>
          <button
            onClick={() => {
              fetchDataAmenitiesRoom();
              setIsCreate(false);
            }}
            className="ml-4 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white font-semibold py-1 px-2 border border-gray-300 dark:border-gray-600 rounded"
          >
            X
          </button>
        </div>
        <AmenitiesRoom roomID={roomID} />
      </div>
    </div>
  );
}
