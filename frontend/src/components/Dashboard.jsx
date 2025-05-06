import React, { useState } from "react";

const Dashboard = () => {
  // State for selections
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  // Industry sectors
  const industries = [
    "განათლება",
    "დამამუშავებელი მრეწველობა",
    "ულმ. ადმინისტრაცია და თავდაცვა",
    "სავაჭრო და საცალო ვაჭრობა",
    "მშენებლობა",
    "უძრავი ქონების ოპერაციები",
    "მატერიალური რესურსების მოპოვება",
    "სასტუმრო და კვების მომსახურება",
    "ფინანსები და დაზღვევა",
    "სახელმწიფო მართვა და უსაფრთხოება"
  ];

  // Years for selection
  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-sm">
      {/* Header */}
      <h1 className="text-2xl font-light mb-8 text-center text-gray-700 border-b pb-4">
        ხელფასების კალკულატორი
      </h1>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Map Section - Interactive Region Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
          <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
            რეგიონი
          </h2>
          <div className="relative group cursor-pointer">
            <img 
              src="/map-placeholder.png" 
              alt="Georgia Map" 
              className="w-full h-auto transition-all duration-300 group-hover:opacity-90" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <p className="text-white p-3 text-sm w-full text-center">
                აირჩიეთ რეგიონი რუკაზე
              </p>
            </div>
          </div>
        </div>

        {/* Info/Instructions Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm flex items-center">
          <div className="space-y-4">
            <div className="inline-block bg-white p-2 rounded-full shadow-sm mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              ხელფასების კალკულატორი საჭიროებს რეგიონის, საქმიანობის სახის, სქესისა და წლის არჩევას ანგარიშისთვის.
            </p>
            <button className="mt-4 px-4 py-2 bg-indigo-500 text-white text-sm rounded-md shadow-sm hover:bg-indigo-600 transition-colors duration-300">
              დაწყება
            </button>
          </div>
        </div>

        {/* Activity Selector */}
        <div className="bg-white p-6 rounded-lg shadow-sm overflow-hidden">
          <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
            საქმიანობის სახე
          </h2>
          <div className="max-h-72 overflow-y-auto pr-2 -mr-2 space-y-1">
            {industries.map((industry, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedActivity(industry)}
                className={`p-3 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-2 ${
                  selectedActivity === industry 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "hover:bg-gray-100"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span className="text-sm">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Selectors */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Year Selector */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
            წელი
          </h2>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${
                  selectedYear === year
                    ? "bg-indigo-500 text-white font-medium" 
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Gender Selector */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
            სქესი
          </h2>
          <div className="flex gap-6 justify-center">
            <div 
              onClick={() => setSelectedGender('female')}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                selectedGender === 'female' 
                ? 'bg-pink-50 ring-2 ring-pink-200' 
                : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a7 7 0 107 7c0-3.86-3.14-7-7-7zm0 11a4 4 0 110-8 4 4 0 010 8z" clipRule="evenodd" />
                  <path d="M10 15v2m0 0h2m-2 0H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className={`text-sm ${selectedGender === 'female' ? 'font-medium' : ''}`}>ქალი</span>
            </div>

            <div 
              onClick={() => setSelectedGender('male')}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                selectedGender === 'male' 
                ? 'bg-blue-50 ring-2 ring-blue-200' 
                : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 11a4 4 0 110-8 4 4 0 010 8z" clipRule="evenodd" />
                  <path d="M15 3l-2 2m0 0V3m0 2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className={`text-sm ${selectedGender === 'male' ? 'font-medium' : ''}`}>კაცი</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          გაანალიზება
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
