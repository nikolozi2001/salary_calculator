import React from "react";

const CircularYearSelector = ({ years = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014], selectedYear, setSelectedYear }) => {
  const radius = 100;
  const innerRadius = 60;
  const center = 120;
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
            fill={isSelected ? "#1a56db" : "#3490dc"} 
            className={`transition-all duration-300 ${isSelected 
              ? 'stroke-white stroke-2 filter brightness-110 shadow-lg' 
              : 'hover:fill-blue-700 hover:filter hover:brightness-105'}`}
          />
          <text
            x={tx}
            y={ty}
            fill="white"
            fontSize={isSelected ? "14" : "12"}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight={isSelected ? "bold" : "normal"}
            className="transition-all duration-200"
          >
            {year}
          </text>
          {isSelected && (
            <path 
              d={d} 
              fill="none" 
              stroke="rgba(255,255,255,0.6)" 
              strokeWidth="2"
              className="animate-pulse"
            />
          )}
        </g>
      );
    });
  };

  return (
    <div className="w-64 h-64 mx-auto relative">
      <svg width="240" height="240">
        {renderSegments()}
        <circle cx={center} cy={center} r={innerRadius - 5} fill="white" className="shadow-inner" />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`text-center ${selectedYear ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
          fill="currentColor"
        >
          {selectedYear ? selectedYear : "აირჩიეთ\nწელი"}
        </text>
      </svg>
    </div>
  );
};

export default CircularYearSelector;