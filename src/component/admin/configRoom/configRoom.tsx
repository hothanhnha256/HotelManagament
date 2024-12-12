import { useRouter } from "next/navigation";
import Facilities from "./facilitiesOfRoom/facilities";
import AmenitiesOfRoom from "./amenitiesOfRoom/amenitiesRoom";
import Record from "../orderRoomManagement/recordOfRoom/record";
import GoodOfRoom from "./goodOfRoom/goodRoom";
import PriceOfRoom from "./priceOfRoom/priceOfRoom";
interface ConfigRoomProps {
  id: string;
}
export default function ConfigRoom(props: ConfigRoomProps) {
  const router = useRouter();
  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-center">Cấu hình phòng {props.id}</h1>
      <button
        onClick={() => router.push("/admin/room")}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Về danh sách phòng
      </button>
      <PriceOfRoom idRoom={props.id} />
      <Facilities idRoom={props.id} />
      <AmenitiesOfRoom idRoom={props.id} />
      {/* <Record idRoom={props.id} /> */}
      <GoodOfRoom idRoom={props.id} />
      <div className="grid gap-3"></div>
    </div>
  );
}
