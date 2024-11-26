import DetailOfRoom from "./detailOfRoom/detailOfRoom";
import OrderOfRoom from "./orderOfRoom/orderOfRoom";
import DeviceOfRoom from "./deviceOfRoom/deviceOfRoom";
import { useRouter } from "next/navigation";

interface ConfigRoomProps {
  id: string;
}
export default function ConfigRoom(props: ConfigRoomProps) {
  const router = useRouter();

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-center">Config Room {props.id}</h1>
      <button
        onClick={() => router.push("/room")}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Back to Room List
      </button>
      <div className="grid gap-3">
        <DetailOfRoom id={props.id} />
        <DetailOfRoom id={props.id} />
        <OrderOfRoom id={props.id} />
      </div>
    </div>
  );
}
