import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { isco08Api } from "../../services/api";

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
  const [loading, setLoading] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [isFirstSubcategory, setIsFirstSubcategory] = useState(false);

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
        setLoading(true);
        const isEnglish = language === "EN";
        const data = await isco08Api.getAll(isEnglish);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header language={language} setLanguage={setLanguage} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2">
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

          {/* You can add more content here, such as data visualization, tables, etc. */}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};

export default SearchResults;
