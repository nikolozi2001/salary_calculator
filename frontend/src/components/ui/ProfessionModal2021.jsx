import React, { useEffect, useState } from "react";
import headerBg from "../../assets/images/header-bg.jpg";
import { isco08Api } from "../../services/api";

const ProfessionModal2021 = ({ isOpen, onClose, language, initialCode }) => {
  const fontClass = language === "GE" ? "font-bpg-nino" : "font-poppins";
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Handle initial code
  useEffect(() => {
    if (initialCode && isOpen) {
      // If initial code is one digit, it's a main category
      // If it's two digits, it's a subcategory
      if (initialCode.toString().length === 1) {
        setSelectedCategory(initialCode);
      } else if (initialCode.toString().length === 2) {
        const mainCategory = initialCode.toString()[0];
        setSelectedCategory(mainCategory);
        setSelectedSubcategory(initialCode);
      }
    }
  }, [initialCode, isOpen]);

  // Load main categories
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

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, language]);

  // Load subcategories when main category changes
  useEffect(() => {
    const loadSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }

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
  }, [selectedCategory, language]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (event.target.classList.contains("modal-backdrop")) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubcategory(value);
    
    const isFirstSubcategory = subcategories.find(sub => 
      String(sub.code) === "0" || sub.id === 1
    );
    
    // Log for debugging
    console.log('Selected subcategory:', value);
    console.log('First subcategory:', isFirstSubcategory);
    console.log('First subcategory code:', isFirstSubcategory?.code);
    
    if (value === "0" || value === isFirstSubcategory?.code) {
      console.log("First subcategory selected!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 modal-backdrop">
      <div
        className={`bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${fontClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div id="profession-modal-content">
          <div
            className="border-b p-4 flex justify-between items-center"
            style={{
              backgroundImage: `url(${headerBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h5 className="text-xl font-bold text-white">
              {language === "GE"
                ? "ხელფასები პროფესიების მიხედვით - 2021 - ISCO08"
                : "Salaries by Profession - 2021 - ISCO08"}
            </h5>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl print:hidden"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-6">
              <p className="text-gray-600 text-center">
                {language === "GE"
                  ? "აირჩიეთ ან პირველი ან მეორე დონე"
                  : "Select a first or second level"}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">
                      {language === "GE"
                        ? "აირჩიეთ კატეგორია"
                        : "Select Category"}
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={
                      loadingSubcategories ||
                      !selectedCategory ||
                      selectedCategory !== "0"
                    }
                    value={selectedSubcategory}
                    onChange={handleSubcategoryChange}
                  >
                    <option value="">
                      {language === "GE"
                        ? "აირჩიეთ ქვეკატეგორია"
                        : "Select Subcategory"}
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
          <div className="border-t p-4 flex justify-center gap-2 print:hidden">
            <button className="px-8 py-2 border-2 border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {language === "GE" ? "ძებნა" : "Search"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionModal2021;
