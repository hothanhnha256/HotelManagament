"use client";
import { useState } from "react";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { LockIcon, UserIcon, EyeIcon, EyeOffIcon } from "lucide-react";

export default function TrangDangNhap() {
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [hienMatKhau, setHienMatKhau] = useState(false);
    const router = useRouter();
    const [loiDangNhap, setLoiDangNhap] = useState("");

    const xuLyDangNhap = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (tenDangNhap === "admin" && matKhau === "admin") {
                cookies.set("token", "admin", { expires: 1, secure: true });
                router.push("/admin");
            } else {
                setLoiDangNhap("Tên đăng nhập hoặc mật khẩu không đúng");
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            setLoiDangNhap("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-teal-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-[1.4]">
                        Đăng Nhập
                    </h1>
                    <p className="text-gray-500 mt-2">Chào mừng quay trở lại!</p>
                </div>

                <form onSubmit={xuLyDangNhap} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={tenDangNhap}
                            onChange={(e) => setTenDangNhap(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition duration-300"
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={hienMatKhau ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={matKhau}
                            onChange={(e) => setMatKhau(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition duration-300"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setHienMatKhau(!hienMatKhau)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {hienMatKhau ? (
                                <EyeOffIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="ghi-nho"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="ghi-nho" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>

                    {loiDangNhap && <div className="text-red-500 text-sm font-semibold text-center">{loiDangNhap}</div>}

                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Đăng Nhập
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Bạn chưa có tài khoản?{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
