import RoomManagement from "@/component/roomManagement/roomManagement";
export default function Home() {
  return (
    <div
      className="m-20 w-screen  bg-white shadow-md border 
    border-gray-200 rounded-lg p-5
    "
    >
      <h1 className="text-3xl font-bold text-center">Quản lý phòng</h1>
      <RoomManagement />
    </div>
  );
}
