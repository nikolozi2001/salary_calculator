import React, { useState, useRef, useEffect, useCallback } from "react";
import georgiaMap from "../assets/svg/georgia.svg";
import circleMap from "../assets/svg/circle.svg";
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
  const handleYearSelect = useCallback((year) => {
    setSelectedYear(prev => prev === year ? null : year);
  }, []);
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

  // Effect to handle SVG loading and manipulation
  useEffect(() => {
    const loadCircleSvg = async () => {
      try {
        const response = await fetch(circleMap);
        const svgText = await response.text();

        const circleContainer = document.getElementById("circle-svg-container");
        if (!circleContainer) return;

        circleContainer.innerHTML = svgText;
        const circleSvg = circleContainer.querySelector("svg");

        if (circleSvg) {
          circleSvg.setAttribute("width", "100%");
          circleSvg.setAttribute("height", "100%");
          circleSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");

          // Add styles for active year
          const style = document.createElement("style");
          style.textContent = `
            path.activeYear {
              fill: #C85861 !important;
            }
          `;
          circleSvg.appendChild(style);

          // Add click handlers for year selection
          const paths = circleSvg.querySelectorAll("path[data-year]");
          paths.forEach((path) => {
            const year = parseInt(path.getAttribute("data-year"), 10);

            // Highlight selected year
            if (selectedYear === year) {
              path.classList.add("activeYear");
              path.style.filter = "drop-shadow(0 4px 3px rgb(0, 0, 0 / 0.1))";
              // path.style.transform = "scale(1.05)";
            } else {
              path.classList.remove("activeYear");
            }

            // Add click handler
            path.addEventListener("click", () => handleYearSelect(year));

            // Add hover effects
            path.addEventListener("mouseenter", () => {
              if (selectedYear !== year) {
                path.style.filter = "brightness(1.1) saturate(1.2)";
                // path.style.transform = "scale(1.02)";
              }
            });

            path.addEventListener("mouseleave", () => {
              if (selectedYear !== year) {
                path.style.filter = "";
                path.style.transform = "";
              }
            });
          });
        }
      } catch (error) {
        console.error("Failed to load or process the circle SVG:", error);
      }
    };

    loadCircleSvg();

    return () => {
      const circleContainer = document.getElementById("circle-svg-container");
      if (circleContainer) {
        circleContainer.innerHTML = "";
      }
    };
  }, [selectedYear, handleYearSelect]);

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
    <div className="min-h-screen p-4 md:p-6 font-sans overflow-auto">
      {" "}
      <div className="container mx-auto px-2 md:px-4">
        {/* Main Content - Compact Layout with card design */}
        <div className="grid grid-cols-12 gap-4 md:gap-5">
          {/* Left Side - Map */}{" "}
          <div className="rounded-2xl p-4 col-span-12 md:col-span-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {language === "GE" ? "აირჩიეთ რეგიონი" : "Choose Region"}
              </h2>
            </div>{" "}
            <div className="relative overflow-hidden rounded-xl group p-2">
              {" "}
              {/* Map Container */}{" "}
              <div
                id="georgia-map-container"
                className="w-full h-[400px] transition-transform duration-700 ease-out transform group-hover:scale-[1.02]"
              ></div>
            </div>{" "}
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
            language={language}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            activitySectors={activitySectors}
            handleActivitySelect={handleActivitySelect}
          />
        </div>
        {/* Bottom Row for Year and Gender Selection */}{" "}
        <div className="mt-8 grid grid-cols-12 gap-6 md:gap-8">
          {/* Year Selector */}          <div className="p-4 rounded-2xl col-span-12 md:col-span-6">
            <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
              <div
                id="circle-svg-container"
                className="w-[400px] h-[400px] transition-all duration-300 ease-in-out"
              ></div>
            </div>
          </div>{" "}
          {/* Gender Selector */}
          <Gender
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
