import React from "react";

const CircularYearSelector = ({ years, selectedYear, setSelectedYear }) => {
  if (!years || years.length === 0) return null;

  // Calculate the positioning
  const radius = 110; // Radius of the circle
  const centerX = 120; // Center X coordinate
  const centerY = 120; // Center Y coordinate
  const totalYears = years.length;
  const angleStep = (2 * Math.PI) / totalYears;

  return (
    <div className="relative w-[240px] h-[240px]" aria-label="Year selector">
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center shadow-inner">
        <div className="text-lg font-semibold text-gray-800">
          {selectedYear || "წელი"}
        </div>
      </div>

      {/* Year buttons positioned in a circle */}
      {years.map((year, index) => {
        // Calculate position on the circle
        const angle = index * angleStep - Math.PI / 2; // Start from the top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Is this the selected year?
        const isSelected = selectedYear === year;

        return (
          <button
            key={year}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
            }}
            className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white scale-110 shadow-lg"
                : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm hover:shadow hover:scale-105"
            }`}
            onClick={() => setSelectedYear(year)}
            aria-pressed={isSelected}
            aria-label={`წელი ${year}`}
          >
            <span className="font-medium">{year}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CircularYearSelector;