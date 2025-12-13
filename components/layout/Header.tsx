"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { ShoppingBag, User, LogOut, Menu, X } from "react-feather";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Don't show header on auth pages or onboarding
  if (
    pathname?.includes("/sign-in") ||
    pathname?.includes("/sign-up") ||
    pathname?.includes("/onboarding")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            <span className="text-lg sm:text-xl font-bold text-white">
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
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname === "/about" ? "text-blue-400" : "text-gray-300"
              }`}
            >
              About Us
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
                <Link
                  href="/community"
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    pathname?.includes("/community")
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                >
                  Community
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}

          {/* Auth Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 rounded-lg bg-gray-800 px-3 sm:px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
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
                  className="rounded-lg bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900 py-3">
            <nav className="flex flex-col space-y-3 px-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-blue-400 py-2 ${
                  pathname === "/" ? "text-blue-400" : "text-gray-300"
                }`}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-blue-400 py-2 ${
                  pathname === "/dashboard" ? "text-blue-400" : "text-gray-300"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-blue-400 py-2 ${
                  pathname?.includes("/templates")
                    ? "text-blue-400"
                    : "text-gray-300"
                }`}
              >
                Templates
              </Link>
              <Link
                href="/community"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-blue-400 py-2 ${
                  pathname?.includes("/community")
                    ? "text-blue-400"
                    : "text-gray-300"
                }`}
              >
                Community
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-blue-400 py-2 ${
                  pathname === "/about" ? "text-blue-400" : "text-gray-300"
                }`}
              >
                About Us
              </Link>
              <div className="pt-3 border-t border-gray-800">
                <div className="flex items-center space-x-2 text-sm text-gray-300 mb-3">
                  <User className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
