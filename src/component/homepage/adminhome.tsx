"use client";

export default function AdminHomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-500 to-purple-600 text-gray-900 dark:text-white flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm shadow-md">
        <div className="container mx-auto py-6 px-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white">
            Admin Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4 text-center flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Welcome to the Hotel Management Admin Page
        </h2>
        <p className="text-lg mb-8 text-white max-w-2xl">
          This is the central hub for managing all hotel operations, including
          bookings, customer management, and more.
        </p>
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg animate-bounce"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm shadow-md">
        <div className="container mx-auto py-6 px-4 text-center text-white">
          <p>&copy; 2024 Hotel Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
