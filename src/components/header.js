import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef(null);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/problems", label: "Problems" },
    { href: "/discuss", label: "Discuss", comingSoon: true },
    { href: "/contest", label: "Contest", comingSoon: true },
    { href: "/blog", label: "Blog", comingSoon: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              DailyDSA
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 group ${
                  isActive(link.href)
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
                }`}
              >
                <span className="flex items-center">
                  {link.label}
                  {link.comingSoon && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </span>
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 dark:bg-violet-400 transform origin-left transition-transform duration-200"></span>
                )}
              </Link>
            ))}

            {/* Auth Buttons */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <span>{user.name}</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/login')
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-violet-600 text-white hover:bg-violet-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
              >
                <span className="flex items-center">
                  {link.label}
                  {link.comingSoon && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </span>
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
