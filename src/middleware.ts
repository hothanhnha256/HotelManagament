import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Lấy token từ cookies
  const tokenuser = req.cookies.get("tokenuser")?.value; // Lấy token từ cookies
  console.log("Middleware executed");
  console.log("Token:", token);
  console.log("Tokenuser:", tokenuser);
  if (!tokenuser && req.nextUrl.pathname.includes("/user")) {
    console.log("Invalid or missing token, redirecting to login");
    return NextResponse.redirect(new URL("/authenticate/user", req.url));
  }
  if (
    (!token || token !== "admin") &&
    req.nextUrl.pathname.includes("/admin")
  ) {
    console.log("Invalid or missing token, redirecting to login");
    return NextResponse.redirect(new URL("/authenticate", req.url));
  }

  console.log("Token valid, proceeding with request");
  // Nếu token hợp lệ, tiếp tục yêu cầu
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/history", "/user/myInfo"],
};
