"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Navbar({ hideNavbar = false }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  const [language, setLanguage] = useState("English");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const languageOptions = ["English", "Spanish", "French", "German"];
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const langDropdownRef = useRef(null);

  // List of paths where the navbar should be hidden
  const navbarExcludedPaths = [
    '/dashboard',
    '/login',
    '/signup',
    '/signin',
    '/register',
    '/client',
    '/coach',
    '/admin',
    '/appointments',
    '/messages',
    '/community',
    '/journal',
    '/aichatbot',
    '/lifescore',
    '/resources',
    '/settings',
    '/mycoach',
    '/library',
    '/pages/coach',
  ];
  
  // Check if current path starts with any of the excluded paths
  const shouldHideNavbar = 
    hideNavbar || 
    navbarExcludedPaths.some(path => pathname?.startsWith(path));
  
  // If the navbar should be hidden, don't render it
  if (shouldHideNavbar) return null;

  const navigation = {
    are: {
      title: "WHO WE ARE",
      items: [
        { label: "Our Story", href: "/pages/ourstory" },
        { label: "Core Pillars", href: "/pages/ourstory#corepillars" },
        { label: "Strategic Aspirations", href: "/pages/ourstory#strategicaspirations" },
        //{ label: "Board of Directors", href: "/pages/ourstory#boardofdirectors" },
        { label: "Executive Staff", href: "/pages/ourstory#executivestaff" }
      ]
    },
    help: {
      title: "HOW WE HELP",
      items: [
        
        { label: "Our Approach", href: "/pages/howwehelp#approach" },
        { label: "PLEP", href: "/pages/plep" },
        { label: "PLCA", href: "/pages/plca" },
        { label: "PPC", href: "/pages/ppc" },
        { label: "VETA", href: "/pages/veta" }
      ]
    },
    action: {
      title: "TAKE ACTION",
      items: [
        { label: "Volunteer", href: "/pages/volunteer" },
        { label: "Ways to Support", href: "/pages/donate" },
        { label: "Testimonials", href: "/pages/testimonials" }
      ]
    },
    resources: {
      title: "RESOURCES",
      items: [
        { label: "Free Workshops", href: "/pages/workshops" },
        { label: "Help Center", href: "/pages/helpcenter" },
        { label: "WANAC Careers", href: "/pages/contact&career" }
      ]
    }
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleKeyDown = (e, menu) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown(menu);
    }
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

  // Function to handle navigation
 const router = useRouter();

