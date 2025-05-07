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
    <header className="bg-gradient-to-r from-[#012B7C] to-[#1a4db9] text-white py-1.5 px-3 flex items-center justify-between shadow-md">
      {/* Logo - Use appropriate logo based on language */}
      <div className="flex items-center transition-transform duration-300 hover:scale-105">
        <img
          src={language === "GE" ? sakstatLogoGe : sakstatLogoEn}
          alt="Logo"
          className="h-6"
        />
      </div>

      {/* Title - Smaller font */}
      <div className="flex-grow flex justify-center">
        <h1 className="text-base font-semibold tracking-wide">
          {language === "GE" ? "ხელფასების კალკულატორი" : "Salary Calculator"}
        </h1>
      </div>

      {/* Right Controls - More compact */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={toggleLanguage}
          className="bg-opacity-20 bg-white hover:bg-opacity-30 px-2 py-0.5 rounded-full text-xs flex items-center transition-all duration-200"
          aria-label="Toggle Language"
        >
          <span className="mr-1 text-xs">🌐</span> {language}
        </button>
        
        <div className="relative">
          <button 
            ref={buttonRef}
            onClick={toggleMenu}
            className="bg-opacity-20 bg-white hover:bg-opacity-30 px-2 py-0.5 rounded-md text-xs flex items-center justify-between transition-all duration-200 min-w-[100px]"
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
              className="absolute right-0 mt-1 z-10 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden w-max min-w-[220px] transition-all duration-200 animate-fade-in"
            >
              <div className="py-1">
                <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors duration-150 flex items-center">
                  <span className="w-4 h-4 mr-2 text-blue-600">📊</span>
                  {language === "GE" ? "ხელფასები პროფესიების მიხედვით - 2021" : "Salaries by profession - 2021"}
                </button>
                <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors duration-150 flex items-center">
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
