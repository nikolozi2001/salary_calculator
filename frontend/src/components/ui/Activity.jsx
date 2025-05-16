import React, { useState, useEffect } from 'react';
// Import all activity icons
// These icons are not directly referenced but are needed when the activity objects
// contain the icon references that are passed to the component
// eslint-disable-next-line no-unused-vars
import educationIcon from "../../assets/icons/education.png";
// eslint-disable-next-line no-unused-vars
import manufacturingIcon from "../../assets/icons/manufacturing.png";
// eslint-disable-next-line no-unused-vars
import electricityIcon from "../../assets/icons/electricity.png";
// eslint-disable-next-line no-unused-vars
import tradeIcon from "../../assets/icons/trade.png";
// eslint-disable-next-line no-unused-vars
import constructionIcon from "../../assets/icons/construction.png";
// eslint-disable-next-line no-unused-vars
import realEstateIcon from "../../assets/icons/real-estate.png";
// eslint-disable-next-line no-unused-vars
import miningIcon from "../../assets/icons/mining.png";
// eslint-disable-next-line no-unused-vars
import hotelsIcon from "../../assets/icons/hotels.png";
// eslint-disable-next-line no-unused-vars
import financialIcon from "../../assets/icons/financial.png";
// eslint-disable-next-line no-unused-vars
import publicIcon from "../../assets/icons/public.png";
// eslint-disable-next-line no-unused-vars
import agroIcon from "../../assets/icons/agro.png";
// eslint-disable-next-line no-unused-vars
import transportIcon from "../../assets/icons/transport.png";
// eslint-disable-next-line no-unused-vars
import healthIcon from "../../assets/icons/health.png";
// eslint-disable-next-line no-unused-vars
import waterIcon from "../../assets/icons/water.png";
// eslint-disable-next-line no-unused-vars
import informationIcon from "../../assets/icons/information.png";
// eslint-disable-next-line no-unused-vars
import professionalIcon from "../../assets/icons/Professional.png";
// eslint-disable-next-line no-unused-vars
import administrativeIcon from "../../assets/icons/Administrative.png";
// eslint-disable-next-line no-unused-vars
import artsIcon from "../../assets/icons/Arts.png";
// eslint-disable-next-line no-unused-vars
import otherIcon from "../../assets/icons/Other.png";

// Component that displays an activity option
const ActivityItem = ({ activity, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(activity.name)}
    className={`relative p-3.5 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
      isSelected
        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md"
        : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm"
    }`}
  >
    <div className="flex items-center space-x-3">
      {/* Activity Icon with animated container */}
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-lg p-2 transition-all duration-300 flex items-center justify-center ${
          isSelected
            ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 shadow-inner"
            : "bg-gray-50 text-gray-500 shadow-sm group-hover:bg-white group-hover:shadow"
        }`}
      >
        <img
          src={activity.icon || ""}
          alt={activity.shortName}
          className={`w-full h-full object-contain transition-all duration-300 ${
            isSelected ? "scale-110" : "group-hover:scale-110"
          }`}
        />
      </div>

      {/* Activity Name with improved typography */}
      <div className="flex-1 min-w-0">
        <h4
          className={`text-sm font-medium truncate transition-colors duration-300 ${
            isSelected ? "text-blue-700" : "text-gray-700 group-hover:text-blue-600"
          }`}
        >
          {activity.shortName}
        </h4>
        <p className={`mt-0.5 text-xs truncate transition-colors duration-300 ${
            isSelected ? "text-blue-500" : "text-gray-500"
          }`}>
          {activity.name.length > 30
            ? `${activity.name.substring(0, 30)}...`
            : activity.name}
        </p>
      </div>

      {/* Selected Checkmark with animated entrance */}
      {isSelected ? (
        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 shadow-sm animate-fadeIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ) : (
        <div className="absolute top-2 right-2 rounded-full p-1 opacity-0 group-hover:opacity-70 transition-opacity duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  </div>
);

// Main Activity selection component
const Activity = ({ 
  activeStepIndex, 
  language, 
  selectedActivity, 
  setSelectedActivity, 
  activitySectors, 
  handleActivitySelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredActivities, setFilteredActivities] = useState(activitySectors);
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter activities based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      if (activeCategory === 'all') {
        setFilteredActivities(activitySectors);
      } else {
        // This is a placeholder categorization - you would need to define actual categories
        const categoryMap = {
          'primary': ['A', 'B', 'C'], // Agriculture, Fishing, Mining
          'secondary': ['D', 'E', 'F'], // Manufacturing, Utilities, Construction
          'tertiary': ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'] // Services, etc.
        };
        
        setFilteredActivities(activitySectors.filter(activity => 
          categoryMap[activeCategory]?.includes(activity.id)
        ));
      }
    } else {
      const filtered = activitySectors.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.shortName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredActivities(filtered);
    }
  }, [searchTerm, activitySectors, activeCategory]);

  // Enhanced Step Heading component with better visual hierarchy
  const StepHeading = ({ number, title, selected, onClear }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="relative mr-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-sm">
            {number}
          </span>
          {/* Animated pulse effect for active step */}
          {activeStepIndex === 1 && (
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping" style={{ animationDuration: '3s' }}></span>
          )}
        </div>
        <h3 className="text-gray-800 font-medium text-lg">{title}</h3>
      </div>
      {selected && (
        <button
          onClick={onClear}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 hover:text-gray-800 transition-all duration-200 group"
          aria-label="Clear selection"
        >
          <span>{language === "GE" ? "გასუფთავება" : "Clear"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-5 col-span-12 md:col-span-5 transition-all duration-500 transform ${
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

      {/* Search field */}
      <div className="mb-3 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={language === "GE" ? "მოძებნეთ საქმიანობა..." : "Search activities..."}
          className="w-full py-2 pl-9 pr-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 absolute left-3 top-2.5 text-gray-400"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex space-x-2 mb-3 overflow-x-auto py-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {language === "GE" ? "ყველა" : "All"}
        </button>
        <button
          onClick={() => setActiveCategory('primary')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
            activeCategory === 'primary'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {language === "GE" ? "პირველადი" : "Primary"}
        </button>
        <button
          onClick={() => setActiveCategory('secondary')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
            activeCategory === 'secondary'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {language === "GE" ? "მეორადი" : "Secondary"}
        </button>
        <button
          onClick={() => setActiveCategory('tertiary')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
            activeCategory === 'tertiary'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {language === "GE" ? "მესამედი" : "Tertiary"}
        </button>
      </div>

      {/* Activities grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 h-[200px] overflow-y-auto pr-1.5 rounded-lg"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #EDF2F7'
        }}
      >
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="animate-fadeIn" 
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <ActivityItem
                activity={activity}
                isSelected={selectedActivity === activity.name}
                onSelect={handleActivitySelect}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium mb-1">
              {language === "GE" ? "საქმიანობა ვერ მოიძებნა" : "No activities found"}
            </p>
            <p className="text-xs">
              {language === "GE" 
                ? "სცადეთ სხვა საძიებო ტერმინი" 
                : "Try a different search term"}
            </p>
          </div>
        )}
      </div>

      {/* Selected activity indicator */}
      {selectedActivity && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">
              {language === "GE" ? "არჩეულია:" : "Selected:"} 
              <span className="font-medium text-blue-600 ml-1">
                {selectedActivity && activitySectors.find(a => a.name === selectedActivity)?.shortName}
              </span>
            </span>
          </div>
          <button 
            onClick={() => setSelectedActivity(null)}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
          >
            {language === "GE" ? "შეცვლა" : "Change"}
          </button>
        </div>
      )}
    </div>
  );
};
export default Activity;
