import React from "react";
import sakstatLogoGe from "../assets/images/sakstat-logo.svg";
import sakstatLogoEn from "../assets/images/sakstat-logo-en.png";

const Footer = ({ language = "GE" }) => {
  const fontClass = language === "GE" ? "font-bpg-nino" : "font-poppins";
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`${fontClass} bg-white border-t border-gray-200 mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Condensed Footer Layout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 text-sm">
          {/* Logo and Description - Smaller and more compact */}
          <div className="space-y-1 max-w-xs">
            <div className="flex items-center">
              <img
                src={language === "GE" ? sakstatLogoGe : sakstatLogoEn}
                alt="Logo"
                className="h-6 mr-2"
              />
              <h3 className="text-sm font-light text-gray-700">
                {language === "GE" ? (
                  <><span className="text-blue-600 font-normal">ხელფასების</span> კალკულატორი</>
                ) : (
                  <><span className="text-blue-600 font-normal">Salary</span> Calculator</>
                )}
              </h3>
            </div>
            <p className="text-gray-500">
              {language === "GE" 
                ? "საქართველოს შრომის ბაზრის ანალიზის ინსტრუმენტი"
                : "Georgian labor market analysis tool"}
            </p>
          </div>

          {/* Quick Links - More compact */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              {language === "GE" ? "სწრაფი ბმულები" : "Quick Links"}
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  {language === "GE" ? "მთავარი გვერდი" : "Home"}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  {language === "GE" ? "რეგიონები" : "Regions"}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  {language === "GE" ? "პროფესიები" : "Professions"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Minimized */}
          <div>
            <h4 className="font-medium text-gray-800 text-xs mb-1">
              {language === "GE" ? "კონტაქტი" : "Contact"}
            </h4>
            <div className="space-y-1 text-gray-600">
              <p className="flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@salary-calculator.ge
              </p>
              <div className="flex space-x-3 pt-2">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright Section - Simplified */}
        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center text-xs">
          <p className="text-gray-500">
            © {currentYear} {language === "GE" ? "ხელფასების კალკულატორი" : "Salary Calculator"}
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200">
              {language === "GE" ? "პირობები" : "Terms"}
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200">
              {language === "GE" ? "კონფიდენციალურობა" : "Privacy"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;