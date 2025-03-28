"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu } from "lucide-react";

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      !e.target.closest("button")
    ) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle(
          "backdrop-blur-md",
          window.scrollY > 10
        );
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="bg-white/70 backdrop-blur-md shadow-md py-4 px-6 sticky top-0 z-50 transition duration-300"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-extrabold text-black">
          <Link href="/">WANAC</Link>
        </div>

        {/* Desktop Menu */}
        <div
          className="hidden md:flex space-x-6 items-center relative"
          ref={dropdownRef}
        >
          <div className="relative">
            <button
              onClick={() => toggleDropdown("help")}
              className="flex items-center text-black font-medium hover:text-orange-500"
            >
              How We Help <ChevronDown className="ml-1 w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => toggleDropdown("action")}
              className="flex items-center text-black font-medium hover:text-orange-500"
            >
              Take Action <ChevronDown className="ml-1 w-4 h-4" />
            </button>
          </div>

          <Link
            href="#resources"
            className="text-black font-medium hover:text-orange-500"
          >
            Resources
          </Link>
          <Link
            href="#about"
            className="text-black font-medium hover:text-orange-500"
          >
            About
          </Link>
          <Link
            href="/login"
            className="text-black font-medium hover:text-orange-500"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      {/* Full-width Dropdowns */}
      {activeDropdown === "help" && (
        <div className="absolute left-0 top-full w-screen bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-md z-40 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
            <Link href="#how-we-help" className="text-sm hover:text-orange-500">
              Our Approach
            </Link>
            <Link href="#how-we-help" className="text-sm hover:text-orange-500">
              Phase 1: Transition
            </Link>
            <Link href="#how-we-help" className="text-sm hover:text-orange-500">
              Phase 2: Performance
            </Link>
            <Link href="#how-we-help" className="text-sm hover:text-orange-500">
              Phase 3: Academy
            </Link>
          </div>
        </div>
      )}

      {activeDropdown === "action" && (
        <div className="absolute left-0 top-full w-screen bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-md z-40 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-black">
            <Link href="#take-action" className="text-sm hover:text-orange-500">
              Volunteer
            </Link>
            <Link href="#take-action" className="text-sm hover:text-orange-500">
              Corporate Partners
            </Link>
            <Link href="#take-action" className="text-sm hover:text-orange-500">
              Leadership Giving
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 px-4 space-y-4 bg-white/90 backdrop-blur-md border-t py-4">
          <Link
            href="#how-we-help"
            className="block text-black font-medium hover:text-orange-500"
          >
            How We Help
          </Link>
          <Link
            href="#take-action"
            className="block text-black font-medium hover:text-orange-500"
          >
            Take Action
          </Link>
          <Link
            href="#resources"
            className="block text-black font-medium hover:text-orange-500"
          >
            Resources
          </Link>
          <Link
            href="#about"
            className="block text-black font-medium hover:text-orange-500"
          >
            About
          </Link>
          <Link
            href="/login"
            className="block text-black font-medium hover:text-orange-500"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
