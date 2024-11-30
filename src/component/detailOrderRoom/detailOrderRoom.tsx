import { useRouter } from "next/navigation";

interface ConfigDetailRoomProps {
  roomId: string;
  detailId: string;
}
export default function DetailRoom(props: ConfigDetailRoomProps) {
  const router = useRouter();

  return (
    <div className="relative w-full md:w-4/5 mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
      <h1 className="text-center">
        DetailOrderRoom {props.roomId}
        DetailId {props.detailId}
      </h1>
      <button
        onClick={() => router.push(`/admin/room/${props.roomId}`)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Back to OrderRoom
      </button>
      <div className="grid gap-3"></div>
    </div>
  );
}
