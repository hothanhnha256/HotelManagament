import { DataBookingRoom } from "../orderRoomManagement";
import { format } from "date-fns";

export interface DataBookingRoomProps {
  onClose: () => void;
  dataBookingRoom: DataBookingRoom[] | null;
}

export default function OpenRecordRoomBooking(props: DataBookingRoomProps) {
  console.log(props.dataBookingRoom);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Bản báo cáo phòng</h2>
        <div className="space-y-4">
          {props.dataBookingRoom?.map((item, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded">
              <p>
                <strong>ID Báo Cáo:</strong> {item.IDBanBaoCao}
              </p>
              <p>
                <strong>Mã Đặt Phòng:</strong> {item.MaDatPhong}
              </p>
              <p>
                <strong>Mã Phòng:</strong> {item.MaPhong}
              </p>
              <p>
                <strong>Giá Tiền:</strong> {item.GiaTien}
              </p>
              <p>
                <strong>Thời Gian Tạo:</strong>{" "}
                {format(
                  new Date(item.ThoiGianTaoBanGhiPhong),
                  "dd/MM/yyyy HH:mm:ss"
                )}
              </p>
              <div className="flex place-content-center">
                <button
                  className="
                  px-4 py-2 bg-blue-500 text-white rounded mr-4
                "
                >
                  Tạo báo cáo
                </button>

                <button
                  className="
                  px-4 py-2 bg-blue-500 text-white rounded mr-4"
                >
                  Xem đơn đặt dịch vụ
                </button>
                <button
                  className="
                  px-4 py-2 bg-blue-500 text-white rounded mr-4"
                >
                  Xem báo cáo
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={props.onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
