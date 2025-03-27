import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, memo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

// Memoize the navigation links to prevent unnecessary re-renders
const NavLink = memo(({ href, label, isActive, comingSoon }) => (
  <Link
    href={href}
    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 group ${
      isActive
        ? "text-violet-600 dark:text-violet-400"
        : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    <span className="flex items-center">
      {label}
      {comingSoon && (
        <span className="ml-2 px-2 py-0.5 text-xs bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 rounded-full" aria-label="Coming Soon">
          Coming Soon
        </span>
      )}
    </span>
    {isActive && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 dark:bg-violet-400 transform origin-left transition-transform duration-200" aria-hidden="true"></span>
    )}
  </Link>
));

NavLink.displayName = 'NavLink';

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/problems", label: "Problems" },
  { href: "/discuss", label: "Discuss", comingSoon: true },
  { href: "/blog", label: "Blog", comingSoon: true },
  { href: "/contest", label: "Contest", comingSoon: true }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef(null);
  const menuButtonRef = useRef(null);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  // Improved click outside handling with keyboard support
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm text-gray-300" role="banner">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity" aria-label="DailyDSA Home">
              DailyDSA
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                isActive={isActive(link.href)}
              />
            ))}

            {/* Auth Buttons */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  <span>{user.name}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 transform opacity-100 scale-100 transition-all duration-200"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      onClick={() => setIsProfileOpen(false)}
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      role="menuitem"
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
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/login')
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-violet-600 text-white hover:bg-violet-700 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
                  aria-hidden="true"
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
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/10"
                    : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
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
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
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
