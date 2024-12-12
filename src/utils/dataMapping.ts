const roomStatus: Record<string, string> = {
    empty: "Trống",
    "in use": "Đang sử dụng",
    maintenance: "Đang bảo trì",
};

const roomType: Record<string, string> = {
    normal: "Phòng thường",
    vip: "Phòng VIP",
};

const facilityStatus: Record<string, string> = {
    broken: "Đã hỏng",
    good: "Tốt",
    maintenance: "Đang bảo trì",
};

const sexs: Record<string, string> = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
};

const empRoles: Record<string, string> = {
    "Room Employee": "Nhân viên phòng",
    "House Keeper": "Nhân viên dọn phòng",
    Receptionist: "Lễ tân",
    Manager: "Quản lý",
    Other: "Khác",
};
const serviceNames: Record<string, string> = {
    laundry: "Dịch vụ giặt ủi",
    transport: "Dịch vụ đưa đón",
    food: "Dịch vụ ăn uống",
    meetingRoom: "Dịch vụ cho thuê phòng họp",
};

const orderStatus: Record<string, string> = {
    confirmed: "Đã xác nhận",
    "not confirmed": "Chưa xác nhận",
    cancelled: "Đã hủy",
};
function roomStatusMapping(status: string): string {
    return roomStatus[status] || "";
}

function roomTypeMapping(type: string): string {
    return roomType[type] || "";
}

function facilityStatusMapping(status: string): string {
    return facilityStatus[status] || "";
}

function sexMapping(type: string): string {
    const sex = type.toLowerCase();
    return sexs[sex] || "";
}

function roleMapping(type: string): string {
    return empRoles[type] || "";
}

function serviceNameMapping(service: string): string {
    return serviceNames[service] || "";
}

function orderStatusMapping(status: string): string {
    return orderStatus[status] || "";
}

export { roomStatusMapping, roomTypeMapping, facilityStatusMapping, sexMapping, roleMapping, serviceNameMapping, orderStatusMapping };
