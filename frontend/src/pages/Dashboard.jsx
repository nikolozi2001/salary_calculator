import React, { useState, useRef, useEffect, useCallback } from "react";
import georgiaMap from "../assets/svg/georgia.svg";
import circleMap from "../assets/svg/circle.svg";
import Activity from "../components/ui/Activity";
import Gender from "../components/ui/Gender";
import Note from "../components/ui/Note";
import { dataApi, activityApi } from "../services/api";

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
import professionalIcon from "/src/assets/icons/professional.png";
import administrativeIcon from "../assets/icons/Administrative.png";
import artsIcon from "../assets/icons/arts.png";
import otherIcon from "../assets/icons/other.png";

// Create an icon map
const iconMap = {
  educationIcon: educationIcon,
  manufacturingIcon: manufacturingIcon,
  electricityIcon: electricityIcon,
  tradeIcon: tradeIcon,
  constructionIcon: constructionIcon,
  realEstateIcon: realEstateIcon,
  miningIcon: miningIcon,
  hotelsIcon: hotelsIcon,
  financialIcon: financialIcon,
  publicIcon: publicIcon,
  agroIcon: agroIcon,
  transportIcon: transportIcon,
  healthIcon: healthIcon,
  waterIcon: waterIcon,
  informationIcon: informationIcon,
  professionalIcon: professionalIcon,
  administrationIcon: administrativeIcon,
  artsIcon: artsIcon,
  otherIcon: otherIcon,
};

// Data configuration
const regionData = {
  "GE-AB": { nameEn: "Abkhazia", nameGe: "აფხაზეთი", color: "#7b818c" },
  "GE-TS": {
    nameEn: "Tskhinvali Region",
    nameGe: "ცხინვალის რეგიონი",
    color: "#7b818c",
  },
  "GE-AJ": { nameEn: "Adjara", nameGe: "აჭარა", color: "#ce8d34" },
  "GE-GU": { nameEn: "Guria", nameGe: "გურია", color: "#6ea76f" },
  "GE-IM": { nameEn: "Imereti", nameGe: "იმერეთი", color: "#c85861" },
  "GE-KA": { nameEn: "Kakheti", nameGe: "კახეთი", color: "#c85861" },
  "GE-KK": { nameEn: "Kvemo Kartli", nameGe: "ქვემო ქართლი", color: "#6ea76f" },
  "GE-MM": {
    nameEn: "Mtskheta-Mtianeti",
    nameGe: "მცხეთა-მთიანეთი",
    color: "#9e6e9c",
  },
  "GE-RL": {
    nameEn: "Racha-Lechkhumi",
    nameGe: "რაჭა-ლეჩხუმი",
    color: "#ce8d34",
  },
  "GE-SJ": {
    nameEn: "Samtskhe-Javakheti",
    nameGe: "სამცხე-ჯავახეთი",
    color: "#9e6e9c",
  },
  "GE-SK": { nameEn: "Shida Kartli", nameGe: "შიდა ქართლი", color: "#678dac" },
  "GE-SZ": {
    nameEn: "Samegrelo-Zemo Svaneti",
    nameGe: "სამეგრელო-ზემო სვანეთი",
    color: "#678dac",
  },
  "GE-TB": { nameEn: "Tbilisi", nameGe: "თბილისი", color: "#ce8d34" },
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
};

