import React, { useState, useRef, useEffect, useCallback } from "react";
import georgiaMap from "../assets/svg/georgia.svg";
import CircularYearSelector from "./CircularYearSelector";
import { regionsApi } from "../services/api";
// Import all activity icons
import educationIcon from "../assets/icons/education.png";
import manufacturingIcon from "../assets/icons/manufacturing.png";
import electricityIcon from "../assets/icons/electricity.png";
import tradeIcon from "../assets/icons/trade.png";
import constructionIcon from "../assets/icons/construction.png";
import realEstateIcon from "../assets/icons/real-estate.png";
import miningIcon from "../assets/icons/mining.png";
import hotelsIcon from "../assets/icons/hotels.png";
import financialIcon from "../assets/icons/financial.png";
import publicIcon from "../assets/icons/public.png";
import agroIcon from "../assets/icons/agro.png";
import transportIcon from "../assets/icons/transport.png";
import healthIcon from "../assets/icons/health.png";
import waterIcon from "../assets/icons/water.png";
import informationIcon from "../assets/icons/information.png";
import professionalIcon from "../assets/icons/Professional.png";
import administrativeIcon from "../assets/icons/Administrative.png";
import artsIcon from "../assets/icons/Arts.png";
import otherIcon from "../assets/icons/Other.png";
import maleIcon from "../assets/icons/male.png";
import femaleIcon from "../assets/icons/female.png";

// Data configuration
const regionData = {
  "GE-AB": { nameEn: "Abkhazia", nameGe: "აფხაზეთი", color: "#7b818c" }, // Grey
  "GE-AJ": { nameEn: "Adjara", nameGe: "აჭარა", color: "#e08d30" }, // Orange
  "GE-GU": { nameEn: "Guria", nameGe: "გურია", color: "#5f8bd0" }, // Light blue
  "GE-IM": { nameEn: "Imereti", nameGe: "იმერეთი", color: "#9c6bbd" }, // Purple
  "GE-KA": { nameEn: "Kakheti", nameGe: "კახეთი", color: "#e14b69" }, // Red/Pink
  "GE-KK": { nameEn: "Kvemo Kartli", nameGe: "ქვემო ქართლი", color: "#67dbf9" }, // Cyan
  "GE-MM": {
    nameEn: "Mtskheta-Mtianeti",
    nameGe: "მცხეთა-მთიანეთი",
    color: "#a6e06c", // Light green
  },
  "GE-RL": {
    nameEn: "Racha-Lechkhumi",
    nameGe: "რაჭა-ლეჩხუმი",
    color: "#f3a659", // Pale orange
  },
  "GE-SJ": {
    nameEn: "Samtskhe-Javakheti",
    nameGe: "სამცხე-ჯავახეთი",
    color: "#9c9ca6", // Grey/Purple
  },
  "GE-SK": { nameEn: "Shida Kartli", nameGe: "შიდა ქართლი", color: "#7b818c" }, // Grey
  "GE-SZ": {
    nameEn: "Samegrelo-Zemo Svaneti",
    nameGe: "სამეგრელო-ზემო სვანეთი",
    color: "#6bd0a0", // Green
  },
  "GE-TB": { nameEn: "Tbilisi", nameGe: "თბილისი", color: "#f6cb45" }, // Yellow
};

const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