const handleNavigation = (href) => {
  setActiveDropdown(null);
  router.push(href); // client-side route change
};

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showLangDropdown) return;
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLangDropdown]);

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
      
      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-md">
        {/* Top Bar */}
        <div className="w-full text-white text-xs md:text-sm flex items-center justify-between px-4 py-1 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-6">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center gap-1 select-none" ref={langDropdownRef}>
              <button
                type="button"
                className="flex items-center gap-1 cursor-pointer focus:outline-none"
                onClick={e => { e.stopPropagation(); setShowLangDropdown(v => !v); }}
                aria-haspopup="listbox"
                aria-expanded={showLangDropdown}
              >
                <span className="w-4 h-4 bg-gray-700 rounded-full inline-block mr-1" />
                {language}
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLangDropdown && (
                <div className="absolute left-0 mt-7 min-w-[100px] bg-white text-gray-900 rounded shadow z-50" role="listbox">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={`w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer ${lang === language ? "font-bold bg-gray-100" : ""}`}
                      onClick={e => { e.stopPropagation(); setLanguage(lang); setShowLangDropdown(false); }}
                      role="option"
                      aria-selected={lang === language}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* High Contrast Toggle */}
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 bg-gray-700 rounded-full inline-block mr-1" />
              High Contrast
              <label className="ml-2 relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isDark}
                  onChange={() => setIsDark(!isDark)}
                />
                <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-yellow-500 transition-all"></div>
                <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all ${isDark ? "translate-x-4" : ""}`}></div>
              </label>
            </div>
          </div>
          {/* Search, Customer & Support, and Log In */}
          <div className="flex items-center gap-2">
            {/* Search Icon and Input */}
            <div className="relative flex items-center">
              <button
                className="p-2 rounded hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setShowSearch((v) => !v)}
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              {showSearch && (
                <input
                  type="text"
                  className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 text-xs md:text-sm"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                  onKeyDown={e => { if (e.key === 'Escape') setShowSearch(false); }}
                  style={{ minWidth: '120px' }}
                />
              )}
            </div>
            <a href="/pages/helpcenter" className="flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-700 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 1 1 5.82 0c0 1.5-1.5 2.25-2.25 2.25S12 13.5 12 15" /><circle cx="12" cy="18" r="1" /></svg>
              Customer & Support
            </a>
            <a href="/login" className="px-3 py-1 rounded border border-orange-400 text-orange-400 hover:bg-orange-500 hover:text-white transition-colors duration-200 font-semibold">Log In</a>
          </div>
        </div>
        <nav
          ref={navRef}
          className="text-sm py-3 px-4 items-center transition duration-300 bg-transparent"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center">
              <Link href="/" aria-label="WANAC Home">
                <Image
                  src="/WANAC N 8 Old Glory.png"
                  alt="WANAC Logo"
                  width={180}
                  height={70}
                  priority
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center justify-end gap-6 flex-1" ref={dropdownRef}>
              {Object.entries(navigation).map(([key, section]) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => toggleDropdown(key)}
                    onKeyDown={(e) => handleKeyDown(e, key)}
                    className={`flex items-center text-sm font-medium transition duration-300 whitespace-nowrap ${
                      activeDropdown === key ? "text-orange-500" : "text-black"
                    }`}
                    aria-expanded={activeDropdown === key}
                    aria-haspopup="true"
                  >
                    {section.title}
                    <ChevronDown 
                      className={`ml-1 w-3 h-3 transition-transform duration-300 ${
                        activeDropdown === key ? "rotate-180" : ""
                      }`} 
                      aria-hidden="true" 
                    />
                  </button>

                  {activeDropdown === key && (
                    <div className="fixed top-[64px] left-0 w-full bg-[#001f4d] text-white py-4 z-50 shadow-md">
                      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6 px-8">
                        {section.items.map((item, index) => (
                          <React.Fragment key={index}>
                            <Link
                              href={item.href}
                              className="text-sm hover:text-orange-400 transition-colors duration-300"
                              onClick={() => {
                                setActiveDropdown(null);
                                handleNavigation(item.href);
                              }}
                            >
                              {item.label}
                            </Link>
                            {index < section.items.length - 1 && (
                              <span className="text-white opacity-50">★</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href="/donate"
                  className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 whitespace-nowrap"
                >
                  DONATE
                </Link>
                <Link
                  href="/pages/programintakeform"
                  className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 whitespace-nowrap"
                >
                  FREE STRATEGY SESSION
                </Link>
                <Link
                  href="/workshops"
                  className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-md hover:bg-orange-500 transition duration-300 whitespace-nowrap"
                >
                  SHOP
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-white overflow-y-auto md:hidden">
              {Object.entries(navigation).map(([key, section]) => (
                <div key={key} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleDropdown(key)}
                    className="w-full px-4 py-2 flex justify-between items-center"
                    aria-expanded={activeDropdown === key}
                  >
                    {section.title}
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeDropdown === key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  {activeDropdown === key && (
                    <div className="bg-gray-50 py-2">
                      {section.items.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-8 py-2 text-sm text-gray-700 hover:text-orange-500"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setActiveDropdown(null);
                            handleNavigation(item.href);
                          }}
                        >
                          ★ {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Action Buttons */}
              <div className="px-4 py-4 space-y-2">
                <button
                  className="block w-full text-center py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation('/pages/donate');
                  }}
                >
                  DONATE
                </button>
                <button
                  className="block w-full text-center py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation('/pages/programintakeform');
                  }}
                >
                  FREE STRATEGY SESSION
                </button>
                <button
                  className="block w-full text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation('/pages/workshops');
                  }}
                >
                  SHOP
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}