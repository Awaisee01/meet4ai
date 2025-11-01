
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/lib/useUser";
import Image from "next/image";

export default function Header() {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`bg-white/80 backdrop-blur-md border-b border-purple-100 transition-all duration-300
        relative sm:fixed sm:top-0 sm:left-0 sm:right-0
        ${scrolled ? "sm:m-5 sm:rounded-xl" : "sm:m-0 sm:rounded-none"}`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">  
            <Image height={50} width={50} src="/logo.png" className="rounded-full w-[60px]" alt="" />
          
          <span className="text-xl font-bold text-purple-900">Meet 4.ai</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/meeting"
            className="px-6 py-2 bg-purple-800 text-white rounded-lg hidden sm:inline"
          >
            Launch App
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center hover:ring-2 hover:ring-purple-400 transition"
              >
                {user.image ? (
                  <Image width={100} height={100} alt="cover" src={user.image} className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0]
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 right-0 mt-2 w-48 sm:w-40 bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden z-50">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-purple-50">
                    Profile
                  </Link>
                  <Link href="/dashboard" className="block px-4 py-2 hover:bg-purple-50">
                    Dashboard
                  </Link>
                  <Link href="/meeting" className="block px-4 py-2 hover:bg-purple-50 sm:hidden">
                    Launch App
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 border border-purple-600 text-purple-700 rounded-lg hidden sm:inline"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
