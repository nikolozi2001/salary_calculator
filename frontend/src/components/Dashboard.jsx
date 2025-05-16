import React, { useState, useRef, useEffect, useCallback } from "react";
import georgiaMap from "../assets/svg/georgia.svg";
import CircularYearSelector from "./CircularYearSelector";
import Activity from "./ui/Activity";
import Gender from "./ui/Gender";
import Note from "./ui/Note";
import { dataApi } from "../services/api";
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
// eslint-disable-next-line no-unused-vars
import informationIcon from "../assets/icons/information.png";
// eslint-disable-next-line no-unused-vars
import professionalIcon from "../assets/icons/Professional.png";
// eslint-disable-next-line no-unused-vars
import administrativeIcon from "../assets/icons/Administrative.png";
// eslint-disable-next-line no-unused-vars
import artsIcon from "../assets/icons/Arts.png";
// eslint-disable-next-line no-unused-vars
import otherIcon from "../assets/icons/Other.png";
// eslint-disable-next-line no-unused-vars
import maleIcon from "../assets/icons/male.png";
// eslint-disable-next-line no-unused-vars
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

// Mapping from GE-XX codes to numerical region IDs for database queries
const regionIdMap = {
  GE: "0", // საქართველო
  "GE-TB": "11", // ქ. თბილისი
  "GE-AJ": "15", // აჭარის ა.რ.
  "GE-GU": "23", // გურია
  "GE-IM": "26", // იმერეთი
  "GE-KA": "29", // კახეთი
  "GE-MM": "32", // მცხეთა-მთიანეთ
  "GE-RL": "35", // რაჭა-ლეჩხუმი და ქვემო სვანეთი
  "GE-SZ": "38", // სამეგრელო-ზემო სვანეთი
  "GE-SJ": "41", // სამცხე-ჯავახეთი
  "GE-KK": "44", // ქვემო ქართლი
  "GE-SK": "47", // შიდა ქართლი
  "GE-AB": "00", // აფხაზეთი
};

const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

