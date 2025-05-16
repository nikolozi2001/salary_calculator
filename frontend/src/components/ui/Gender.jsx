import React from 'react';
import maleIcon from "../../assets/icons/male.png";
import femaleIcon from "../../assets/icons/female.png";

// Gender item component with enhanced design
const GenderItem = ({ gender, icon, label, color, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(gender)}
    className={`relative flex flex-col items-center p-6 rounded-2xl transition-all transform duration-300 cursor-pointer group hover:scale-[1.02] ${
      isSelected
        ? `bg-gradient-to-br from-${color}-50 to-white shadow-lg border-2 border-${color}-300`
        : `bg-white hover:shadow-md hover:bg-${color}-50 border border-gray-100 hover:border-${color}-200`
    }`}
    role="button"
    aria-pressed={isSelected}
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onSelect(gender);
        e.preventDefault();
      }
    }}
  >
    {/* Selection indicator */}
    {isSelected && (
      <div className={`absolute -top-2 -right-2 bg-${color}-500 text-white rounded-full p-1.5 shadow-md animate-fadeIn`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    )}
    
    {/* Icon container with animation and effects */}
    <div
      className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all transform duration-300 ${
        isSelected
          ? `bg-gradient-to-br from-${color}-200 to-${color}-100 scale-110 shadow-lg ring-4 ring-${color}-100 ring-opacity-50`
          : `bg-gradient-to-br from-gray-50 to-white shadow-sm group-hover:shadow-md group-hover:ring-2 group-hover:ring-${color}-100 group-hover:ring-opacity-30`
      }`}
    >
      <img
        className={`w-12 h-12 transition-all duration-300 ${
          isSelected ? "scale-110 drop-shadow-md" : "group-hover:scale-105"
        }`}
        src={icon}
        alt={`${gender} Icon`}
      />
    </div>
    
    {/* Label with enhanced typography */}
    <span
      className={`text-lg font-medium tracking-wide transition-all duration-200 ${
        isSelected ? `text-${color}-600` : `text-gray-600 group-hover:text-${color}-500`
      }`}
    >
      {label}
    </span>
    
    {/* Additional description text */}
    <span className={`text-xs mt-1 transition-all duration-200 ${
      isSelected ? `text-${color}-400` : 'text-gray-400 group-hover:text-gray-500'
    }`}>
      {gender === "male" ? "კაცების საშუალო ხელფასი" : "ქალების საშუალო ხელფასი"}
    </span>
  </div>
);

// Main Gender selection component
const Gender = ({ 
  activeStepIndex, 
  language, 
  selectedGender, 
  setSelectedGender, 
  handleGenderSelect 
}) => {
  // Enhanced Step Heading component with better visual hierarchy
  const StepHeading = ({ number, title, selected, onClear }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="relative mr-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-sm">
            {number}
          </span>
          {/* Animated pulse effect for active step */}
          {activeStepIndex === 2 && (
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping" style={{ animationDuration: '3s' }}></span>
          )}
        </div>
        <h3 className="text-gray-800 font-medium text-lg">{title}</h3>
      </div>
      {selected && (
        <button
          onClick={onClear}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 hover:text-gray-800 transition-all duration-200 group"
          aria-label="Clear selection"
        >
          <span>{language === "GE" ? "გასუფთავება" : "Clear"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow-md col-span-12 md:col-span-6 transition-all duration-500 transform ${
        activeStepIndex >= 2
          ? "scale-100 opacity-100 ring-2 ring-blue-200"
          : "scale-[0.95] opacity-80"
      }`}
    >
      <StepHeading
        number={4}
        title={language === "GE" ? "აირჩიეთ სქესი" : "Choose Gender"}
        selected={selectedGender}
        onClear={() => setSelectedGender(null)}
      />
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-6">
        <div className="animate-fadeIn" style={{ animationDelay: '30ms' }}>
          <GenderItem
            gender="female"
            icon={femaleIcon}
            label={language === "GE" ? "ქალი" : "Female"}
            color="pink"
            isSelected={selectedGender === "female"}
            onSelect={handleGenderSelect}
          />
        </div>
        
        <div className="animate-fadeIn" style={{ animationDelay: '60ms' }}>
          <GenderItem
            gender="male"
            icon={maleIcon}
            label={language === "GE" ? "კაცი" : "Male"}
            color="blue"
            isSelected={selectedGender === "male"}
            onSelect={handleGenderSelect}
          />
        </div>
      </div>

      {/* Selected gender indicator with improved styling */}
      {selectedGender && (
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 animate-fadeIn">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-3 ${
              selectedGender === "male" ? "bg-blue-400" : "bg-pink-400"
            }`}></div>
            <span className="text-sm text-gray-600">
              {language === "GE" ? "არჩეულია:" : "Selected:"} 
              <span className={`font-medium ml-1 ${
                selectedGender === "male" ? "text-blue-600" : "text-pink-600"
              }`}>
                {selectedGender === "male" 
                  ? (language === "GE" ? "კაცი" : "Male")
                  : (language === "GE" ? "ქალი" : "Female")}
              </span>
            </span>
          </div>
          <button 
            onClick={() => setSelectedGender(null)}
            className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <span>{language === "GE" ? "შეცვლა" : "Change"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Helper text */}
      {!selectedGender && (
        <div className="mt-4 text-center text-xs text-gray-500 italic animate-fadeIn">
          {language === "GE" 
            ? "გთხოვთ აირჩიოთ სქესი ხელფასის სტატისტიკისთვის" 
            : "Please select a gender for salary statistics"}
        </div>
      )}
    </div>
  );
};

export default Gender;
