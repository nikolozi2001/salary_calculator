import React, { useState, useRef, useEffect } from "react";
import georgiaMap from "../assets/svg/georgia.svg";
import CircularYearSelector from "../components/CircularYearSelector";

const Dashboard = () => {
  // State for selections
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2023); // Setting a default year
  const [selectedGender, setSelectedGender] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Reference to the SVG element
  const svgRef = useRef(null);

  // Region data with names (English and Georgian) and colors
  const regionData = {
    "GE-AB": { nameEn: "Abkhazia", nameGe: "აფხაზეთი", color: "#689F38" },
    "GE-AJ": { nameEn: "Adjara", nameGe: "აჭარა", color: "#FF9800" },
    "GE-GU": { nameEn: "Guria", nameGe: "გურია", color: "#3F51B5" },
    "GE-IM": { nameEn: "Imereti", nameGe: "იმერეთი", color: "#9C27B0" },
    "GE-KA": { nameEn: "Kakheti", nameGe: "კახეთი", color: "#E91E63" },
    "GE-KK": {
      nameEn: "Kvemo Kartli",
      nameGe: "ქვემო ქართლი",
      color: "#00BCD4",
    },
    "GE-MM": {
      nameEn: "Mtskheta-Mtianeti",
      nameGe: "მცხეთა-მთიანეთი",
      color: "#CDDC39",
    },
    "GE-RL": {
      nameEn: "Racha-Lechkhumi",
      nameGe: "რაჭა-ლეჩხუმი",
      color: "#FF5722",
    },
    "GE-SJ": {
      nameEn: "Samtskhe-Javakheti",
      nameGe: "სამცხე-ჯავახეთი",
      color: "#795548",
    },
    "GE-SK": {
      nameEn: "Shida Kartli",
      nameGe: "შიდა ქართლი",
      color: "#607D8B",
    },
    "GE-SZ": {
      nameEn: "Samegrelo-Zemo Svaneti",
      nameGe: "სამეგრელო-ზემო სვანეთი",
      color: "#8BC34A",
    },
    "GE-TB": { nameEn: "Tbilisi", nameGe: "თბილისი", color: "#FFC107" },
  };

  // Industry sectors
  const industries = [
    "განათლება",
    "დამამუშავებელი მრეწველობა",
    "ულმ. ადმინისტრაცია და თავდაცვა",
    "სავაჭრო და საცალო ვაჭრობა",
    "მშენებლობა",
    "უძრავი ქონების ოპერაციები",
    "მატერიალური რესურსების მოპოვება",
    "სასტუმრო და კვების მომსახურება",
    "ფინანსები და დაზღვევა",
    "სახელმწიფო მართვა და უსაფრთხოება",
  ];

  // Years for selection
  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

  // Effect to handle SVG loading and manipulation
  useEffect(() => {
    // Function to fetch and process the SVG
    const loadSvg = async () => {
      try {
        const response = await fetch(georgiaMap);
        const svgText = await response.text();

        // Create a container for SVG
        const mapContainer = document.getElementById("georgia-map-container");
        if (!mapContainer) return;

        // Insert SVG content
        mapContainer.innerHTML = svgText;

        // Get the SVG element
        const svgElement = mapContainer.querySelector("svg");
        svgRef.current = svgElement;

        if (svgElement) {
          // Set SVG attributes
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "auto");

          // Add styles for regions
          const style = document.createElement("style");
          style.textContent = `
            path {
              fill: #e5e5e5;
              stroke: white;
              stroke-width: 1;
              transition: all 0.3s ease;
              cursor: pointer;
              opacity: 0.8;
            }
            path:hover {
              opacity: 1;
              stroke-width: 2;
              stroke: #333;
              filter: brightness(1.1);
            }
            path.selected {
              stroke-width: 3;
              stroke: #333;
              filter: none;
              opacity: 1;
            }
            .region-label {
              font-family: 'Arial', sans-serif;
              font-size: 14px;
              font-weight: bold;
              fill: white;
              text-anchor: middle;
              pointer-events: none;
            }
          `;

          svgElement.appendChild(style);

          // Apply colors to regions and add event listeners
          const paths = svgElement.querySelectorAll("path");
          paths.forEach((path) => {
            const id = path.getAttribute("id");
            if (id && regionData[id]) {
              // Apply color
              path.setAttribute("fill", regionData[id].color);

              // Add title for tooltip
              const title = path.querySelector("title");
              if (title) {
                title.textContent = regionData[id].nameGe;
              }

              // Add event listeners
              path.addEventListener("click", () => handleRegionClick(id));
              path.addEventListener("mouseenter", () => handleRegionHover(id));
              path.addEventListener("mouseleave", () => setHoveredRegion(null));
            }
          });
        }
      } catch (error) {
        console.error("Failed to load or process the SVG:", error);
      }
    };

    loadSvg();

    // Cleanup function
    return () => {
      const mapContainer = document.getElementById("georgia-map-container");
      if (mapContainer) {
        mapContainer.innerHTML = "";
      }
    };
  }, []); // Empty dependency array means this runs once on component mount

  // Effect to update selected/hovered state
  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      const id = path.getAttribute("id");

      // Handle selected state
      if (id === selectedRegion) {
        path.classList.add("selected");
      } else {
        path.classList.remove("selected");
      }

      // Handle hover state
      if (id === hoveredRegion) {
        path.setAttribute("filter", "brightness(1.2)");
      } else {
        path.setAttribute("filter", "");
      }
    });
  }, [selectedRegion, hoveredRegion]);

  // Function to handle region click
  const handleRegionClick = (id) => {
    setSelectedRegion(selectedRegion === id ? null : id);
  };

  // Function to handle region hover
  const handleRegionHover = (id) => {
    setHoveredRegion(id);
  };

  return (
    <div className="p-8 mx-auto bg-gray-50 rounded-xl shadow-sm container-fluid">
      {/* Header */}
      <h1 className="text-2xl font-light mb-8 text-center text-gray-700 border-b pb-4">
        ხელფასების კალკულატორი
      </h1>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Map Section - Interactive Region Selection (Making it much bigger) */}
        <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md md:col-span-8">
          <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
            რეგიონი
          </h2>
          <div className="relative group">
            <div
              id="georgia-map-container"
              className="w-full h-[500px] transition-all duration-300 group-hover:opacity-90"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end pointer-events-none">
              <p className="text-white p-3 text-sm w-full text-center">
                აირჩიეთ რეგიონი რუკაზე
              </p>
            </div>
          </div>

          {/* Selected Region Information */}
          {selectedRegion && regionData[selectedRegion] && (
            <div className="mt-4 p-3 border-t border-gray-100">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: regionData[selectedRegion].color }}
                ></div>
                <h3 className="text-lg font-medium text-gray-800">
                  {regionData[selectedRegion].nameGe}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {regionData[selectedRegion].nameEn}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs bg-blue-50 text-blue-600 py-1 px-2 rounded-full">
                  არჩეულია
                </span>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  გაუქმება
                </button>
              </div>
            </div>
          )}

          {/* Region Hover Information */}
          {hoveredRegion &&
            hoveredRegion !== selectedRegion &&
            regionData[hoveredRegion] && (
              <div className="mt-2 text-sm text-gray-500 animate-fade-in">
                {regionData[hoveredRegion].nameGe}
              </div>
            )}
        </div>

        {/* Right panel with info and activity selection */}
        <div className="md:col-span-4 space-y-8">
          {/* Info/Instructions Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              <div className="inline-block bg-white p-2 rounded-full shadow-sm mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-500"
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
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                ხელფასების კალკულატორი საჭიროებს რეგიონის, საქმიანობის სახის,
                სქესისა და წლის არჩევას ანგარიშისთვის.
              </p>
              <button className="mt-4 px-4 py-2 bg-indigo-500 text-white text-sm rounded-md shadow-sm hover:bg-indigo-600 transition-colors duration-300">
                დაწყება
              </button>
            </div>
          </div>

          {/* Activity Selector */}
          <div className="bg-white p-6 rounded-lg shadow-sm overflow-hidden">
            <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
              საქმიანობის სახე
            </h2>
            <div className="max-h-72 overflow-y-auto pr-2 -mr-2 space-y-1">
              {industries.map((industry, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedActivity(industry)}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-2 ${
                    selectedActivity === industry
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span className="text-sm">{industry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Selectors */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Year Selector */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
            წელი
          </h2>
          <div className="flex justify-center">
            <CircularYearSelector
              years={years}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </div>
        </div>

        {/* Gender Selector */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
            სქესი
          </h2>
          <div className="flex gap-6 justify-center">
            <div
              onClick={() => setSelectedGender("female")}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                selectedGender === "female"
                  ? "bg-pink-50 ring-2 ring-pink-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-pink-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a7 7 0 107 7c0-3.86-3.14-7-7-7zm0 11a4 4 0 110-8 4 4 0 010 8z"
                    clipRule="evenodd"
                  />
                  <path
                    d="M10 15v2m0 0h2m-2 0H8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span
                className={`text-sm ${
                  selectedGender === "female" ? "font-medium" : ""
                }`}
              >
                ქალი
              </span>
            </div>

            <div
              onClick={() => setSelectedGender("male")}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                selectedGender === "male"
                  ? "bg-blue-50 ring-2 ring-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 11a4 4 0 110-8 4 4 0 010 8z"
                    clipRule="evenodd"
                  />
                  <path
                    d="M15 3l-2 2m0 0V3m0 2h2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span
                className={`text-sm ${
                  selectedGender === "male" ? "font-medium" : ""
                }`}
              >
                კაცი
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          გაანალიზება
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
