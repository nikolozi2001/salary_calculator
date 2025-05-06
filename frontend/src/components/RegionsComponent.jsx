import { useEffect, useState } from 'react';
import { regionsApi } from '../services/api';

function RegionsComponent() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  useEffect(() => {
    regionsApi.getAll()
      .then(response => {
        setRegions(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching regions:', err);
        setError('Failed to load regions');
        setLoading(false);
      });
  }, []);

  const handleRegionClick = (region) => {
    setSelectedRegion(selectedRegion?.id === region.id ? null : region);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-[#1a4db9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
        </svg>
        Regions
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-4 h-32 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : (
        <>
          {regions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {regions.map(region => (
                <div 
                  key={region.id}
                  onClick={() => handleRegionClick(region)}
                  className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200 
                    ${selectedRegion?.id === region.id 
                      ? 'ring-2 ring-[#1a4db9] transform scale-[1.02]' 
                      : 'hover:shadow-lg hover:transform hover:scale-[1.01]'}`}
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{region.name}</h3>
                  
                  {selectedRegion?.id === region.id && (
                    <div className="mt-4 animate-fadeIn">
                      <p className="text-sm text-gray-600">
                        Average Salary: <span className="font-semibold">Click to view</span>
                      </p>
                      <button className="mt-2 text-xs bg-gradient-to-r from-[#012B7C] to-[#1a4db9] text-white py-1 px-3 rounded-full transition-all hover:opacity-90">
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-gray-600">No regions found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RegionsComponent;