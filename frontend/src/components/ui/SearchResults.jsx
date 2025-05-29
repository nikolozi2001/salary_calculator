import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { isco08Api } from "../../services/api";
import Gender from "./Gender";
import icon111 from "../../assets/icons/111.png";
import icon222 from "../../assets/icons/222.png";
import iconBoth from "../../assets/icons/iconBoth.png";

const SearchResults = ({ language, setLanguage }) => {
  const location = useLocation();
  const {
    selectedCategory: initialCategory,
    selectedSubcategory: initialSubcategory,
  } = location.state || {};
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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
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
        const data = await isco08Api.getAll(isEnglish);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, [language]);

  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        setLoadingSubcategories(true);
        const isEnglish = language === "EN";
        const data = await isco08Api.getAllLevel2(isEnglish);
        setSubcategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    loadSubcategories();
  }, [language]);

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      const isEnglish = language === "EN";

      let data;
      if (selectedSubcategory && selectedSubcategory !== "0") {
        // Use level2 endpoint for subcategories
        data = await isco08Api.getByLevel2Code(selectedSubcategory, isEnglish);
      } else if (selectedCategory && selectedCategory !== "0") {
        // Use regular endpoint for main categories
        data = await isco08Api.getByCode(selectedCategory, isEnglish);
      } else {
        return;
      }

      setSalaryData(data);
    } catch (error) {
      console.error("Error fetching salary data:", error);
      setSalaryData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubcategory, language]);

  useEffect(() => {
    if (selectedGender && (selectedCategory || selectedSubcategory)) {
      handleSearch();
    }
  }, [selectedGender, selectedCategory, selectedSubcategory, handleSearch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header language={language} setLanguage={setLanguage} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* First Row - Gender Selection */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-center">
                <Gender
                  language={language}
                  selectedGender={selectedGender}
                  handleGenderSelect={handleGenderSelect}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - ISCO Selection */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    value={selectedCategory || ""}
                    onChange={handleCategoryChange}
                    disabled={isFirstSubcategory === true}
                  >
                    <option value="">
                      {language === "GE" ? "ISCO 1 დონე" : "ISCO Level 1"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.code}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center items-center">
                  <button
                    onClick={handleSearch}
                    disabled={
                      !selectedGender ||
                      (!selectedCategory && !selectedSubcategory)
                    }
                    className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {language === "GE" ? "ძებნა" : "Search"}
                  </button>
                </div>

                <div className="col-span-2">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    value={selectedSubcategory || ""}
                    onChange={handleSubcategoryChange}
                    disabled={
                      loadingSubcategories ||
                      !selectedCategory ||
                      selectedCategory !== "0"
                    }
                  >
                    <option value="">
                      {language === "GE" ? "ISCO 2 დონე" : "ISCO Level 2"}
                    </option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.code}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Box */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg shadow p-6 min-h-[227px] border">
              {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : !selectedGender ? (
                <div className="flex flex-col space-y-2">
                  <span className="chooseGenderAnimation text-center opacity-100">
                    {language === "GE" ? "აირჩიეთ სქესი" : "Choose Gender"}
                  </span>
                </div>
              ) : !salaryData || !(selectedCategory || selectedSubcategory) ? (
                <div className="flex flex-col space-y-2">
                  <span className="chooseOccupationAnimation text-center opacity-100">
                    {language === "GE" ? "აირჩიეთ პოზიცია" : "Choose Position"}
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Position Title Column */}
                    <div className="col-span-5">
                      <div className="text-right pr-4">
                        <div className="mb-2 resultTitle">
                          <b>
                            {language === "GE"
                              ? "დაკავებული თანამდებობა/პოზიცია"
                              : "Position/Occupation"}
                          </b>
                        </div>
                        <div className="text-gray-700 resultOccupation float-right">
                          {salaryData.name}
                        </div>
                      </div>
                    </div>

                    {/* Gender Specific Salary */}
                    <div className="col-span-5 pt-1">
                      <div className="flex">
                        <div className="w-5/12">
                          <img
                            src={selectedGender === "male" ? icon222 : icon111}
                            alt={selectedGender === "male" ? "Male" : "Female"}
                            className="genderIcon w-16"
                          />
                        </div>
                        <div className="w-5/12">
                          <div className="font-bold text-2xl resultValue">
                            {selectedGender === "male"
                              ? salaryData.male
                              : salaryData.female}
                          </div>
                          <div className="text-sm resultCur">
                            {language === "GE" ? "ლარი" : "GEL"}
                          </div>
                        </div>
                        <div className="w-2/12">
                          <div className="h-full w-1 mx-auto bg-gray-200"></div>
                        </div>
                      </div>
                    </div>

                    {/* Total Column */}
                    <div className="col-span-2 pt-2">
                      <div className="flex flex-col items-center">
                        <img
                          src={iconBoth}
                          alt="Total"
                          className="totalGender w-8 mb-2"
                        />
                        <div className="text-center">
                          <div className="resultTotalValue font-bold">
                            {salaryData.total}
                          </div>
                          <div className="resultTotalCur text-sm">
                            {language === "GE" ? "ლარი" : "GEL"}
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
