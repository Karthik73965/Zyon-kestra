"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-white bg-opacity-5 shadow-sm shadow-slate-200 h-[80px] text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4  align-middle flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl  glow font-bold">
          <Link href="/" className="hover:text-gray-300">
            Zeoy
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex   space-x-8">
          <Link
            href="/pricing"
            className="hover:text-gray-300 mt-3 hover:underline"
          >
            Pricing
          </Link>
          <Link
            href={"/about-us"}
            className="block  text-white mt-3 hover:underline hover:text-gray-300"
          >
            About us
          </Link>
          <Link
            href={"/Docs"}
            className="block  text-white mt-3 hover:underline hover:text-gray-300"
          >
Docs          </Link>
          <Link
            href="/contact"
            className="hover:text-gray-300 mt-3 hover:underline"
          >
            Give us a star
          </Link>
        </div>
        <div className="hidden md:flex  space-x-8">
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-transparent border-2 border-white rounded hover:bg-gray-700"
          >
            Login{" "}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <FaTimes className="" />
            ) : (
              <FaBars className="" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } bg-gray-800 p-4 space-y-4`}
      >
        <Link
          href="/pricing"
          className="block  text-white hover:text-gray-300"
        >
          Pricing
        </Link>
        <Link
          href={"/about-us"}
          className="block  text-white hover:text-gray-300"
        >
          About us
        </Link>
        <Link
          href="/contact"
          className="block  text-white hover:text-gray-300"
        >
          Give us a star
        </Link>
        <Link
          href="/register"
          className="block  text-white bg-blue-600 p-2 rounded hover:bg-blue-700"
        >
          Register
        </Link>
        <Link
          href="/login"
          className="block  text-white border-2 border-white p-2 rounded hover:bg-gray-700"
        >
          Login{" "}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
