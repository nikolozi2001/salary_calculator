import axios from "axios";

// Create an axios instance with default configuration
const api = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "http://192.168.1.27:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for logging or authentication
api.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    const { response } = error;

    if (!response) {
      console.error("Network error: Please check your connection");
      // You could dispatch to a notification system here
    } else {
      switch (response.status) {
        case 401:
          console.error("Unauthorized access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error(`Error: ${response.statusText}`);
      }
    }

    return Promise.reject(error);
  }
);

// API methods for data
export const dataApi = {
  getAll: async () => {
    try {
      const response = await api.get("/data");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  },
 
  getDataByYearAndRegion: async (year, regionId) => {
    try {
      const response = await api.get(`/data/${year}/${regionId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch data for year ${year} and region ${regionId}:`, error);
      throw error;
    }
  },

  getDataByYearRegionAndBusiness: async (year, regionId, business) => {
    try {
      const response = await api.get(`/data/${year}/${regionId}/${business}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch data for year ${year}, region ${regionId}, and business ${business}:`, error);
      throw error;
    }
  },
  getTotalSalary: async (year, regionId, business) => {
    try {
      // Handle default parameter values based on which parameters are provided
      // Default values: regionId = "0" (all Georgia), business = "AA" (all sectors)
      let resolvedRegionId = regionId;
      let resolvedBusiness = business;
      
      // If only year is provided, use default values for region and business
      if (year && !regionId && !business) {
        resolvedRegionId = "0";
        resolvedBusiness = "AA";
      }
      // If year and region are provided but no business, use default business
      else if (year && regionId && !business) {
        resolvedBusiness = "AA";
      }
      
      // Make the API request with resolved parameters
      const response = await api.get(`/data/total/${year}/${resolvedRegionId || "0"}/${resolvedBusiness || "AA"}`);
      return response.data.total;
    } catch (error) {
      console.error(`Failed to fetch total salary for year ${year}, region ${regionId}, and business ${business}:`, error);
      throw error;
    }
  },
};

// Function to test database connection
export const testDbConnection = async () => {
  try {
    const response = await api.get("/test-db");
    return response.data;
  } catch (error) {
    console.error("Database connection test failed:", error);
    throw error;
  }
};

export default api;
