import React, { useState } from "react";
import { Link } from "react-router-dom";
import sakstatLogoGe from "../../assets/images/sakstat-logo.svg";
import sakstatLogoEn from "../../assets/images/sakstat-logo-en.png";
import georgianFlag from "../../assets/images/georgian-flag.svg";
import britishFlag from "../../assets/images/british-flag.svg";
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
        className={`sticky top-0 z-50 shadow-md px-4 md:px-8 py-4 md:py-5 flex items-center justify-between ${fontClass}`}
        style={{
          backgroundImage: `url(${headerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Logo with Link to Home */}
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="Home">
            <img
              src={language === "GE" ? sakstatLogoGe : sakstatLogoEn}
              alt="Logo"
              className="h-10 md:h-20 hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </Link>
        </div>

        {/* Title */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl md:text-2xl font-semibold text-white transition-colors duration-300">
            {language === "GE" ? "ხელფასების კალკულატორი" : "Salary Calculator"}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-end gap-3">
          {/* Language Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Information"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 ${
                language === "GE" ? "bg-gray-400" : "bg-red-800/50"
              } hover:bg-gray-400/50 hover:shadow-sm`}
              aria-label="Toggle language"
            >
              <img
                src={language === "GE" ? britishFlag : georgianFlag}
                alt="Language flag"
                className="h-6 w-6"
              />
              <span className="text-sm text-white">
                {language === "GE" ? "English" : "ქართული"}
              </span>
            </button>
          </div>

          {/* Profession Buttons */}
          <div className="flex flex-row gap-2">
            <button
              className="whitespace-normal text-left px-3 py-2 text-sm bg-gray-400 hover:bg-gray-400/50 text-white rounded-md shadow-sm transition-all duration-300 hover:shadow min-w-[200px]"
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
              className="whitespace-normal text-left px-3 py-2 text-sm bg-gray-400 hover:bg-gray-400/50 text-white rounded-md shadow-sm transition-all duration-300 hover:shadow min-w-[200px]"
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
