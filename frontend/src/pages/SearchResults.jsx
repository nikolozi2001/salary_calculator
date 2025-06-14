import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { isco08Api, isco88Api } from "../services/api";
import Gender from "../components/ui/Gender";
import iconBoth from "../assets/icons/iconBoth.png";
import f1Icon from "../assets/icons/f1.png";
import f2Icon from "../assets/icons/f2.png";
import m1Icon from "../assets/icons/m1.png";
import m2Icon from "../assets/icons/m2.png";
import frIcon from "../assets/icons/222.png";
import mrIcon from "../assets/icons/111.png";
import "./SearchResults.scss";

// Custom styles for react-select
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "2px",
    borderColor: state.isFocused ? "#007bff" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px #007bff" : provided.boxShadow,
    "&:hover": {
      borderColor: "#007bff",
    },
    fontFamily: "BPG Nino Mtavruli",
    fontSize: window.innerWidth < 640 ? "16px" : "22px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
      ? "#007bff"
      : "white",
    color: state.isSelected ? "white" : "#374151",
    "&:hover": {
      backgroundColor: state.isSelected ? "#007bff" : "#007bff",
      color: "white",
    },
    fontFamily: "BPG Nino Mtavruli",
    fontSize: "16px",
  }),
};

const SearchResults = ({ language, setLanguage }) => {
  const location = useLocation();
  const {
    selectedCategory: initialCategory,
    selectedSubcategory: initialSubcategory,
    year = 2021,
  } = location.state || {};

  // Determine which API to use based on year
  const api = year === 2021 ? isco08Api : isco88Api;
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState(initialSubcategory);
  const [selectedGender, setSelectedGender] = useState(null);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [isFirstSubcategory, setIsFirstSubcategory] = useState(false);
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenderSelect = (gender) => {
    setSelectedGender(selectedGender === gender ? null : gender);
  };
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption?.value || "0");
  };

  const handleSubcategoryChange = (selectedOption) => {
    const value = selectedOption?.value || "0";
    setSelectedSubcategory(value);

    const firstSubcat = subcategories.find(
      (sub) => String(sub.code) !== "0" || sub.id !== 1
    );

    if (value !== "0" || value === firstSubcat?.code) {
      setIsFirstSubcategory(true);
    } else {
      setIsFirstSubcategory(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const isEnglish = language === "EN";
        const data = await api.getAll(isEnglish);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, [language, api]);

  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        setLoadingSubcategories(true);
        const isEnglish = language === "EN";
        const data = await api.getAllLevel2(isEnglish);
        setSubcategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      } finally {
        setLoadingSubcategories(false);
      }
    };
    loadSubcategories();
  }, [language, api]);
  const handleSearch = async () => {
    if (!selectedGender || (!selectedCategory && !selectedSubcategory)) {
      return;
    }

    try {
      setLoading(true);
      // Fetch both language versions
      let geData, enData;
      if (selectedSubcategory && selectedSubcategory !== "0") {
        // Use level2 endpoint for subcategories
        [geData, enData] = await Promise.all([
          api.getByLevel2Code(selectedSubcategory, false),
          api.getByLevel2Code(selectedSubcategory, true),
        ]);
      } else if (selectedCategory && selectedCategory !== "0") {
        // Use regular endpoint for main categories
        [geData, enData] = await Promise.all([
          api.getByCode(selectedCategory, false),
          api.getByCode(selectedCategory, true),
        ]);
      } else {
        return;
      }

      setSalaryData({
        ...geData,
        name_ge: geData.name,
        name_en: enData.name,
        name: language === "EN" ? enData.name : geData.name,
      });
    } catch (error) {
      console.error("Error fetching salary data:", error);
      setSalaryData(null);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup tooltips
  useEffect(() => {
    const tooltips = document.querySelectorAll(".map-tooltip");
    tooltips.forEach((tooltip) => tooltip.remove());
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header language={language} setLanguage={setLanguage} page="search" />{" "}
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {" "}
        {/* First Row - Gender Selection */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-full max-w-5xl">
            <div className="rounded-lg p-3 sm:p-6 relative">
              {selectedGender && (
                <button
                  onClick={() => {
                    setSelectedGender(null);
                    setSalaryData(null);
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Clear selection"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
              )}{" "}
              <div className="flex justify-center space-x-4 sm:space-x-8">
                <button
                  onClick={() => handleGenderSelect("female")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.querySelector("img").src = f2Icon)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.querySelector("img").src =
                      selectedGender === "female" ? f2Icon : f1Icon)
                  }
                  className={` ${selectedGender === "female" ? "" : ""}`}
                >
                  <img
                    src={selectedGender === "female" ? f2Icon : f1Icon}
                    alt="Female"
                    className="w-24 h-30 sm:w-24 sm:h-30"
                  />
                </button>
                <button
                  onClick={() => handleGenderSelect("male")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.querySelector("img").src = m2Icon)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.querySelector("img").src =
                      selectedGender === "male" ? m2Icon : m1Icon)
                  }
                  className={`  ${selectedGender === "male" ? "" : ""}`}
                >
                  <img
                    src={selectedGender === "male" ? m2Icon : m1Icon}
                    alt="Male"
                    className="w-24 h-30 sm:w-24 sm:h-30"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Second Row - ISCO Selection */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-full max-w-5xl">
            <div className="rounded-lg p-3 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
                <div className="col-span-2">
                  <Select
                    styles={customStyles}
                    value={
                      selectedCategory
                        ? {
                            value: selectedCategory,
                            label:
                              categories.find(
                                (c) => c.code === selectedCategory
                              )?.name ||
                              (language === "GE"
                                ? `ISCO${year === 2021 ? "08" : "88"} - 1 დონე`
                                : `ISCO${
                                    year === 2021 ? "08" : "88"
                                  } - Level 1`),
                          }
                        : null
                    }
                    onChange={handleCategoryChange}
                    options={categories.map((category) => ({
                      value: category.code,
                      label: category.name,
                    }))}
                    isDisabled={isFirstSubcategory === true}
                    isClearable
                    isSearchable
                    placeholder={
                      language === "GE"
                        ? `ISCO${year === 2021 ? "08" : "88"} - 1 დონე`
                        : `ISCO${year === 2021 ? "08" : "88"} - Level 1`
                    }
                  />
                </div>

                <div className="flex justify-center items-center">
                  <button
                    onClick={handleSearch}
                    disabled={
                      !selectedGender ||
                      (!selectedCategory && !selectedSubcategory)
                    }
                    className="submitProf2 px-6 py-2 bg-white-500 text-[#6cd0d9] rounded-md hover:text-[#fff] hover:bg-[#6cd0d9] disabled:cursor-not-allowed"
                  >
                    {language === "GE" ? "ძებნა" : "Search"}
                  </button>
                </div>

                <div className="col-span-2">
                  <Select
                    styles={customStyles}
                    value={
                      selectedSubcategory
                        ? {
                            value: selectedSubcategory,
                            label:
                              subcategories.find(
                                (s) => s.code === selectedSubcategory
                              )?.name ||
                              (language === "GE"
                                ? `ISCO${year === 2021 ? "08" : "88"} - 2 დონე`
                                : `ISCO${
                                    year === 2021 ? "08" : "88"
                                  } - Level 2`),
                          }
                        : null
                    }
                    onChange={handleSubcategoryChange}
                    options={subcategories.map((subcategory) => ({
                      value: subcategory.code,
                      label: subcategory.name,
                    }))}
                    isDisabled={
                      loadingSubcategories ||
                      !selectedCategory ||
                      selectedCategory !== "0"
                    }
                    isClearable
                    isSearchable
                    placeholder={
                      language === "GE"
                        ? `ISCO${year === 2021 ? "08" : "88"} - 2 დონე`
                        : `ISCO${year === 2021 ? "08" : "88"} - Level 2`
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Results Box */}
        <div className="flex justify-center">
          <div
            className="w-full max-w-5xl border"
            style={{
              border: "1px solid #dee2e6!important",
              borderRadius: "0.5rem",
            }}
          >
            {" "}
            <div className="rounded-lg p-3 sm:p-6 min-h-[227px]">
              {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : !selectedGender ? (
                <div className="flex flex-col space-y-2">
                  <span className="chooseGenderAnimation text-center opacity-100 font-bpg-nino text-2xl">
                    {language === "GE" ? "აირჩიეთ სქესი" : "Choose Gender"}
                  </span>
                </div>
              ) : !salaryData || !(selectedCategory || selectedSubcategory) ? (
                <div className="flex flex-col space-y-2">
                  <span className="chooseOccupationAnimation text-center opacity-100 font-bpg-nino text-2xl">
                    {language === "GE" ? "აირჩიეთ პოზიცია" : "Choose Position"}
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                    {/* Position Title Column */}
                    <div className="col-span-1 sm:col-span-5">
                      <div className="text-center sm:text-right sm:pr-4">
                        <div className="mb-2 resultTitle text-sm sm:text-base font-bold">
                          <b>
                            {language === "GE"
                              ? "დაკავებული თანამდებობა/პოზიცია"
                              : "Position/Occupation"}
                          </b>
                        </div>{" "}
                        <div className="text-gray-700 resultOccupation float-right">
                          {language === "EN"
                            ? salaryData.name_en
                            : salaryData.name_ge}
                        </div>
                      </div>
                    </div>{" "}
                    {/* Gender Specific Salary */}{" "}
                    <div className="col-span-5 pt-1">
                      <div className="flex items-center h-full">
                        <div className="w-5/12 flex items-center justify-center">
                          <img
                            src={selectedGender === "male" ? mrIcon : frIcon}
                            alt={selectedGender === "male" ? "Male" : "Female"}
                            className="w-16 h-18 sm:w-20 sm:h-22"
                          />
                        </div>
                        <div className="w-5/12 flex flex-col justify-center">
                          {" "}
                          <div className="font-bold text-3xl sm:text-5xl resultValue font-bpg-nino text-[#148CCD]">
                            {selectedGender === "male"
                              ? salaryData.male
                              : salaryData.female}
                          </div>
                          <div className="resultCur text-2xl sm:text-4xl font-bpg-nino text-[#148CCD]">
                            {language === "GE" ? "ლარი" : "GEL"}
                          </div>
                        </div>
                        <div className="w-2/12 flex items-center justify-center h-full">
                          <div className="h-full w-0.5 bg-[#148CCD]"></div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* Total Column */}
                    <div className="col-span-2 pt-2">
                      <div className="flex flex-col items-center relative">
                        <img
                          src={iconBoth}
                          alt="Total"
                          className="totalGender"
                        />{" "}
                        <div className="text-center absolute bottom-2">
                          <div className="flex items-center justify-center gap-2">
                            <div className="font-bpg-nino resultTotalValue">
                              {salaryData.total}
                            </div>
                            <div className="font-bpg-nino resultTotalCur">
                              {language === "GE" ? "ლარი" : "GEL"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default SearchResults;
