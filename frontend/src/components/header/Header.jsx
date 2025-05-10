import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import sakstatLogoGe from "../../assets/images/sakstat-logo.svg";
import sakstatLogoEn from "../../assets/images/sakstat-logo-en.png";
import georgianFlag from "../../assets/images/georgian-flag.svg";
import britishFlag from "../../assets/images/british-flag.svg";

const Header = ({ language = "GE", setLanguage }) => {
  const fontClass = language === "GE" ? "font-bpg-nino" : "font-poppins";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleLanguage = () => {
    setLanguage(language === "GE" ? "EN" : "GE");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (isMenuOpen && event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-md px-4 md:px-6 py-3 flex items-center justify-between ${fontClass}`}>      {/* Logo with Link to Home */}
      <div className="flex items-center gap-3">
        <Link to="/" aria-label="Home">
          <img
            src={language === "GE" ? sakstatLogoGe : sakstatLogoEn}
            alt="Logo"
            className="h-6 md:h-7 hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </Link>
      </div>

      {/* Title */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 transition-colors duration-300">
          {language === "GE" ? "ხელფასების კალკულატორი" : "Salary Calculator"}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className={`p-1.5 rounded-full transition-all duration-300 ${
            language === "GE" ? "bg-blue-50" : "bg-red-50"
          } hover:bg-gray-100 hover:shadow-sm`}
          aria-label="Toggle language"
        >
          <img
            src={language === "GE" ? georgianFlag : britishFlag}
            alt="Language flag"
            className="h-5 w-5"
          />
        </button>

        {/* Professions Dropdown */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-2 rounded-md shadow-sm transition-all duration-300 hover:shadow"
            aria-expanded={isMenuOpen}
          >
            <span className="hidden sm:inline">
              {language === "GE" ? "პროფესიები" : "Professions"}
            </span>
            <span className="sm:hidden">
              {language === "GE" ? "პროფ." : "Prof."}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden animate-fadeIn divide-y divide-gray-100"
            >
              <button className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150 flex items-center gap-3 group">
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">📊</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  {language === "GE"
                    ? "ხელფასები პროფესიების მიხედვით - 2021"
                    : "Salaries by Profession - 2021"}
                </span>
              </button>
              <button className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150 flex items-center gap-3 group">
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">📈</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  {language === "GE"
                    ? "ხელფასები პროფესიების მიხედვით - 2017"
                    : "Salaries by Profession - 2017"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
