// src/components/Navbar.jsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-bold text-blue-700">
        <Link href="/">WANAC</Link>
      </div>
      <div className="space-x-4 hidden md:flex">
        <Link href="/about" className="text-gray-700 hover:text-blue-600">About Us</Link>
        <Link href="/how-we-help" className="text-gray-700 hover:text-blue-600">How We Help</Link>
        <Link href="/resources" className="text-gray-700 hover:text-blue-600">Resources</Link>
        <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
        <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
      </div>
    </nav>
  );
}