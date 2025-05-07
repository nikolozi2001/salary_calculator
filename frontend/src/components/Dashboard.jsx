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

  // Function to handle activity selection with toggle capability
  const handleActivitySelect = (activity) => {
    setSelectedActivity(selectedActivity === activity ? null : activity);
  };

  // Function to handle region selection with toggle capability
  const handleRegionSelect = (id) => {
    setSelectedRegion(selectedRegion === id ? null : id);
  };

  // Function to handle year selection with toggle capability
  const handleYearSelect = (year) => {
    setSelectedYear(selectedYear === year ? null : year);
  };

  // Function to handle gender selection with toggle capability
  const handleGenderSelect = (gender) => {
    setSelectedGender(selectedGender === gender ? null : gender);
  };

  // Reference to the SVG element
  const svgRef = useRef(null);

  // Region data with names (English and Georgian) and colors - using more subtle color palette
  const regionData = {
    "GE-AB": { nameEn: "Abkhazia", nameGe: "აფხაზეთი", color: "#94A3B8" },
    "GE-AJ": { nameEn: "Adjara", nameGe: "აჭარა", color: "#F59E0B" },
    "GE-GU": { nameEn: "Guria", nameGe: "გურია", color: "#818CF8" },
    "GE-IM": { nameEn: "Imereti", nameGe: "იმერეთი", color: "#A78BFA" },
    "GE-KA": { nameEn: "Kakheti", nameGe: "კახეთი", color: "#FB7185" },
    "GE-KK": {
      nameEn: "Kvemo Kartli",
      nameGe: "ქვემო ქართლი",
      color: "#67E8F9",
    },
    "GE-MM": {
      nameEn: "Mtskheta-Mtianeti",
      nameGe: "მცხეთა-მთიანეთი",
      color: "#BEF264",
    },
    "GE-RL": {
      nameEn: "Racha-Lechkhumi",
      nameGe: "რაჭა-ლეჩხუმი",
      color: "#FDBA74",
    },
    "GE-SJ": {
      nameEn: "Samtskhe-Javakheti",
      nameGe: "სამცხე-ჯავახეთი",
      color: "#A1A1AA",
    },
    "GE-SK": {
      nameEn: "Shida Kartli",
      nameGe: "შიდა ქართლი",
      color: "#94A3B8",
    },
    "GE-SZ": {
      nameEn: "Samegrelo-Zemo Svaneti",
      nameGe: "სამეგრელო-ზემო სვანეთი",
      color: "#86EFAC",
    },
    "GE-TB": { nameEn: "Tbilisi", nameGe: "თბილისი", color: "#FCD34D" },
  };

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
  }, [
    selectedRegion,
    selectedActivity,
    selectedYear,
    selectedGender,
    activeStepIndex,
  ]);

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
          // Set SVG attributes for proper scaling
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

          // Make sure the viewBox is set properly to prevent trimming
          if (!svgElement.getAttribute("viewBox")) {
            const bbox = svgElement.getBBox();
            const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
            svgElement.setAttribute("viewBox", viewBox);
          }

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
  const allSelectionsComplete =
    selectedRegion && selectedActivity && selectedYear && selectedGender;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 font-['Inter',sans-serif] overflow-hidden">
      {/* Header - Reduced margins */}
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-extralight text-gray-800 tracking-tight">
            ხელფასების{" "}
            <span className="text-blue-600 font-normal">კალკულატორი</span>
          </h1>

          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-1">
            {[0, 1, 2, 3].map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${
                    activeStepIndex >= step ? "bg-blue-500" : "bg-gray-200"
                  }`}
                ></div>
                {index < 3 && (
                  <div
                    className={`h-[1px] w-8 transition-all duration-500 ${
                      activeStepIndex > step ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Compact Layout */}
        <div className="grid grid-cols-12 gap-3">
          {/* Left Side - Map */}
          <div
            className={`bg-white rounded-xl shadow-sm p-3 col-span-4 transition-all duration-500 transform ${
              activeStepIndex === 0
                ? "scale-100 opacity-100"
                : "scale-[0.98] opacity-90"
            }`}
          >
            <h2 className="text-lg font-light text-gray-700 mb-2 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs mr-2">
                1
              </span>
              აირჩიეთ რეგიონი
              {selectedRegion && (
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </h2>

            <div className="relative overflow-hidden rounded-lg group">
              {/* Map Container - Smaller size */}
              <div
                id="georgia-map-container"
                className="w-full h-[200px] transition-transform duration-700 ease-out transform group-hover:scale-[1.02]"
              ></div>
            </div>

            {/* Selected Region Information */}
            {selectedRegion && regionData[selectedRegion] && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: regionData[selectedRegion].color,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2 w-2 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-800">
                      {regionData[selectedRegion].nameGe}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {regionData[selectedRegion].nameEn}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 011.414 0L10 8.586l4.293-4.293a1 1 011.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Pinned Note - Side by side with map and activity */}
          <div className="col-span-3">
            <div className="relative h-full bg-amber-50 rounded-xl p-3 shadow-sm border border-amber-100 flex flex-col justify-center">
              {/* Pushpin - Smaller */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-5 h-5 bg-blue-500 rounded-full shadow-md flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                </div>
              </div>

              {/* Note Content - More compact */}
              <div className="pt-2 text-center text-gray-600 font-light">
                <p className="text-xs">ხელფასების კალკულატორი</p>
                <p className="text-xs">წარმოგიდგენთ დაქირავებით</p>
                <p className="text-xs">დასაქმებულთა საშუალო</p>
                <p className="text-xs">ნომინალური ხელფასის</p>
                <p className="text-xs">განაწილებების პორტალს</p>
                <p className="text-xs text-blue-500 font-medium">
                  აირჩიეთ რეგიონი, საქმიანობა, სქესი და წელი
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Activity Selection - More compact */}
          <div
            className={`bg-white rounded-xl shadow-sm p-3 col-span-5 transition-all duration-500 transform ${
              activeStepIndex === 1
                ? "scale-100 opacity-100"
                : activeStepIndex > 1
                ? "scale-[0.98] opacity-90"
                : "scale-[0.95] opacity-80"
            }`}
          >
            <h2 className="text-lg font-light text-gray-700 mb-2 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs mr-2">
                2
              </span>
              აირჩიეთ საქმიანობის სახე
              {selectedActivity && (
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </h2>

            <div className="grid grid-cols-2 gap-1 h-[230px] overflow-y-auto pr-1">
              {/* Activity Items - All industry sectors */}
              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity === "განათლება"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleActivitySelect("განათლება")}
                data-id="P"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/education.png"
                  alt="Education"
                />
                <div className="text-xs text-gray-700">განათლება</div>
                {selectedActivity === "განათლება" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity === "დამამუშავებელი მრეწველობა"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect("დამამუშავებელი მრეწველობა")
                }
                data-id="C"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/manufacturing.png"
                  alt="Manufacturing"
                />
                <div className="text-xs text-gray-700">
                  დამამუშავებელი მრეწველობა
                </div>
                {selectedActivity === "დამამუშავებელი მრეწველობა" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "ელექტროენერგიის, აირის, ორთქლის და კონდიცირებული ჰაერის მიწოდება"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "ელექტროენერგიის, აირის, ორთქლის და კონდიცირებული ჰაერის მიწოდება"
                  )
                }
                data-id="D"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/electricity.png"
                  alt="Electricity"
                />
                <div className="text-xs text-gray-700">
                  ელექტროენერგიის, აირის მიწოდება
                </div>
                {selectedActivity ===
                  "ელექტროენერგიის, აირის, ორთქლის და კონდიცირებული ჰაერის მიწოდება" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "საბითუმო და საცალო ვაჭრობა; ავტომობილების და მოტოციკლების რემონტი"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "საბითუმო და საცალო ვაჭრობა; ავტომობილების და მოტოციკლების რემონტი"
                  )
                }
                data-id="G"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/trade.png"
                  alt="Trade"
                />
                <div className="text-xs text-gray-700">
                  საბითუმო და საცალო ვაჭრობა
                </div>
                {selectedActivity ===
                  "საბითუმო და საცალო ვაჭრობა; ავტომობილების და მოტოციკლების რემონტი" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity === "მშენებლობა"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleActivitySelect("მშენებლობა")}
                data-id="F"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/construction.png"
                  alt="Construction"
                />
                <div className="text-xs text-gray-700">მშენებლობა</div>
                {selectedActivity === "მშენებლობა" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "უძრავ ქონებასთან დაკავშირებული საქმიანობები"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "უძრავ ქონებასთან დაკავშირებული საქმიანობები"
                  )
                }
                data-id="L"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/real-estate.png"
                  alt="Real Estate"
                />
                <div className="text-xs text-gray-700">
                  უძრავ ქონებასთან დაკავშირებული საქმიანობები
                </div>
                {selectedActivity ===
                  "უძრავ ქონებასთან დაკავშირებული საქმიანობები" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "სამთომოპოვებითი მრეწველობა და კარიერების დამუშავება"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "სამთომოპოვებითი მრეწველობა და კარიერების დამუშავება"
                  )
                }
                data-id="B"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/mining.png"
                  alt="Mining"
                />
                <div className="text-xs text-gray-700">
                  სამთომოპოვებითი მრეწველობა
                </div>
                {selectedActivity ===
                  "სამთომოპოვებითი მრეწველობა და კარიერების დამუშავება" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "განთავსების საშუალებებით უზრუნველყოფის და საკვების მიწოდების საქმიანობები"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "განთავსების საშუალებებით უზრუნველყოფის და საკვების მიწოდების საქმიანობები"
                  )
                }
                data-id="I"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/hotels.png"
                  alt="Hotels"
                />
                <div className="text-xs text-gray-700">
                  განთავსება და საკვების მიწოდება
                </div>
                {selectedActivity ===
                  "განთავსების საშუალებებით უზრუნველყოფის და საკვების მიწოდების საქმიანობები" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity === "საფინანსო და სადაზღვევო საქმიანობები"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect("საფინანსო და სადაზღვევო საქმიანობები")
                }
                data-id="K"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/financial.png"
                  alt="Financial"
                />
                <div className="text-xs text-gray-700">
                  საფინანსო და სადაზღვევო საქმიანობები
                </div>
                {selectedActivity ===
                  "საფინანსო და სადაზღვევო საქმიანობები" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "სახელმწიფო მმართველობა და თავდაცვა; სავალდებულო სოციალური უსაფრთხოება"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "სახელმწიფო მმართველობა და თავდაცვა; სავალდებულო სოციალური უსაფრთხოება"
                  )
                }
                data-id="O"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/public.png"
                  alt="Public Administration"
                />
                <div className="text-xs text-gray-700">
                  სახელმწიფო მმართველობა და თავდაცვა
                </div>
                {selectedActivity ===
                  "სახელმწიფო მმართველობა და თავდაცვა; სავალდებულო სოციალური უსაფრთხოება" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity === "სოფლის, სატყეო და თევზის მეურნეობა"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect("სოფლის, სატყეო და თევზის მეურნეობა")
                }
                data-id="A"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/agro.png"
                  alt="Agriculture"
                />
                <div className="text-xs text-gray-700">
                  სოფლის, სატყეო და თევზის მეურნეობა
                </div>
                {selectedActivity === "სოფლის, სატყეო და თევზის მეურნეობა" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify_center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity === "ტრანსპორტირება და დასაწყობება"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect("ტრანსპორტირება და დასაწყობება")
                }
                data-id="H"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/transport.png"
                  alt="Transport"
                />
                <div className="text-xs text-gray-700">
                  ტრანსპორტირება და დასაწყობება
                </div>
                {selectedActivity === "ტრანსპორტირება და დასაწყობება" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "ჯანდაცვა და სოციალური მომსახურების საქმიანობები"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "ჯანდაცვა და სოციალური მომსახურების საქმიანობები"
                  )
                }
                data-id="Q"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/health.png"
                  alt="Healthcare"
                />
                <div className="text-xs text-gray-700">
                  ჯანდაცვა და სოციალური მომსახურება
                </div>
                {selectedActivity ===
                  "ჯანდაცვა და სოციალური მომსახურების საქმიანობები" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "წყალმომარაგება; კანალიზაცია, ნარჩენების მართვა და დაბინძურებისაგან გასუფთავების საქმიანობები"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "წყალმომარაგება; კანალიზაცია, ნარჩენების მართვა და დაბინძურებისაგან გასუფთავების საქმიანობები"
                  )
                }
                data-id="E"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/water.png"
                  alt="Water Supply"
                />
                <div className="text-xs text-gray-700">
                  წყალმომარაგება და ნარჩენების მართვა
                </div>
                {selectedActivity ===
                  "წყალმომარაგება; კანალიზაცია, ნარჩენების მართვა და დაბინძურებისაგან გასუფთავების საქმიანობები" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity === "ინფორმაცია და კომუნიკაცია"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect("ინფორმაცია და კომუნიკაცია")
                }
                data-id="J"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/information.png"
                  alt="Information"
                />
                <div className="text-xs text-gray-700">
                  ინფორმაცია და კომუნიკაცია
                </div>
                {selectedActivity === "ინფორმაცია და კომუნიკაცია" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "პროფესიული, სამეცნიერო და ტექნიკური საქმიანობები"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "პროფესიული, სამეცნიერო და ტექნიკური საქმიანობები"
                  )
                }
                data-id="M"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/Professional.png"
                  alt="Professional"
                />
                <div className="text-xs text-gray-700">
                  პროფესიული, სამეცნიერო საქმიანობები
                </div>
                {selectedActivity ===
                  "პროფესიული, სამეცნიერო და ტექნიკური საქმიანობები" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items_center justify_center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity ===
                  "ადმინისტრაციული და დამხმარე მომსახურების საქმიანობები"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect(
                    "ადმინისტრაციული და დამხმარე მომსახურების საქმიანობები"
                  )
                }
                data-id="N"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/Administrative.png"
                  alt="Administrative"
                />
                <div className="text-xs text-gray-700">
                  ადმინისტრაციული საქმიანობები
                </div>
                {selectedActivity ===
                  "ადმინისტრაციული და დამხმარე მომსახურების საქმიანობები" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items_center justify_center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items_center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity === "ხელოვნება, გართობა და დასვენება"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleActivitySelect("ხელოვნება, გართობა და დასვენება")
                }
                data-id="R"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/Arts.png"
                  alt="Arts"
                />
                <div className="text-xs text-gray-700">
                  ხელოვნება, გართობა და დასვენება
                </div>
                {selectedActivity === "ხელოვნება, გართობა და დასვენება" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items_center justify_center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`flex items_center p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedActivity === "სხვა სახის მომსახურება"
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleActivitySelect("სხვა სახის მომსახურება")}
                data-id="S"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="/src/assets/icons/Other.png"
                  alt="Other Services"
                />
                <div className="text-xs text-gray-700">
                  სხვა სახის მომსახურება
                </div>
                {selectedActivity === "სხვა სახის მომსახურება" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items_center justify_center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2 w-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row for Year and Gender Selection */}
        <div className="mt-3 grid grid-cols-12 gap-3">
          {/* Year Selector - Smaller and more compact */}
          <div
            className={`bg-white p-3 rounded-xl shadow-sm col-span-6 transition-all duration-500 transform ${
              activeStepIndex >= 2
                ? "scale-100 opacity-100"
                : "scale-[0.95] opacity-80"
            }`}
          >
            <h2 className="text-lg font-light text-gray-700 mb-2 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs mr-2">
                3
              </span>
              აირჩიეთ წელი
              {selectedYear && (
                <button
                  onClick={() => setSelectedYear(null)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </h2>
            <div className="flex justify-center">
              <CircularYearSelector
                years={years}
                selectedYear={selectedYear}
                setSelectedYear={handleYearSelect}
              />
            </div>
          </div>

          {/* Gender Selector - More compact */}
          <div
            className={`bg-white p-3 rounded-xl shadow-sm col-span-6 transition-all duration-500 transform ${
              activeStepIndex >= 2
                ? "scale-100 opacity-100"
                : "scale-[0.95] opacity-80"
            }`}
          >
            <h2 className="text-lg font-light text-gray-700 mb-2 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs mr-2">
                4
              </span>
              აირჩიეთ სქესი
              {selectedGender && (
                <button
                  onClick={() => setSelectedGender(null)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </h2>
            <div className="flex justify-center gap-6">
              <div
                onClick={() => handleGenderSelect("female")}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  selectedGender === "female"
                    ? "bg-gradient-to-br from-pink-100/60 to-pink-50 shadow-sm"
                    : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    selectedGender === "female"
                      ? "bg-pink-500/20"
                      : "bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${
                      selectedGender === "female"
                        ? "text-pink-600"
                        : "text-gray-400"
                    }`}
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
                  className={`text-sm transition-all duration-200 ${
                    selectedGender === "female"
                      ? "text-pink-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  ქალი
                </span>
              </div>

              <div
                onClick={() => handleGenderSelect("male")}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  selectedGender === "male"
                    ? "bg-gradient-to-br from-blue-100/60 to-blue-50 shadow-sm"
                    : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    selectedGender === "male" ? "bg-blue-500/20" : "bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${
                      selectedGender === "male"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
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
                  className={`text-sm transition-all duration-200 ${
                    selectedGender === "male"
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  კაცი
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - More compact */}
        <div
          className={`mt-3 flex justify-center transition-all duration-700 transform ${
            allSelectionsComplete
              ? "scale-100 opacity-100"
              : "scale-95 opacity-60"
          }`}
        >
          <button
            className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg shadow hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2 group text-sm`}
            disabled={!allSelectionsComplete}
          >
            <span>გაანალიზება</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 010 1.414l-6 6a1 1 01-1.414-1.414L14.586 11H3a1 1 110-2h11.586l-4.293-4.293a1 1 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
