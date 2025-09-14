import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleLogout() {
    localStorage.clear();
    router.push("/login");
  }

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center relative">
      {/* Logo */}
      <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
        🚀 Notes SaaS
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="hover:text-indigo-600">
          Dashboard
        </Link>
        <Link href="/notes" className="hover:text-indigo-600">
          Notes
        </Link>
        <Link href="/settings" className="hover:text-indigo-600">
          Settings
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-9 h-9 rounded-full border border-gray-300"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-20">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold text-gray-700">
                  John Doe
                </p>
                <p className="text-xs text-gray-500">test1@example.com</p>
              </div>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                onClick={() => setDropdownOpen(false)}
              >
                ⚙️ Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
