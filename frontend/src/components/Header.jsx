import React, { useState, useEffect, useRef } from "react";
import sakstatLogoGe from "../assets/images/sakstat-logo.svg";
import sakstatLogoEn from "../assets/images/sakstat-logo-en.png";

const Header = ({ language = "GE", setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleLanguage = () => {
    setLanguage(language === "GE" ? "EN" : "GE");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Effect to handle clicks outside the dropdown and escape key press
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
      if (isMenuOpen && event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 bg-white shadow-sm py-4 px-6 flex items-center justify-between font-sans">
      {/* Logo - Use appropriate logo based on language */}
      <div className="flex items-center transition-transform duration-300 hover:scale-110">
        <img
          src={language === "GE" ? sakstatLogoGe : sakstatLogoEn}
          alt="Logo"
          className="h-6"
        />
      </div>

      {/* Title - Smaller font */}
      <div className="flex-grow flex justify-center">
        <h1 className="text-lg font-semibold text-gray-800">
          {language === "GE" ? "ხელფასების კალკულატორი" : "Salary Calculator"}
        </h1>
      </div>

      {/* Right Controls - More compact */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition"
          aria-label="Toggle Language"
        >
          <span className="mr-1 text-xs">🌐</span> {language}
        </button>
        
        <div className="relative">
          <button 
            ref={buttonRef}
            onClick={toggleMenu}
            className="flex items-center justify-between gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <span>{language === "GE" ? "პროფესიები" : "Professions"}</span>
            <svg className={`w-3 h-3 ml-1 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {isMenuOpen && (
            <div 
              ref={menuRef}
              className="absolute right-0 mt-2 z-10 bg-white text-gray-800 rounded-lg shadow-lg w-48 py-2"
            >
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition flex items-center">
                  <span className="w-4 h-4 mr-2 text-blue-600">📊</span>
                  {language === "GE" ? "ხელფასები პროფესიების მიხედვით - 2021" : "Salaries by profession - 2021"}
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition flex items-center">
                  <span className="w-4 h-4 mr-2 text-blue-600">📈</span>
                  {language === "GE" ? "ხელფასები პროფესიების მიხედვით - 2017" : "Salaries by profession - 2017"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
