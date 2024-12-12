import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Lấy token từ cookies

  console.log("Middleware executed");
  console.log("Token:", token);

  // Kiểm tra xem token có hợp lệ hay không
  if (!token || token !== "admin") {
    console.log("Invalid or missing token, redirecting to login");
    // Nếu không có token hoặc token không đúng, trả về lỗi 401
    return NextResponse.redirect(new URL("/authenticate", req.url)); // Redirect người dùng đến trang login
  }

  console.log("Token valid, proceeding with request");
  // Nếu token hợp lệ, tiếp tục yêu cầu
  return NextResponse.next();
}

// Chỉ áp dụng middleware cho tất cả các route dưới /admin
export const config = {
  matcher: ["/admin/:path*"],
};
