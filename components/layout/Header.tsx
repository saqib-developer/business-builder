"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { ShoppingBag, User, LogOut } from "react-feather";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Don't show header on auth pages
  if (pathname?.includes("/sign-in") || pathname?.includes("/sign-up")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">
              Business Builder
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname === "/" ? "text-blue-400" : "text-gray-300"
              }`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    pathname === "/dashboard"
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/templates"
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    pathname?.includes("/templates")
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                >
                  Templates
                </Link>
              </>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <nav className="flex md:hidden items-center space-x-6 pb-3 pt-2 border-t border-gray-800">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname === "/dashboard" ? "text-blue-400" : "text-gray-300"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/templates"
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname?.includes("/templates")
                  ? "text-blue-400"
                  : "text-gray-300"
              }`}
            >
              Templates
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
