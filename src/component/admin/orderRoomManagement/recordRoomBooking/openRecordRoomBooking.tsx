import { DataBookingRoom } from "../orderRoomManagement";
import { format } from "date-fns";
import BookingRoomService from "./bookingRoomService/bookingRoomService";
import { BookingRoomServiceInterface } from "./bookingRoomService/bookingRoomService";
import OpenSeeReport from "./seeReport/openSeeReport";
import { useState } from "react";
import DeviceUseInRooms from "./deviceRoom/deviceRooms";
export interface DataBookingRoomProps {
  onClose: () => void;
  dataBookingRoom: DataBookingRoom[] | null;
}
export default function OpenRecordRoomBooking(props: DataBookingRoomProps) {
  const [open, setOpen] = useState<{
    createdAt: string;
    roomId: string;
  }>({ createdAt: "", roomId: "" });
  const [isCreateReport, setIsCreateReport] = useState(false);
  const [isBookingRoomService, setIsBookingRoomService] = useState(false);
  const [isSeeReport, setIsSeeReport] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 ">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full h-5/6">
        <div className="absolute top-0 right-0">
          <button
            onClick={props.onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Đóng
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">Bản báo cáo phòng</h2>
        <div className="space-y-4 overflow-y-scroll h-5/6">
          {props.dataBookingRoom?.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 rounded flex justify-between"
            >
              <div>
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
              </div>
              <div className="grid grid-cols-3 gap-2 place-content-center ">
                <button
                  className="
                  px-4 py-2 bg-blue-500 text-white rounded mr-4
                "
                  onClick={() => {
                    setIsCreateReport(true);
                    setOpen({
                      createdAt: item.ThoiGianTaoBanGhiPhong,
                      roomId: item.MaPhong,
                    });
                  }}
                >
                  Tạo báo cáo
                </button>

                <button
                  className="
                  px-4 py-2 bg-green-500 text-white rounded mr-4"
                  onClick={() => {
                    setOpen({
                      createdAt: item.ThoiGianTaoBanGhiPhong,
                      roomId: item.MaPhong,
                    });
                    setIsBookingRoomService(true);
                  }}
                >
                  Xem đơn đặt dịch vụ
                </button>
                <button
                  className="
                  px-4 py-2 bg-yellow-500 text-white rounded mr-4"
                  onClick={() => {
                    setOpen({
                      createdAt: item.ThoiGianTaoBanGhiPhong,
                      roomId: item.MaPhong,
                    });
                    setIsSeeReport(true);
                  }}
                >
                  Xem báo cáo
                </button>
              </div>
            </div>
          ))}
          {isBookingRoomService && (
            <BookingRoomService
              onClose={() => setIsBookingRoomService(false)}
              createdAt={open.createdAt}
              roomId={open.roomId}
            />
          )}
          {isCreateReport && (
            <DeviceUseInRooms
              onClose={() => setIsCreateReport(false)}
              createdAt={open.createdAt}
              roomId={open.roomId}
            />
          )}
          {isSeeReport && (
            <OpenSeeReport
              onClose={() => setIsSeeReport(false)}
              createdAt={open.createdAt}
              roomId={open.roomId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
