import React from "react";
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
      if (e.key === "Enter" || e.key === " ") {
        onSelect(gender);
        e.preventDefault();
      }
    }}
  >
    {/* Selection indicator */}
    {isSelected && (
      <div
        className={`absolute -top-2 -right-2 bg-${color}-500 text-white rounded-full p-1.5 shadow-md animate-fadeIn`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
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
        isSelected
          ? `text-${color}-600`
          : `text-gray-600 group-hover:text-${color}-500`
      }`}
    >
      {label}
    </span>

    {/* Additional description text */}
    <span
      className={`text-xs mt-1 transition-all duration-200 ${
        isSelected
          ? `text-${color}-400`
          : "text-gray-400 group-hover:text-gray-500"
      }`}
    >
      {gender === "male"
        ? "კაცების საშუალო ხელფასი"
        : "ქალების საშუალო ხელფასი"}
    </span>
  </div>
);

// Main Gender selection component
const Gender = ({ language, selectedGender, handleGenderSelect }) => {
  return (
    <div className="col-span-12 md:col-span-6 md:offset-1 mt-5 rounded-2xl">
      <div className="flex justify-center">
        <div className="w-full">
          <div className="text-center mb-3">
            <span className="text-xl font-semibold text-gray-800">
              {language === "GE" ? "აირჩიეთ სქესი" : "Choose Gender"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            <div
              className={`border p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedGender === "female"
                  ? "bg-pink-50 border-pink-300 shadow-md"
                  : "hover:bg-pink-50 hover:border-pink-200"
              }`}
              onClick={() => handleGenderSelect("female")}
            >
              <div className="flex justify-center">
                <img
                  src={femaleIcon}
                  alt="Female"
                  className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="text-center mt-2 text-gray-700">
                {language === "GE" ? "ქალი" : "Female"}
              </div>
            </div>

            <div
              className={`border p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedGender === "male"
                  ? "bg-blue-50 border-blue-300 shadow-md"
                  : "hover:bg-blue-50 hover:border-blue-200"
              }`}
              onClick={() => handleGenderSelect("male")}
            >
              <div className="flex justify-center">
                <img
                  src={maleIcon}
                  alt="Male"
                  className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="text-center mt-2 text-gray-700">
                {language === "GE" ? "კაცი" : "Male"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gender;
