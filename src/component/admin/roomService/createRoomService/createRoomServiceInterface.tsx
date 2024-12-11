export interface CreateRoomServiceDetail {
  type: RoomServiceType;
  serviceId: string;
  price: string;
  description: string;
  vehicleType?: string;
  washingOption?: string;
  roomCapacity?: string;
}
export enum RoomServiceType {
  laundry = "laundry",
  meetingroom = "meeting room",
  food = "food",
  transport = "transport",
}
export enum RoomServiceID {
  laundry = "GU",
  "meeting room" = "PH",
  food = "AU",
  transport = "DD",
}
