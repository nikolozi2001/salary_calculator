import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { isco08Api } from "../../services/api";
import Gender from "./Gender";

const SearchResults = ({ language, setLanguage }) => {
  const location = useLocation();
  const {
    selectedCategory: initialCategory,
    selectedSubcategory: initialSubcategory,
  } = location.state || {};
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
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

  const handleSearch = async () => {
    try {
      setLoading(true);
      const code = selectedSubcategory || selectedCategory;
      if (!code) return;

      const isEnglish = language === "EN";
      const data = await isco08Api.getByCode(code, isEnglish);
      setSalaryData(data);
    } catch (error) {
      console.error("Error fetching salary data:", error);
    } finally {
      setLoading(false);
    }
  };

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
                    className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
            <div className="bg-white rounded-lg shadow p-6 min-h-[200px]">
              {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : salaryData ? (
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-5 text-right">
                    <div className="font-bold mb-2">
                      {language === "GE" ? "დაკავებული თანამდებობა/პოზიცია" : "Position/Occupation"}
                    </div>
                    <div className="text-gray-700">
                      {salaryData.name}
                    </div>
                  </div>
                  <div className="col-span-5 flex items-center justify-center">
                    {selectedGender && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                          {selectedGender === 'male' ? salaryData.male : salaryData.female}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === "GE" ? "ლარი" : "GEL"}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{salaryData.total}</div>
                      <div className="text-sm text-gray-600">
                        {language === "GE" ? "ლარი" : "GEL"}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {language === "GE" 
                    ? "აირჩიეთ კატეგორია ან ქვეკატეგორია"
                    : "Select a category or subcategory"}
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
