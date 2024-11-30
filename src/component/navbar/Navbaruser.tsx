"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function UserSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-900 transition-colors duration-300"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <div
        className={`h-screen fixed top-0 left-0 w-64 bg-white dark:bg-gray-900 z-50 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <nav className="h-full px-4 py-6 text-black dark:text-white border-r border-gray-200 dark:border-gray-700">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              User Panel
            </h1>
          </div>
          <ul className="space-y-4 text-lg font-semibold">
            <li
              className={`hover:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 transition-all duration-150 ease-in-out ${
                pathname === "/admin/homepage"
                  ? "bg-gray-300 text-black dark:bg-gray-800 dark:text-white"
                  : ""
              } flex items-center`}
            >
              <Link href="/admin/homepage" legacyBehavior>
                <a className="w-full">Trang chủ</a>
              </Link>
            </li>
            <li
              className={`hover:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 transition-all duration-150 ease-in-out ${
                pathname === "/room"
                  ? "bg-gray-300 text-black dark:bg-gray-800 dark:text-white"
                  : ""
              } flex items-center`}
            >
              <Link href="/room" legacyBehavior>
                <a className="w-full">Đặt phòng</a>
              </Link>
            </li>
            <li
              className={`hover:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 transition-all duration-150 ease-in-out ${
                pathname === "/facilities"
                  ? "bg-gray-300 text-black dark:bg-gray-800 dark:text-white"
                  : ""
              } flex items-center`}
            >
              <Link href="/facilities" legacyBehavior>
                <a className="w-full">Lịch sử đặt phòng</a>
              </Link>
            </li>
            <li
              className={`hover:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 transition-all duration-150 ease-in-out ${
                pathname === "/orderRoom"
                  ? "bg-gray-300 text-black dark:bg-gray-800 dark:text-white"
                  : ""
              } flex items-center`}
            >
              <Link href="/orderRoom" legacyBehavior>
                <a className="w-full">Thông tin của tôi</a>
              </Link>
            </li>
            <li
              className={`hover:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 transition-all duration-150 ease-in-out 
              flex items-center
              ${isDarkMode}
              `}
            >
              <button className="" onClick={handleLogout}>
                Đăng xuất
              </button>
            </li>
            <li
              className={`hover:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 transition-all duration-150 ease-in-out 
              flex items-center
              ${isDarkMode}
              `}
            >
              <button className="" onClick={toggleDarkMode}>
                {isDarkMode ? "☀️" : "🌙"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
