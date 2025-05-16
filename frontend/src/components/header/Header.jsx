import React, { useState } from "react";
import { Link } from "react-router-dom";
import sakstatLogoGe from "../../assets/images/sakstat-logo.svg";
import sakstatLogoEn from "../../assets/images/sakstat-logo-en.png";
import georgianFlag from "../../assets/images/georgian-flag.svg";
import britishFlag from "../../assets/images/british-flag.png";
import headerBg from "../../assets/images/header-bg.jpg";
import InfoModal from "../ui/InfoModal";

const Header = ({ language = "GE", setLanguage }) => {
  const fontClass = language === "GE" ? "font-bpg-nino" : "font-poppins";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "GE" ? "EN" : "GE");
  };

  return (
    <>
      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
      <header
        className={`sticky top-0 z-50 shadow-md px-2 md:px-8 py-2 md:py-5 flex flex-col md:flex-row items-center gap-2 md:gap-4 ${fontClass}`}
        style={{
          backgroundImage: `url(${headerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Logo with Link to Home */}
        <div className="flex items-center">
          <Link to="/" aria-label="Home">
            <img
              src={language === "GE" ? sakstatLogoGe : sakstatLogoEn}
              alt="Logo"
              className="h-8 md:h-20 hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </Link>
        </div>

        {/* Title */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg md:text-2xl font-semibold text-white text-center transition-colors duration-300">
            {language === "GE" ? "ხელფასების კალკულატორი" : "Salary Calculator"}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-end gap-2 md:gap-3 w-full md:w-auto">
          {/* Language Toggle and Info */}
          <div className="flex items-center justify-center md:justify-end gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Information"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-md transition-all duration-300 ${
                language === "GE" ? "bg-gray-400" : "bg-gray-400"
              } hover:bg-gray-400/50 hover:shadow-sm`}
              aria-label="Toggle language"
            >
              <img
                src={language === "GE" ? britishFlag : georgianFlag}
                alt="Language flag"
                className="h-5 w-5 md:h-6 md:w-6"
              />
              <span className="text-xs md:text-sm text-white">
                {language === "GE" ? "English" : "ქართული"}
              </span>
            </button>
          </div>

          {/* Profession Buttons */}
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <button
              className="whitespace-normal text-left px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm bg-gray-400 hover:bg-gray-400/50 text-white rounded-md shadow-sm transition-all duration-300 hover:shadow md:min-w-[200px]"
              data-toggle="modal"
              data-target="#modalProfession2021"
            >
              {language === "GE" ? (
                <>
                  ხელფასები პროფესიების
                  <br />
                  მიხედვით - 2021 - ISCO08
                </>
              ) : (
                <>
                  Salaries by Profession
                  <br />
                  2021 - ISCO08
                </>
              )}
            </button>
            <button
              className="whitespace-normal text-left px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm bg-gray-400 hover:bg-gray-400/50 text-white rounded-md shadow-sm transition-all duration-300 hover:shadow md:min-w-[200px]"
              data-toggle="modal"
              data-target="#modalProfession"
            >
              {language === "GE" ? (
                <>
                  ხელფასები პროფესიების
                  <br />
                  მიხედვით - 2017 - ISCO88
                </>
              ) : (
                <>
                  Salaries by Profession
                  <br />
                  2017 - ISCO88
                </>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
