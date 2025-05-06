import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("GE");

  const toggleLanguage = () => {
    setLanguage(language === "GE" ? "EN" : "GE");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-[#012B7C] to-[#1a4db9] text-white py-3 px-4 md:px-6 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
        <img
          src="/src/assets/images/logo-mini.svg"
          alt="Logo"
          className="h-8 md:h-10"
        />
        
        {/* Title - now positioned inline with logo for minimalist design */}
        <h1 className="text-lg md:text-xl font-semibold tracking-wide">
          {language === "GE" ? "ხელფასების კალკულატორი" : "Salary Calculator"}
        </h1>
      </div>

      {/* Right Controls - Now with dropdown for year selection */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleLanguage}
          className="bg-opacity-20 bg-white hover:bg-opacity-30 px-3 py-1 rounded-full text-sm flex items-center transition-all duration-200"
          aria-label="Toggle Language"
        >
          <span className="mr-1 text-xs">🌐</span> {language}
        </button>
        
        <div className="relative">
          <button 
            onClick={toggleMenu}
            className="bg-opacity-20 bg-white hover:bg-opacity-30 px-3 py-1 rounded-md text-sm flex items-center justify-between transition-all duration-200 min-w-[120px]"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <span>{language === "GE" ? "პროფესიები" : "Professions"}</span>
            <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 z-10 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden w-max min-w-[250px] transition-all duration-200 animate-fade-in">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 flex items-center">
                  <span className="w-5 h-5 mr-2 text-blue-600">📊</span>
                  {language === "GE" ? "ხელფასები პროფესიების მიხედვით - 2021 - ISCO08" : "Salaries by profession - 2021 - ISCO08"}
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 flex items-center">
                  <span className="w-5 h-5 mr-2 text-blue-600">📈</span>
                  {language === "GE" ? "ხელფასები პროფესიების მიხედვით - 2017 - ISCO08" : "Salaries by profession - 2017 - ISCO08"}
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
