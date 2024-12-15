"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { log } from "node:console";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [cusName, setCusName] = useState("");
  const [cusSex, setCusSex] = useState("");
  const [cusDOB, setCusDOB] = useState("");
  const [cusPhoneNumber, setCusPhoneNumber] = useState("");
  const [cusCitizenId, setCusCitizenId] = useState("");
  const [cusEmail, setCusEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [OPT, setOPT] = useState("");
  const [isVerify, setIsVerify] = useState(false);
  const [otpNotify, setOTPNotify] = useState("");
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestBody = new URLSearchParams();
    requestBody.append("phoneNumber", cusPhoneNumber);
    try {
      const res = await fetch(`${API_URL}/auth/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
      });
      const data = await res.json();
      //console.log(data);
      if (data.status === "failed") {
        setError(data.message);
      } else {
        setError("");
        setOTPNotify(data.message);
        setIsVerify(true);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log(cusPhoneNumber, OPT);
    try {
      const res = await fetch(`${API_URL}/auth/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          phoneNumber: cusPhoneNumber,
          otp: OPT,
        }),
      });
      const data = await res.json();
      //console.log(data);
      if (data.status === "failed") {
        setError(data.message);
      } else {
        setError("");

        Cookies.set("tokenuser", data.token);
        router.push("/");
      }
    } catch (error) {
      setError("Sign in failed");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log(cusName, cusSex, cusDOB, cusPhoneNumber, cusCitizenId, cusEmail);
    try {
      const res = await fetch(`${API_URL}/auth/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          cusName: cusName,
          cusSex: cusSex,
          cusDOB: cusDOB,
          cusPhoneNumber: cusPhoneNumber,
          cusCitizenId: cusCitizenId,
          cusEmail: cusEmail,
        }),
      });
      //console.log(res);
      const data = await res.json();
      //console.log(data);
      if (data.status === "failed") {
        //console.log(data.message);
        setError(data.message);
      } else {
        setError("");
        setSuccess("Sign up successful, please sign in");
      }
    } catch (error) {
      setError("Sign up failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white w-screen">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold rounded-l-lg ${
              isSignIn
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setIsSignIn(true)}
          >
            Đăng nhập
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-r-lg ${
              !isSignIn
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setIsSignIn(false)}
          >
            Đăng ký
          </button>
        </div>
        {isSignIn ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
              Đăng nhập
            </h1>
            <div>
              <label
                htmlFor="cusPhoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                id="cusPhoneNumber"
                value={cusPhoneNumber}
                onChange={(e) => setCusPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 text-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm font-semibold">{error}</div>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                Lấy mã OTP
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-6">
            <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
              Đăng ký
            </h1>
            <div>
              <label
                htmlFor="cusName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Họ tên
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                id="cusName"
                value={cusName}
                onChange={(e) => setCusName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 text-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cusSex"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Giới tính
                <span className="text-red-500"> *</span>
                <select
                  id="cusSex"
                  value={cusSex}
                  onChange={(e) => setCusSex(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 text-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  required
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </label>
            </div>
            <div>
              <label
                htmlFor="cusDOB"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Ngày sinh
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="date"
                id="cusDOB"
                value={cusDOB}
                onChange={(e) => setCusDOB(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white text-gray-700 dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cusPhoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Số điện thoại
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                id="cusPhoneNumber"
                value={cusPhoneNumber}
                onChange={(e) => setCusPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 text-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cusCitizenId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Số CCCD
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                id="cusCitizenId"
                value={cusCitizenId}
                onChange={(e) => setCusCitizenId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 text-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cusEmail"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Địa chỉ Email
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="email"
                id="cusEmail"
                value={cusEmail}
                onChange={(e) => setCusEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 text-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm font-semibold">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm font-semibold">
                {success}
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                Đăng ký
              </button>
            </div>
          </form>
        )}
        {isVerify && (
          <div
            className="
            fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center

          "
          >
            <div
              className="
                bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative
                "
            >
              <button
                onClick={() => setIsVerify(false)}
                className="absolute top-4 right-4 text-white bg-red-500 p-2 rounded-full"
              >
                X
              </button>
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
                  Xác thực OTP
                </h1>
                {otpNotify ? (
                  <div className="mt-2 text-gray-600 text-sm">{otpNotify}</div>
                ) : (
                  ""
                )}
                <div>
                  <label
                    htmlFor="OPT"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    OTP của bạn
                  </label>
                  <input
                    type="text"
                    id="OPT"
                    value={OPT}
                    onChange={(e) => setOPT(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 text-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                    required
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm font-semibold">
                    {error}
                  </div>
                )}
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    Xác thực
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