const activitySectors = [
  { id: "P", name: "განათლება", shortName: "განათლება", icon: educationIcon },
  {
    id: "C",
    name: "დამამუშავებელი მრეწველობა",
    shortName: "დამამუშავებელი მრეწველობა",
    icon: manufacturingIcon,
  },
  {
    id: "D",
    name: "ელექტროენერგიის, აირის, ორთქლის და კონდიცირებული ჰაერის მიწოდება",
    shortName: "ელექტროენერგიის, აირის მიწოდება",
    icon: electricityIcon,
  },
  {
    id: "G",
    name: "საბითუმო და საცალო ვაჭრობა; ავტომობილების და მოტოციკლების რემონტი",
    shortName: "საბითუმო და საცალო ვაჭრობა",
    icon: tradeIcon,
  },
  {
    id: "F",
    name: "მშენებლობა",
    shortName: "მშენებლობა",
    icon: constructionIcon,
  },
  {
    id: "L",
    name: "უძრავ ქონებასთან დაკავშირებული საქმიანობები",
    shortName: "უძრავ ქონებასთან დაკავშირებული საქმიანობები",
    icon: realEstateIcon,
  },
  {
    id: "B",
    name: "სამთომოპოვებითი მრეწველობა და კარიერების დამუშავება",
    shortName: "სამთომოპოვებითი მრეწველობა",
    icon: miningIcon,
  },
  {
    id: "I",
    name: "განთავსების საშუალებებით უზრუნველყოფის და საკვების მიწოდების საქმიანობები",
    shortName: "განთავსება და საკვების მიწოდება",
    icon: hotelsIcon,
  },
  {
    id: "K",
    name: "საფინანსო და სადაზღვევო საქმიანობები",
    shortName: "საფინანსო და სადაზღვევო საქმიანობები",
    icon: financialIcon,
  },
  {
    id: "O",
    name: "სახელმწიფო მმართველობა და თავდაცვა; სავალდებულო სოციალური უსაფრთხოება",
    shortName: "სახელმწიფო მმართველობა და თავდაცვა",
    icon: publicIcon,
  },
  {
    id: "A",
    name: "სოფლის, სატყეო და თევზის მეურნეობა",
    shortName: "სოფლის, სატყეო და თევზის მეურნეობა",
    icon: agroIcon,
  },
  {
    id: "H",
    name: "ტრანსპორტირება და დასაწყობება",
    shortName: "ტრანსპორტირება და დასაწყობება",
    icon: transportIcon,
  },
  {
    id: "Q",
    name: "ჯანდაცვა და სოციალური მომსახურების საქმიანობები",
    shortName: "ჯანდაცვა და სოციალური მომსახურება",
    icon: healthIcon,
  },
  {
    id: "E",
    name: "წყალმომარაგება; კანალიზაცია, ნარჩენების მართვა და დაბინძურებისაგან გასუფთავების საქმიანობები",
    shortName: "წყალმომარაგება და ნარჩენების მართვა",
    icon: waterIcon,
  },
  {
    id: "J",
    name: "ინფორმაცია და კომუნიკაცია",
    shortName: "ინფორმაცია და კომუნიკაცია",
    icon: informationIcon,
  },
  {
    id: "M",
    name: "პროფესიული, სამეცნიერო და ტექნიკური საქმიანობები",
    shortName: "პროფესიული, სამეცნიერო საქმიანობები",
    icon: professionalIcon,
  },
  {
    id: "N",
    name: "ადმინისტრაციული და დამხმარე მომსახურების საქმიანობები",
    shortName: "ადმინისტრაციული საქმიანობები",
    icon: administrativeIcon,
  },
  {
    id: "R",
    name: "ხელოვნება, გართობა და დასვენება",
    shortName: "ხელოვნება, გართობა და დასვენება",
    icon: artsIcon,
  },
  {
    id: "S",
    name: "სხვა სახის მომსახურება",
    shortName: "სხვა სახის მომსახურება",
    icon: otherIcon,
  },
];

