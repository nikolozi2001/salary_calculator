import React, { useEffect, useRef } from "react";

const CircularYearSelector = ({ years, selectedYear, setSelectedYear }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Get all year items
    const items = containerRef.current.querySelectorAll(".year-item");
    const totalItems = items.length;
    
    if (totalItems === 0) return;

    // Calculate the angle for each item
    const angleStep = (2 * Math.PI) / totalItems;
    const radius = 80; // Smaller radius for more compact layout
    
    // Position each item in a circle
    items.forEach((item, index) => {
      // Calculate position
      const angle = index * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      // Apply transforms to position the item
      item.style.transform = `translate(${x}px, ${y}px)`;
      
      // Add event listener
      item.addEventListener("click", () => {
        const year = parseInt(item.getAttribute("data-year"));
        setSelectedYear(year);
      });
      
      // Add keyboard navigation
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", `Select year ${item.getAttribute("data-year")}`);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const year = parseInt(item.getAttribute("data-year"));
          setSelectedYear(year);
        }
      });
    });
  }, [years, setSelectedYear]);

  return (
    <div className="relative h-[200px] w-[200px] flex items-center justify-center" ref={containerRef}>
      {/* Center circle */}
      <div className="absolute w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium z-10">
        {selectedYear || "წელი"}
      </div>
      
      {/* Years positioned in a circle */}
      {years.map((year) => (
        <div
          key={year}
          data-year={year}
          className={`year-item absolute w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 cursor-pointer ${
            selectedYear === year
              ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-selected={selectedYear === year}
        >
          {year}
        </div>
      ))}
      
      {/* Background circle - subtle guide */}
      <div className="absolute w-[160px] h-[160px] rounded-full border border-gray-100"></div>
    </div>
  );
};

export default CircularYearSelector;