import React from "react";

const CircularYearSelector = ({ years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016], selectedYear, setSelectedYear }) => {
  // Reduce the size of the component
  const radius = 80;
  const innerRadius = 50;
  const center = 100;
  const angle = 360 / years.length;

  const getCoordinates = (angleDeg, r) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return [center + r * Math.cos(rad), center + r * Math.sin(rad)];
  };

  const handleYearClick = (year) => {
    if (setSelectedYear) {
      setSelectedYear(year);
    }
  };

  const renderSegments = () => {
    return years.map((year, i) => {
      const startAngle = i * angle;
      const endAngle = (i + 1) * angle;

      const [x1, y1] = getCoordinates(startAngle, radius);
      const [x2, y2] = getCoordinates(endAngle, radius);
      const [x3, y3] = getCoordinates(endAngle, innerRadius);
      const [x4, y4] = getCoordinates(startAngle, innerRadius);

      const largeArc = angle > 180 ? 1 : 0;

      const d = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
        Z
      `;

      const midAngle = startAngle + angle / 2;
      const [tx, ty] = getCoordinates(midAngle, (radius + innerRadius) / 2);

      // Check if this year is selected
      const isSelected = selectedYear === year;

      return (
        <g 
          key={year} 
          className="cursor-pointer" 
          onClick={() => handleYearClick(year)}
        >
          <path 
            d={d} 
            fill={isSelected ? "#3b82f6" : "#e2e8f0"} 
            className={`transition-all duration-300 ${isSelected 
              ? 'filter drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' 
              : 'hover:fill-blue-100'}`}
          />
          <text
            x={tx}
            y={ty}
            fill={isSelected ? "white" : "#64748b"}
            fontSize={isSelected ? "12" : "11"}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight={isSelected ? "500" : "400"}
            className="transition-all duration-200 font-sans"
          >
            {year}
          </text>
          {isSelected && (
            <path 
              d={d} 
              fill="none" 
              stroke="#93c5fd" 
              strokeWidth="1"
              strokeDasharray="3 2"
              className="animate-pulse opacity-70"
            />
          )}
        </g>
      );
    });
  };

  return (
    // Reduce the overall width and height
    <div className="w-48 h-48 mx-auto relative">
      <svg width="200" height="200" className="drop-shadow-sm">
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>
        {renderSegments()}
        <circle 
          cx={center} 
          cy={center} 
          r={innerRadius - 5} 
          fill="url(#circleGradient)" 
          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.03)]" 
        />
        <text
          x={center}
          y={center - 5}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-center font-light tracking-wide"
          fontSize="14"
          fill={selectedYear ? "#3b82f6" : "#94a3b8"}
        >
          {selectedYear || "აირჩიეთ"}
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-center font-light"
          fontSize="11"
          fill="#94a3b8"
        >
          წელი
        </text>
      </svg>
    </div>
  );
};

export default CircularYearSelector;