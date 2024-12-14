"use client";

export default function UserHomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-green-500 to-blue-500 text-gray-900 dark:text-white flex flex-col">
      {/* Tiêu đầu trang */}
      <header className="bg-white/10 backdrop-blur-sm shadow-md">
        <div className="container mx-auto py-6 px-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white">Best Hotel Ever</h1>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-grow container mx-auto py-12 px-4 text-center flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Chào Mừng Đến Hệ thống Best Hotel Ever
        </h2>
        <p className="text-lg mb-8 text-white max-w-2xl">
          Truy cập tất cả thông tin của bạn, quản lý đặt chỗ và khám phá các tính năng được thiết kế riêng cho bạn.
        </p>
        <div className="grid grid-cols-1 gap-8 mt-6">
          <div className="p-6 bg-white/20 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-2 text-white">
              Quản Lý Đặt Chỗ
            </h3>
            <p className="text-sm text-white/80">
              Xem và quản lý các đặt chỗ hiện tại và trước đây một cách dễ dàng.
            </p>
          </div>
        </div>
      </main>

      {/* Chân trang */}
      <footer className="bg-white/10 backdrop-blur-sm shadow-md">
        <div className="container mx-auto py-6 px-4 text-center text-white">
        <p>&copy; 2024 Hotel Management System. All rights reserved.</p>

        </div>
      </footer>
    </div>
  );
}

// "use client";

// export default function UserHomePage() {
//   return (
//     <div className="min-h-screen w-full bg-gradient-to-r from-green-500 to-blue-500 text-gray-900 dark:text-white flex flex-col">
//       {/* Header */}
//       <header className="bg-white/10 backdrop-blur-sm shadow-md">
//         <div className="container mx-auto py-6 px-4 flex justify-between items-center">
//           <h1 className="text-4xl font-extrabold text-white">User Dashboard</h1>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow container mx-auto py-12 px-4 text-center flex flex-col items-center justify-center">
//         <h2 className="text-3xl font-bold mb-4 text-white">
//           Welcome to Your User Page
//         </h2>
//         <p className="text-lg mb-8 text-white max-w-2xl">
//           Access all your information, manage bookings, and explore our features
//           designed just for you.
//         </p>
//         <div className="grid grid-cols-1 gap-8 mt-6">
//           <div className="p-6 bg-white/20 rounded-lg shadow-lg">
//             <h3 className="text-2xl font-semibold mb-2 text-white">
//               Manage Bookings
//             </h3>
//             <p className="text-sm text-white/80">
//               View and manage your current and past bookings seamlessly.
//             </p>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white/10 backdrop-blur-sm shadow-md">
//         <div className="container mx-auto py-6 px-4 text-center text-white">
//         </div>
//       </footer>
//     </div>
//   );
// }