// Main component
const Dashboard = ({ language = "GE" }) => {
  // Add state for activities
  const [activities, setActivities] = useState([]);
  // State for selections
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [totalSalary, setTotalSalary] = useState(null);
  const [error, setError] = useState(null);
  const [zoomedRegion, setZoomedRegion] = useState(null);

  // Function to clear all selections
  const clearAllSelections = () => {
    setSelectedRegion(null);
    setSelectedActivity(null);
    setSelectedYear(null);
    setSelectedGender(null);
    setTotalSalary(null);
    setZoomedRegion(null);
  };

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityApi.getAll();
        const activitiesWithIcons = data.map((activity) => ({
          ...activity,
          icon: iconMap[activity.icon],
          name: language === "GE" ? activity.name_ge : activity.name_en,
        }));
        setActivities(activitiesWithIcons);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setError("Failed to load activities");
      }
    };

    fetchActivities();
  }, [language]);

  // Get activity code helper function
  const getActivityCode = useCallback(
    (activityName) => {
      const activity = activities.find(
        (a) =>
          a.name === activityName ||
          a.name_ge === activityName ||
          a.name_en === activityName
      );
      return activity ? activity.code : null;
    },
    [activities]
  );
  // Reference to the SVG element
  const svgRef = useRef(null);

  // Function to toggle region zoom
  const toggleRegionZoom = useCallback((id) => {
    setZoomedRegion((current) => (current === id ? null : id));
  }, []);

  // Function to handle region click - updates with numerical ID from mapping
  const handleRegionClick = useCallback(
    (id) => {
      setSelectedRegion((prev) => {
        const numericId = regionIdMap[id];
        return prev === numericId ? null : numericId;
      });
      toggleRegionZoom(id);
    },
    [toggleRegionZoom]
  );

  // Function to handle region hover - still using the GE-XX format for hovering
  const handleRegionHover = (id) => setHoveredRegion(id);

  // Function to handle activity selection with toggle capability
  const handleActivitySelect = (activity) => {
    setSelectedActivity(selectedActivity === activity ? null : activity);
  };

  // Function to handle year selection with toggle capability
  const handleYearSelect = useCallback((year) => {
    setSelectedYear((prev) => (prev === year ? null : year));
  }, []);

  // Function to handle gender selection with toggle capability
  const handleGenderSelect = (gender) => {
    setSelectedGender(selectedGender === gender ? null : gender);
  };

  // Helper function to get GE-XX code from a numeric region ID
  const getGeCodeFromRegionId = useCallback((numericId) => {
    return Object.keys(regionIdMap).find(
      (key) => regionIdMap[key] === numericId
    );
  }, []);
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
          const activityCode = getActivityCode(selectedActivity);

          if (!activityCode) {
            return;
          }

          // Default to regionId="0" (Georgia) with the selected activity
          let totalSalaryValue;
          if (selectedGender) {
            // If gender is selected, get gender-specific salary
            totalSalaryValue = await dataApi.getGenderSalary(
              selectedYear,
              "0", // Georgia (All)
              activityCode,
              selectedGender
            );
          } else {
            // Otherwise get the total salary
            totalSalaryValue = await dataApi.getTotalSalary(
              selectedYear,
              "0", // Georgia (All)
              activityCode
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
          const activityCode = getActivityCode(selectedActivity);

          if (!activityCode) {
            return;
          }

          // Get the salary data based on gender selection
          let totalSalaryValue;
          if (selectedGender) {
            // If gender is selected, get gender-specific salary
            totalSalaryValue = await dataApi.getGenderSalary(
              selectedYear,
              selectedRegion,
              activityCode,
              selectedGender
            );
          } else {
            // Otherwise get the total salary
            totalSalaryValue = await dataApi.getTotalSalary(
              selectedYear,
              selectedRegion,
              activityCode
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
  }, [
    selectedRegion,
    selectedActivity,
    selectedYear,
    selectedGender,
    getActivityCode,
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
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

          if (!svgElement.getAttribute("viewBox")) {
            const bbox = svgElement.getBBox();
            const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
            svgElement.setAttribute("viewBox", viewBox);
          }

          // Add styles with zoom transitions
          const style = document.createElement("style");
          style.textContent = `
            #georgia-map-container svg path {
              stroke: white;
              stroke-width: 0.5;
              cursor: pointer !important;
              opacity: 0.9 !important;
              filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.05)) !important;
            }
            #georgia-map-container svg path[id="GE-AB"],
            #georgia-map-container svg path[id="GE-TS"] {
              cursor: not-allowed !important;
            }
            #georgia-map-container svg path:hover {
              opacity: 1 !important;
              stroke-width: 1 !important;
              stroke: white !important;
              filter: brightness(1.05) saturate(1.2) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1)) !important;
            }
            #georgia-map-container svg path.zoomed {
              opacity: 1 !important;
              stroke-width: 0.5 !important;
            }
            #georgia-map-container svg path:not(.zoomed).region-hidden {
              opacity: 0 !important;
              pointer-events: none !important;
            }
            #georgia-map-container svg .region-label {
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
            #georgia-map-container svg path.zoomed + .region-label {
              opacity: 0 !important;
            }
            .map-tooltip {
              position: fixed;
              padding: 8px 12px;
              background: rgba(0, 0, 0, 0.8);
              color: white;
              border-radius: 4px;
              font-size: 14px;
              pointer-events: none;
              opacity: 0;
              transition: opacity 0.2s;
              z-index: 1000;
              border-top: 6px solid #37c8f5;
            }
            .map-tooltip.visible {
              opacity: 1;
            }
          `;

          svgElement.appendChild(style);

          // Create tooltip element
          const tooltip = document.createElement("div");
          tooltip.className = "map-tooltip";
          document.body.appendChild(tooltip);

          // Apply colors to regions and add event listeners
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
              label.textContent =
                language === "GE"
                  ? regionData[id].nameGe
                  : regionData[id].nameEn;

              // Update tooltip content and position on hover
              const showTooltip = (event) => {
                tooltip.textContent =
                  language === "GE"
                    ? regionData[id].nameGe
                    : regionData[id].nameEn;
                tooltip.style.left = event.pageX + "px";
                tooltip.style.top = event.pageY - 10 + "px";
                tooltip.classList.add("visible");
              };

              const hideTooltip = () => {
                tooltip.classList.remove("visible");
              };

              // Add hover events to both path and label
              path.addEventListener("mousemove", showTooltip);
              path.addEventListener("mouseleave", hideTooltip);
              label.addEventListener("mousemove", showTooltip);
              label.addEventListener("mouseleave", hideTooltip);

              path.parentNode.insertBefore(label, path.nextSibling);

              // Add event listeners for click and hover
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
  }, [handleRegionClick, language]); // Added language dependency

  // Effect to update selected/hovered/zoomed state
  useEffect(() => {
    if (!svgRef.current) return;
    const selectedGeCode = getGeCodeFromRegionId(selectedRegion);
    const paths = svgRef.current.querySelectorAll("path");

    paths.forEach((path) => {
      const pathId = path.getAttribute("id");
      if (pathId) {
        // Handle selection highlighting
        path.classList.toggle("selected", pathId === selectedGeCode);

        // Handle zoom state
        path.classList.toggle("zoomed", pathId === zoomedRegion);
        path.classList.toggle(
          "region-hidden",
          zoomedRegion !== null && pathId !== zoomedRegion
        );

        // Zoom functionality
        if (pathId === zoomedRegion) {
          const bbox = path.getBBox();
          // Add padding to the zoomed view
          const padding = 20;
          const viewBox = `${bbox.x - padding} ${bbox.y - padding} ${
            bbox.width + padding * 2
          } ${bbox.height + padding * 2}`;
          svgRef.current.setAttribute("viewBox", viewBox);
        } else if (!zoomedRegion) {
          // Reset to original viewBox when no region is zoomed
          const fullBbox = svgRef.current.getBBox();
          svgRef.current.setAttribute(
            "viewBox",
            `${fullBbox.x} ${fullBbox.y} ${fullBbox.width} ${fullBbox.height}`
          );
        }
      }
    });
  }, [selectedRegion, hoveredRegion, zoomedRegion, getGeCodeFromRegionId]);

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
      setError(null);
      const regionId = selectedRegion;
      const activityCode = getActivityCode(selectedActivity);

      if (!activityCode) {
        throw new Error(`Activity code not found for ${selectedActivity}`);
      }

      try {
        let totalSalaryValue;

        if (selectedGender) {
          const genderData = await dataApi.getGenderSpecificSalary(
            selectedGender,
            selectedYear,
            regionId,
            activityCode
          );
          totalSalaryValue = genderData.total;
        } else {
          totalSalaryValue = await dataApi.getTotalSalary(
            selectedYear,
            regionId,
            activityCode
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
            } (${selectedYear}, ${regionId}, ${activityCode})`
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

      console.log("Selected parameters:", {
        regionId: selectedRegion,
        regionCode: getGeCodeFromRegionId(selectedRegion),
        activity: selectedActivity,
        activityCode,
        year: selectedYear,
        gender: selectedGender,
      });
    } catch (err) {
      console.error("Failed to fetch salary data:", err);
      setError("Failed to fetch salary data. Please try again.");
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] p-2 font-sans overflow-hidden flex flex-col">
      <div className="h-full container mx-auto px-2">
        {/* Main Content - Compact Layout with card design */}{" "}
        <div className="grid grid-cols-12 gap-3">
          {/* Left Side Content */}
          <div className="col-span-12 md:col-span-8">
            {/* Map and Note Section */}
            <div className="grid grid-cols-8 gap-3 mb-3">
              {/* Map */}
              <div className="rounded-2xl p-2 col-span-8 md:col-span-4">
                <h2 className="sections-header">
                  {language === "GE" ? "აირჩიეთ რეგიონი" : "Choose Region"}
                </h2>
                <div className="relative overflow-hidden rounded-xl group p-1">
                  <div
                    id="georgia-map-container"
                    className="w-full h-[35vh]"
                  ></div>
                </div>
              </div>
              {/* Pinned Note */}{" "}
              <Note
                language={language}
                selectedYear={selectedYear}
                selectedRegion={selectedRegion}
                selectedActivity={selectedActivity}
                selectedGender={selectedGender}
                totalSalary={totalSalary}
                activitySectors={activities}
                regionData={regionData}
                getGeCodeFromRegionId={getGeCodeFromRegionId}
                onClear={clearAllSelections}
              />
            </div>

            {/* Year and Gender Selection Row */}
            <div className="grid grid-cols-8 gap-3">
              {/* Year Selector */}{" "}
              <div className="col-span-8 md:col-span-4">
                <div className="flex justify-center items-center">
                  <div
                    id="circle-svg-container"
                    data-language={language.toLowerCase()}
                    className="w-[290px] h-[290px] transition-all duration-300 ease-in-out"
                  ></div>
                </div>
              </div>
              {/* Gender Selector */}
              <div className="col-span-8 md:col-span-4">
                <Gender
                  language={language}
                  selectedGender={selectedGender}
                  setSelectedGender={setSelectedGender}
                  handleGenderSelect={handleGenderSelect}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Activity Selection */}
          <div className="col-span-12 md:col-span-4 h-full">
            <Activity
              language={language}
              selectedActivity={selectedActivity}
              setSelectedActivity={setSelectedActivity}
              activitySectors={activities}
              handleActivitySelect={handleActivitySelect}
            />
          </div>
        </div>{" "}
        {/* Error display */}
        {error && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-red-50 text-red-600 text-sm text-center rounded-xl shadow-sm border border-red-100 animate-fadeIn">
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