// Reusable UI components
const StepHeading = ({ number, title, selected, onClear }) => (
  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm mr-3 shadow-md">
      {number}
    </span>
    {title}
    {selected && (
      <button
        onClick={onClear}
        className="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Clear selection"
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
);

const ActivityItem = ({ activity, isSelected, onSelect }) => (
  <div
    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
      isSelected
        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-sm"
        : "bg-white border-l-4 border-transparent hover:bg-gray-50"
    }`}
    onClick={() => onSelect(activity.name)}
    data-id={activity.id}
  >
    <div className={`w-8 h-8 rounded-lg mr-3 bg-gray-50 p-1.5 flex items-center justify-center transition-all duration-300 ${
      isSelected ? "bg-white shadow-sm scale-110" : ""
    }`}>
      <img
        className="w-full h-full object-contain transition-all duration-300"
        src={activity.icon}
        alt={activity.shortName}
      />
    </div>
    <div className={`text-xs ${isSelected ? "font-medium text-blue-700" : "text-gray-700"}`}>
      {activity.shortName}
    </div>
  </div>
);

const GenderSelector = ({ selectedGender, onGenderSelect }) => (
  <div className="flex justify-center gap-8">
    <div
      onClick={() => onGenderSelect("female")}
      className={`flex flex-col items-center p-4 rounded-2xl bg-white transition transform duration-300 cursor-pointer ${
        selectedGender === "female" 
          ? "shadow-lg scale-105" 
          : "hover:shadow-sm border border-transparent hover:border-pink-100"
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition transform duration-300 ${
          selectedGender === "female" 
            ? "bg-gradient-to-br from-pink-100 to-pink-200 scale-110 shadow-inner" 
            : "bg-gray-50"
        }`}
      >
        <img 
          className={`w-9 h-9 transition-all duration-300 ${
            selectedGender === "female" ? "scale-110" : ""
          }`} 
          src={femaleIcon} 
          alt="Female Icon" 
        />
      </div>
      <span
        className={`text-sm font-medium transition-all duration-200 ${
          selectedGender === "female"
            ? "text-pink-600"
            : "text-gray-500"
        }`}
      >
        ქალი
      </span>
    </div>

    <div
      onClick={() => onGenderSelect("male")}
      className={`flex flex-col items-center p-4 rounded-2xl bg-white transition transform duration-300 cursor-pointer ${
        selectedGender === "male" 
          ? "shadow-lg scale-105" 
          : "hover:shadow-sm border border-transparent hover:border-blue-100"
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition transform duration-300 ${
          selectedGender === "male" 
            ? "bg-gradient-to-br from-blue-100 to-blue-200 scale-110 shadow-inner" 
            : "bg-gray-50"
        }`}
      >
        <img 
          className={`w-9 h-9 transition-all duration-300 ${
            selectedGender === "male" ? "scale-110" : ""
          }`} 
          src={maleIcon} 
          alt="Male Icon" 
        />
      </div>
      <span
        className={`text-sm font-medium transition-all duration-200 ${
          selectedGender === "male"
            ? "text-blue-600"
            : "text-gray-500"
        }`}
      >
        კაცი
      </span>
    </div>
  </div>
);

// Main component
const Dashboard = ({ language = "GE" }) => {
  // State for selections
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [_salaryData, setSalaryData] = useState(null);
  const [error, setError] = useState(null);

  // Reference to the SVG element
  const svgRef = useRef(null);

  // Function to handle region click
  const handleRegionClick = useCallback((id) => setSelectedRegion((prev) => (prev === id ? null : id)), []);

  // Function to handle region hover
  const handleRegionHover = (id) => setHoveredRegion(id);

  // Function to handle activity selection with toggle capability
  const handleActivitySelect = (activity) => {
    setSelectedActivity(selectedActivity === activity ? null : activity);
  };

  // Function to handle year selection with toggle capability
  const handleYearSelect = (year) => {
    setSelectedYear(selectedYear === year ? null : year);
  };

  // Function to handle gender selection with toggle capability
  const handleGenderSelect = (gender) => {
    setSelectedGender(selectedGender === gender ? null : gender);
  };

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
    const loadSvg = async () => {
      try {
        const response = await fetch(georgiaMap);
        const svgText = await response.text();

        const mapContainer = document.getElementById("georgia-map-container");
        if (!mapContainer) return;

        mapContainer.innerHTML = svgText;
        const svgElement = mapContainer.querySelector("svg");
        svgRef.current = svgElement;

        if (svgElement) {
          // Set SVG attributes
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

          if (!svgElement.getAttribute("viewBox")) {
            const bbox = svgElement.getBBox();
            const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
            svgElement.setAttribute("viewBox", viewBox);
          }          // Add styles
          const style = document.createElement("style");
          style.textContent = `
            #georgia-map-container svg path {
              stroke: white !important;
              stroke-width: 0.5 !important;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
              cursor: pointer !important;
              opacity: 0.9 !important;
              filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.05)) !important;
            }
            #georgia-map-container svg path:hover {
              opacity: 1 !important;
              stroke-width: 1 !important;
              stroke: white !important;
              filter: brightness(1.05) saturate(1.2) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1)) !important;
              transform: translateY(-1px) !important;
            }
            #georgia-map-container svg path.selected {
              stroke-width: 1.5 !important;
              stroke: white !important;
              filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.1)) !important;
              opacity: 1 !important;
              transform: translateY(-2px) !important;
            }#georgia-map-container svg .region-label {
              font-family: 'FiraGO', sans-serif !important;
              font-size: 11px !important;
              font-weight: 500 !important;
              fill: white !important;
              text-anchor: middle !important;
              pointer-events: none !important;
              opacity: 0 !important;
              transition: all 0.3s ease !important;
              text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2) !important;
            }
            #georgia-map-container svg path:hover + .region-label,
            #georgia-map-container svg path.selected + .region-label {
              opacity: 1 !important;
              transform: translateY(-1px) !important;
            }
          `;

          svgElement.appendChild(style);          // Apply colors to regions and add event listeners
          const paths = svgElement.querySelectorAll("path");
          paths.forEach((path) => {
            const id = path.getAttribute("id");
            if (id && regionData[id]) {
              // Set fill color with inline style for highest specificity
              path.setAttribute("fill", regionData[id].color);
              path.style.fill = regionData[id].color + " !important";

              const title = path.querySelector("title");
              if (title) {
                title.textContent = regionData[id].nameGe;
              }

              // Add region labels
              const bbox = path.getBBox();
              const labelX = bbox.x + bbox.width / 2;
              const labelY = bbox.y + bbox.height / 2;

              const label = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
              );
              label.setAttribute("class", "region-label");
              label.setAttribute("x", labelX);
              label.setAttribute("y", labelY);
              label.textContent = regionData[id].nameGe;

              path.parentNode.insertBefore(label, path.nextSibling);

              // Add event listeners
              path.addEventListener("click", () => handleRegionClick(id));
              path.addEventListener("mouseenter", () => handleRegionHover(id));
              path.addEventListener("mouseleave", () => setHoveredRegion(null));
            }
          });
        }
      } catch (error) {
        console.error("Failed to load or process the SVG:", error);
        setError("Failed to load map data");
      }
    };

    loadSvg();

    return () => {
      const mapContainer = document.getElementById("georgia-map-container");
      if (mapContainer) {
        mapContainer.innerHTML = "";
      }
    };
  }, [handleRegionClick]);  // Effect to update selected/hovered state
  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      const id = path.getAttribute("id");
      if (!id || !regionData[id]) return;

      // Handle selected state
      if (id === selectedRegion) {
        path.classList.add("selected");
        // For additional specificity, add inline style as well
        path.style.fill = regionData[id].color + " !important";  // Maintain original color
        path.style.strokeWidth = "1.5px";
        path.style.stroke = "white";
        path.style.filter = "drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))";
        path.style.opacity = "1";
        path.style.transform = "translateY(-2px)";
      } else {
        path.classList.remove("selected");
        // Reset inline styles when not selected, but maintain color
        path.style.fill = regionData[id].color + " !important";
        path.style.strokeWidth = "0.5px";
        path.style.stroke = "white";
        path.style.filter = "drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.05))";
        path.style.opacity = "0.9";
        path.style.transform = "";
      }

      // Handle hover state
      if (id === hoveredRegion) {
        path.style.filter = "brightness(1.1) saturate(1.2) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))";
        path.style.transform = "translateY(-1px)";
        path.style.opacity = "1";
        path.style.strokeWidth = "1px";
      } else if (id !== selectedRegion) {
        // Only remove these styles if not the selected region
        path.style.filter = "drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.05))";
        path.style.transform = "";
        path.style.opacity = "0.9";
        path.style.strokeWidth = "0.5px";
      }
    });
  }, [selectedRegion, hoveredRegion]);

  // Fetch salary data when all selections are made and user clicks analyze
  const fetchSalaryData = async () => {
    if (
      !selectedRegion ||
      !selectedActivity ||
      !selectedYear ||
      !selectedGender
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Here you would make an API call with the selected parameters
      // For now, we'll use the regions API as a placeholder
      const data = await regionsApi.getByRegionId(
        selectedRegion.replace("GE-", "")
      );
      setSalaryData(data);

      // Navigate to results view or show results modal
      console.log("Analysis data:", data);
    } catch (err) {
      console.error("Failed to fetch salary data:", err);
      setError("Failed to fetch salary data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if all selections are made
  const allSelectionsComplete =
    selectedRegion && selectedActivity && selectedYear && selectedGender;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6 font-sans overflow-auto">
      <div className="container mx-auto px-2 md:px-4">
        {/* Progress Steps */}
        <div className="flex justify-center mb-6">
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm">
            {[0, 1, 2, 3].map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full transition-all duration-500 ${
                    activeStepIndex >= step 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-500 shadow-md" 
                      : "bg-gray-200"
                  }`}
                ></div>
                {index < 3 && (
                  <div
                    className={`h-[2px] w-10 transition-all duration-500 ${
                      activeStepIndex > step ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Compact Layout with card design */}
        <div className="grid grid-cols-12 gap-4 md:gap-5">
          {/* Left Side - Map */}
          <div
            className={`bg-white rounded-2xl shadow-md p-4 col-span-12 md:col-span-4 transition-all duration-500 transform ${
              activeStepIndex === 0
                ? "scale-100 opacity-100 ring-2 ring-blue-200"
                : "scale-[0.98] opacity-90"
            }`}
          >
            <StepHeading
              number={1}
              title={language === "GE" ? "აირჩიეთ რეგიონი" : "Choose Region"}
              selected={selectedRegion}
              onClear={() => setSelectedRegion(null)}
            />

            <div className="relative overflow-hidden rounded-xl group bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner p-2">
              {/* Map Container */}
              <div
                id="georgia-map-container"
                className="w-full h-[250px] transition-transform duration-700 ease-out transform group-hover:scale-[1.02]"
              ></div>
            </div>

            {/* Selected Region Information */}
            {selectedRegion && regionData[selectedRegion] && (
              <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-100 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner"
                    style={{
                      backgroundColor: regionData[selectedRegion].color,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white drop-shadow"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {regionData[selectedRegion].nameGe}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {regionData[selectedRegion].nameEn}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  aria-label="Clear region selection"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 011.414 0L10 8.586l4.293-4.293a1 1 011.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Pinned Note */}
          <div className="col-span-12 md:col-span-3">
            <div className="relative h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 shadow-md border border-amber-100 flex flex-col justify-center">
              {/* Pushpin */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-blue-300 rounded-full"></div>
                </div>
              </div>

              {/* Note Content */}
              <div className="pt-4 text-center">
                <h3 className="text-lg font-semibold mb-2 text-amber-800">
                  {language === "GE" ? "ხელფასების კალკულატორი" : "Salary Calculator"}
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="text-sm">
                    {language === "GE"
                      ? "წარმოგიდგენთ დაქირავებით დასაქმებულთა საშუალო ნომინალური ხელფასის განაწილებების პორტალს"
                      : "Presents employee average nominal salary distribution portal"}
                  </p>
                  <div className="pt-3 flex justify-center">
                    <div className="px-4 py-2 rounded-lg bg-white shadow-sm">
                      <p className="text-sm text-blue-600 font-medium">
                        {language === "GE"
                          ? "აირჩიეთ რეგიონი, საქმიანობა, სქესი და წელი"
                          : "Choose region, activity, gender and year"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Activity Selection */}
          <div
            className={`bg-white rounded-2xl shadow-md p-4 col-span-12 md:col-span-5 transition-all duration-500 transform ${
              activeStepIndex === 1
                ? "scale-100 opacity-100 ring-2 ring-blue-200"
                : activeStepIndex > 1
                ? "scale-[0.98] opacity-90"
                : "scale-[0.95] opacity-80"
            }`}
          >
            <StepHeading
              number={2}
              title={
                language === "GE"
                  ? "აირჩიეთ საქმიანობის სახე"
                  : "Choose Activity"
              }
              selected={selectedActivity}
              onClear={() => setSelectedActivity(null)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-[255px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Activity Items - All industry sectors */}
              {activitySectors.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  isSelected={selectedActivity === activity.name}
                  onSelect={handleActivitySelect}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row for Year and Gender Selection */}
        <div className="mt-5 grid grid-cols-12 gap-4 md:gap-5">
          {/* Year Selector */}
          <div
            className={`bg-white p-4 rounded-2xl shadow-md col-span-12 md:col-span-6 transition-all duration-500 transform ${
              activeStepIndex >= 2
                ? "scale-100 opacity-100 ring-2 ring-blue-200"
                : "scale-[0.95] opacity-80"
            }`}
          >
            <StepHeading
              number={3}
              title={language === "GE" ? "აირჩიეთ წელი" : "Choose Year"}
              selected={selectedYear}
              onClear={() => setSelectedYear(null)}
            />
            <div className="flex justify-center mt-2">
              <CircularYearSelector
                years={years}
                selectedYear={selectedYear}
                setSelectedYear={handleYearSelect}
              />
            </div>
          </div>

          {/* Gender Selector */}
          <div
            className={`bg-white p-4 rounded-2xl shadow-md col-span-12 md:col-span-6 transition-all duration-500 transform ${
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
            <div className="mt-4">
              <GenderSelector
                selectedGender={selectedGender}
                onGenderSelect={handleGenderSelect}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div
          className={`mt-8 mb-2 flex justify-center transition-all duration-700 transform ${
            allSelectionsComplete
              ? "scale-100 opacity-100"
              : "scale-95 opacity-60"
          }`}
        >
          <button
            className={`px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 group text-base font-medium`}
            disabled={!allSelectionsComplete || isLoading}
            onClick={fetchSalaryData}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>
                  {language === "GE" ? "დამუშავება..." : "Processing..."}
                </span>
              </>
            ) : (
              <>
                <span>{language === "GE" ? "გაანალიზება" : "Analyze"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm text-center rounded-xl shadow-sm border border-red-100 animate-fadeIn">
            <div className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
