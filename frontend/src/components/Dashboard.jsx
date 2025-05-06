import React, { useState, useRef, useEffect } from "react";
import georgiaMap from "../assets/svg/georgia.svg";
import CircularYearSelector from "../components/CircularYearSelector";

const Dashboard = () => {
  // State for selections
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedGender, setSelectedGender] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Reference to the SVG element
  const svgRef = useRef(null);

  // Region data with names (English and Georgian) and colors - using more subtle color palette
  const regionData = {
    "GE-AB": { nameEn: "Abkhazia", nameGe: "აფხაზეთი", color: "#94A3B8" },
    "GE-AJ": { nameEn: "Adjara", nameGe: "აჭარა", color: "#F59E0B" },
    "GE-GU": { nameEn: "Guria", nameGe: "გურია", color: "#818CF8" },
    "GE-IM": { nameEn: "Imereti", nameGe: "იმერეთი", color: "#A78BFA" },
    "GE-KA": { nameEn: "Kakheti", nameGe: "კახეთი", color: "#FB7185" },
    "GE-KK": { nameEn: "Kvemo Kartli", nameGe: "ქვემო ქართლი", color: "#67E8F9" },
    "GE-MM": { nameEn: "Mtskheta-Mtianeti", nameGe: "მცხეთა-მთიანეთი", color: "#BEF264" },
    "GE-RL": { nameEn: "Racha-Lechkhumi", nameGe: "რაჭა-ლეჩხუმი", color: "#FDBA74" },
    "GE-SJ": { nameEn: "Samtskhe-Javakheti", nameGe: "სამცხე-ჯავახეთი", color: "#A1A1AA" },
    "GE-SK": { nameEn: "Shida Kartli", nameGe: "შიდა ქართლი", color: "#94A3B8" },
    "GE-SZ": { nameEn: "Samegrelo-Zemo Svaneti", nameGe: "სამეგრელო-ზემო სვანეთი", color: "#86EFAC" },
    "GE-TB": { nameEn: "Tbilisi", nameGe: "თბილისი", color: "#FCD34D" },
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
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

  // Move to next step when a selection is made
  useEffect(() => {
    if (selectedRegion && activeStepIndex === 0) {
      setTimeout(() => setActiveStepIndex(1), 300);
    } else if (selectedActivity && activeStepIndex === 1) {
      setTimeout(() => setActiveStepIndex(2), 300);
    } else if (selectedYear && selectedGender && activeStepIndex === 2) {
      setTimeout(() => setActiveStepIndex(3), 300);
    }
  }, [selectedRegion, selectedActivity, selectedYear, selectedGender, activeStepIndex]);

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
              fill: #f1f5f9;
              stroke: white;
              stroke-width: 0.5;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              cursor: pointer;
              opacity: 0.9;
            }
            path:hover {
              opacity: 1;
              stroke-width: 1;
              stroke: white;
              filter: brightness(1.05) saturate(1.2);
            }
            path.selected {
              stroke-width: 1.5;
              stroke: white;
              filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07));
              opacity: 1;
            }
            .region-label {
              font-family: 'Inter', sans-serif;
              font-size: 12px;
              fill: white;
              text-anchor: middle;
              pointer-events: none;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            path:hover + .region-label,
            path.selected + .region-label {
              opacity: 1;
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
        path.setAttribute("filter", "brightness(1.1) saturate(1.2)");
      } else {
        path.removeAttribute("filter");
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

  // Check if all selections are made
  const allSelectionsComplete = selectedRegion && selectedActivity && selectedYear && selectedGender;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-extralight text-gray-800 tracking-tight">
            ხელფასების <span className="text-blue-600 font-normal">კალკულატორი</span>
          </h1>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-1">
            {[0, 1, 2, 3].map((step, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${
                    activeStepIndex >= step 
                      ? "bg-blue-500" 
                      : "bg-gray-200"
                  }`}
                ></div>
                {index < 3 && (
                  <div 
                    className={`h-[1px] w-8 transition-all duration-500 ${
                      activeStepIndex > step 
                        ? "bg-blue-500" 
                        : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - New Card Design */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side - Map */}
          <div className={`bg-white rounded-2xl shadow-sm p-6 lg:col-span-7 transition-all duration-500 transform ${activeStepIndex === 0 ? "scale-100 opacity-100" : "scale-[0.98] opacity-90"}`}>
            <h2 className="text-xl font-light text-gray-700 mb-6 flex items-center">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">1</span>
              აირჩიეთ რეგიონი
            </h2>
            
            <div className="relative overflow-hidden rounded-xl group">
              {/* Map Container */}
              <div
                id="georgia-map-container"
                className="w-full aspect-[4/3] transition-transform duration-700 ease-out transform group-hover:scale-[1.02]"
              ></div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            {/* Selected Region Information */}
            {selectedRegion && regionData[selectedRegion] && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: regionData[selectedRegion].color }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {regionData[selectedRegion].nameGe}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {regionData[selectedRegion].nameEn}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Activity Selection */}
          <div className={`bg-white rounded-2xl shadow-sm p-6 lg:col-span-5 transition-all duration-500 transform ${activeStepIndex === 1 ? "scale-100 opacity-100" : (activeStepIndex > 1 ? "scale-[0.98] opacity-90" : "scale-[0.95] opacity-80")}`}>
            <h2 className="text-xl font-light text-gray-700 mb-6 flex items-center">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">2</span>
              აირჩიეთ საქმიანობის სახე
            </h2>
            
            <div className="max-h-96 overflow-y-auto pr-2 space-y-1">
              {industries.map((industry, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedActivity(industry)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                    selectedActivity === industry
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {selectedActivity === industry ? (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-300"></div>
                  )}
                  <span className={`${selectedActivity === industry ? "text-blue-700" : "text-gray-700"}`}>{industry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Selectors */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Year Selector */}
          <div className={`bg-white p-6 rounded-2xl shadow-sm md:col-span-6 transition-all duration-500 transform ${activeStepIndex >= 2 ? "scale-100 opacity-100" : "scale-[0.95] opacity-80"}`}>
            <h2 className="text-xl font-light text-gray-700 mb-6 flex items-center">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">3</span>
              აირჩიეთ წელი
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
          <div className={`bg-white p-6 rounded-2xl shadow-sm md:col-span-6 transition-all duration-500 transform ${activeStepIndex >= 2 ? "scale-100 opacity-100" : "scale-[0.95] opacity-80"}`}>
            <h2 className="text-xl font-light text-gray-700 mb-6 flex items-center">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">4</span>
              აირჩიეთ სქესი
            </h2>
            <div className="flex justify-center gap-8">
              <div
                onClick={() => setSelectedGender("female")}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  selectedGender === "female"
                    ? "bg-gradient-to-br from-pink-100/60 to-pink-50 shadow-sm"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                  selectedGender === "female" ? "bg-pink-500/20" : "bg-gray-100"
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${selectedGender === "female" ? "text-pink-600" : "text-gray-400"}`}
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
                <span className={`transition-all duration-200 ${selectedGender === "female" ? "text-pink-600 font-medium" : "text-gray-500"}`}>
                  ქალი
                </span>
              </div>

              <div
                onClick={() => setSelectedGender("male")}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  selectedGender === "male"
                    ? "bg-gradient-to-br from-blue-100/60 to-blue-50 shadow-sm"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                  selectedGender === "male" ? "bg-blue-500/20" : "bg-gray-100"
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${selectedGender === "male" ? "text-blue-600" : "text-gray-400"}`}
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
                <span className={`transition-all duration-200 ${selectedGender === "male" ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                  კაცი
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - Animated and responsive to selections */}
        <div className={`mt-8 flex justify-center transition-all duration-700 transform ${allSelectionsComplete ? "scale-100 opacity-100" : "scale-95 opacity-60"}`}>
          <button 
            className={`px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2 group`}
            disabled={!allSelectionsComplete}
          >
            <span>გაანალიზება</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