const activitySectors = [
  {
    id: "A",
    name: "სოფლის მეურნეობა. ნადირობა და სატყეო მეურნეობა",
    shortName: "სოფლის მეურნეობა",
    icon: agroIcon,
  },
  {
    id: "B",
    name: "თევზჭერა, მეთევზეობა",
    shortName: "თევზჭერა, მეთევზეობა",
    icon: miningIcon,
  },
  {
    id: "C",
    name: "სამთომოპოვებითი მრეწველობა",
    shortName: "სამთომოპოვებითი მრეწველობა",
    icon: miningIcon,
  },
  {
    id: "D",
    name: "დამამუშავებელი მრეწველობა",
    shortName: "დამამუშავებელი მრეწველობა",
    icon: manufacturingIcon,
  },
  {
    id: "E",
    name: "ელექტროენერგიის, აირისა და წყლის წარმოება და განაწილება",
    shortName: "ელექტროენერგია, აირი და წყალი",
    icon: electricityIcon,
  },
  {
    id: "F",
    name: "მშენებლობა",
    shortName: "მშენებლობა",
    icon: constructionIcon,
  },
  {
    id: "G",
    name: "ვაჭრობა; ავტომობილების, საყოფაცხოვრებო ნაწარმისა და პირადი მოხმარების საგნების რემონტი",
    shortName: "ვაჭრობა და რემონტი",
    icon: tradeIcon,
  },
  {
    id: "H",
    name: "სასტუმროები და რესტორნები",
    shortName: "სასტუმროები და რესტორნები",
    icon: hotelsIcon,
  },
  {
    id: "I",
    name: "ტრანსპორტი და კავშირგაბმულობა",
    shortName: "ტრანსპორტი და კავშირგაბმულობა",
    icon: transportIcon,
  },
  {
    id: "J",
    name: "საფინანსო საქმიანობა",
    shortName: "საფინანსო საქმიანობა",
    icon: financialIcon,
  },
  {
    id: "K",
    name: "ოპერაციები უძრავი ქონებით, იჯარა და მომხმარებლი-სათვის მომსახურების გაწევა",
    shortName: "უძრავი ქონება და იჯარა",
    icon: realEstateIcon,
  },
  {
    id: "L",
    name: "სახელმწიფო მმართველობა",
    shortName: "სახელმწიფო მმართველობა",
    icon: publicIcon,
  },
  {
    id: "M",
    name: "განათლება",
    shortName: "განათლება",
    icon: educationIcon,
  },
  {
    id: "N",
    name: "ჯანმრთელობის დაცვა და სოციალური დახმარება",
    shortName: "ჯანდაცვა და სოციალური დახმარება",
    icon: healthIcon,
  },
  {
    id: "O",
    name: "კომუნალური, სოციალური და პერსონალური მომსახურების გაწევა",
    shortName: "კომუნალური მომსახურება",
    icon: waterIcon,
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
    <div
      className={`w-8 h-8 rounded-lg mr-3 bg-gray-50 p-1.5 flex items-center justify-center transition-all duration-300 ${
        isSelected ? "bg-white shadow-sm scale-110" : ""
      }`}
    >
      <img
        className="w-full h-full object-contain transition-all duration-300"
        src={activity.icon}
        alt={activity.shortName}
      />
    </div>
    <div
      className={`text-xs ${
        isSelected ? "font-medium text-blue-700" : "text-gray-700"
      }`}
    >
      {activity.shortName}
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
  // These variables were used with the removed button
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [salaryData, setSalaryData] = useState(null);
  const [totalSalary, setTotalSalary] = useState(null);
  const [error, setError] = useState(null);

  // Reference to the SVG element
  const svgRef = useRef(null);
  // Function to handle region click - updates with numerical ID from mapping
  const handleRegionClick = useCallback((id) => {
    setSelectedRegion((prev) => {
      const numericId = regionIdMap[id];
      return prev === numericId ? null : numericId;
    });
  }, []);

  // Function to handle region hover - still using the GE-XX format for hovering
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

  // Helper function to get GE-XX code from a numeric region ID
  const getGeCodeFromRegionId = (numericId) => {
    return Object.keys(regionIdMap).find(
      (key) => regionIdMap[key] === numericId
    );
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

  // Effect to automatically update salary data when selections change
  useEffect(() => {
    const updateSalaryInfo = async () => {
      // Case 1: Only selectedYear is provided
      if (selectedYear && !selectedRegion && !selectedActivity) {
        try {
          // Default to regionId="0" (Georgia) and activityId="AA" (All activities)
          let totalSalaryValue;
          if (selectedGender) {
            // If gender is selected, get gender-specific salary
            totalSalaryValue = await dataApi.getGenderSalary(
              selectedYear,
              "0", // Georgia (All)
              "AA", // All activities
              selectedGender
            );
          } else {
            // Otherwise get the total salary
            totalSalaryValue = await dataApi.getTotalSalary(
              selectedYear,
              "0", // Georgia (All)
              "AA" // All activities
            );
          }

          setTotalSalary(totalSalaryValue);
          setError(null);
        } catch (totalError) {
          console.error(
            "Failed to fetch salary data (default values):",
            totalError
          );
          setTotalSalary(null);
        }
        return;
      } // Case 2: selectedYear and selectedActivity but no region
      if (selectedYear && !selectedRegion && selectedActivity) {
        try {
          // Find the selected activity's ID from activitySectors
          const activityId = activitySectors.find(
            (activity) => activity.name === selectedActivity
          )?.id;

          if (!activityId) {
            return;
          }

          // Default to regionId="0" (Georgia) with the selected activity
          let totalSalaryValue;
          if (selectedGender) {
            // If gender is selected, get gender-specific salary
            totalSalaryValue = await dataApi.getGenderSalary(
              selectedYear,
              "0", // Georgia (All)
              activityId,
              selectedGender
            );
          } else {
            // Otherwise get the total salary
            totalSalaryValue = await dataApi.getTotalSalary(
              selectedYear,
              "0", // Georgia (All)
              activityId
            );
          }

          setTotalSalary(totalSalaryValue);
          setError(null);
        } catch (totalError) {
          console.error(
            "Failed to fetch total salary with default region:",
            totalError
          );
          setTotalSalary(null);
        }
        return;
      } // Case 3: Both selectedYear and selectedRegion are provided but no activity
      if (selectedYear && selectedRegion && !selectedActivity) {
        try {
          // Use the selected region but default to activityId="AA" (All activities)
          let totalSalaryValue;
          if (selectedGender) {
            // If gender is selected, get gender-specific salary
            totalSalaryValue = await dataApi.getGenderSalary(
              selectedYear,
              selectedRegion,
              "AA", // All activities
              selectedGender
            );
          } else {
            // Otherwise get the total salary
            totalSalaryValue = await dataApi.getTotalSalary(
              selectedYear,
              selectedRegion,
              "AA" // All activities
            );
          }

          setTotalSalary(totalSalaryValue);
          setError(null);
        } catch (totalError) {
          console.error(
            "Failed to fetch total salary with default activity:",
            totalError
          );
          setTotalSalary(null);
        }
        return;
      } // Case 3: All selections are provided
      if (selectedYear && selectedRegion && selectedActivity) {
        try {
          // Find the selected activity's ID from activitySectors
          const activityId = activitySectors.find(
            (activity) => activity.name === selectedActivity
          )?.id;

          if (!activityId) {
            return;
          }

          // Get the salary data based on gender selection
          let totalSalaryValue;
          if (selectedGender) {
            // If gender is selected, get gender-specific salary
            totalSalaryValue = await dataApi.getGenderSalary(
              selectedYear,
              selectedRegion,
              activityId,
              selectedGender
            );
          } else {
            // Otherwise get the total salary
            totalSalaryValue = await dataApi.getTotalSalary(
              selectedYear,
              selectedRegion,
              activityId
            );
          }

          setTotalSalary(totalSalaryValue);
          // Clear any previous errors when successful
          setError(null);
        } catch (totalError) {
          console.error("Failed to fetch total salary:", totalError);
          setTotalSalary(null);

          // Don't display errors in the automatic update since we're not doing a user-initiated action
          // Just silently fail
        }
      }
    };

    updateSalaryInfo();
  }, [selectedRegion, selectedActivity, selectedYear, selectedGender]);

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
          } // Add styles
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

          svgElement.appendChild(style); // Apply colors to regions and add event listeners
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
  }, [handleRegionClick]); // Effect to update selected/hovered state
  useEffect(() => {
    if (!svgRef.current) return; // Find the GE-XX code that corresponds to the selected region number
    const selectedGeCode = getGeCodeFromRegionId(selectedRegion);

    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      const id = path.getAttribute("id");
      if (!id || !regionData[id]) return;

      // Handle selected state
      if (id === selectedGeCode) {
        path.classList.add("selected");
        // For additional specificity, add inline style as well
        path.style.fill = regionData[id].color + " !important"; // Maintain original color
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
        path.style.filter =
          "brightness(1.1) saturate(1.2) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))";
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

  // We've removed the button that used these functions and variables,
  // but we're keeping the code as it may be needed later if button is restored
  // eslint-disable-next-line no-unused-vars
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
      const regionId = selectedRegion;

      const activityId = activitySectors.find(
        (activity) => activity.name === selectedActivity
      )?.id;

      if (!activityId) {
        throw new Error(`Activity ID not found for ${selectedActivity}`);
      }

      const response = await dataApi.getDataByYearAndRegion(
        selectedYear,
        regionId
      );
      try {
        // Get salary based on gender selection
        let totalSalaryValue;

        if (selectedGender) {
          // If gender is selected, get gender-specific salary
          const genderData = await dataApi.getGenderSpecificSalary(
            selectedGender,
            selectedYear,
            regionId,
            activityId
          );
          totalSalaryValue = genderData.total;
        } else {
          // Otherwise get the total salary
          totalSalaryValue = await dataApi.getTotalSalary(
            selectedYear,
            regionId,
            activityId
          );
        }

        setTotalSalary(totalSalaryValue);
      } catch (totalError) {
        console.error("Failed to fetch total salary:", totalError);
        setTotalSalary(null);

        if (totalError.response && totalError.response.status === 404) {
          setError(
            `${
              language === "GE" ? "მონაცემები არ მოიძებნა" : "No data found"
            } (${selectedYear}, ${regionId}, ${activityId})`
          );
        } else {
          setError(
            `${
              language === "GE"
                ? "მონაცემების მიღების შეცდომა"
                : "Error fetching data"
            }`
          );
        }
      }

      setSalaryData(response);
      console.log("Analysis data:", response);
      console.log("Selected parameters:", {
        regionId: selectedRegion,
        regionCode: getGeCodeFromRegionId(selectedRegion),
        activity: selectedActivity,
        activityId,
        year: selectedYear,
        gender: selectedGender,
      });
    } catch (err) {
      console.error("Failed to fetch salary data:", err);
      setError("Failed to fetch salary data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
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
            </div>{" "}
            {/* Selected Region Information */}
            {selectedRegion && (
              <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-100 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-3">
                  {" "}
                  {/* Find the GE-XX code that maps to this numeric ID */}
                  {(() => {
                    const geCode = getGeCodeFromRegionId(selectedRegion);
                    if (geCode && regionData[geCode]) {
                      return (
                        <>
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner"
                            style={{
                              backgroundColor: regionData[geCode].color,
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
                              {regionData[geCode].nameGe}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {regionData[geCode].nameEn} (ID: {selectedRegion})
                            </p>
                          </div>
                        </>
                      );
                    }
                    return <div>Region ID: {selectedRegion}</div>;
                  })()}
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
            )}{" "}
          </div>{" "}
          {/* Pinned Note */}
          <Note
            language={language}
            selectedYear={selectedYear}
            selectedRegion={selectedRegion}
            selectedActivity={selectedActivity}
            totalSalary={totalSalary}
            activitySectors={activitySectors}
            regionData={regionData}
            getGeCodeFromRegionId={getGeCodeFromRegionId}
          />{" "}
          {/* Right Side - Activity Selection */}
          <Activity
            activeStepIndex={activeStepIndex}
            language={language}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            activitySectors={activitySectors}
            handleActivitySelect={handleActivitySelect}
          />
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
          </div>{" "}
          {/* Gender Selector */}
          <Gender
            activeStepIndex={activeStepIndex}
            language={language}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            handleGenderSelect={handleGenderSelect}
          />
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
