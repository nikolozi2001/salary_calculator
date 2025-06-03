import axios from "axios";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
  },  (error) => {
    // Handle common errors
    const { response } = error;

    // Create a standardized error object
    const errorObject = {
      message: '',
      status: response?.status || 'network_error',
      timestamp: new Date().toISOString(),
      path: response?.config?.url || '',
      details: response?.data?.error || error.message
    };

    if (!response) {
      errorObject.message = "Network error: Please check your connection";
      if (!import.meta.env.PROD) {
        console.error(errorObject);
      }
    } else {
      switch (response.status) {
        case 401:
          errorObject.message = "Unauthorized access";
          break;
        case 403:
          errorObject.message = "Access forbidden";
          break;
        case 404:
          errorObject.message = "Resource not found";
          break;
        case 429:
          errorObject.message = "Too many requests, please try again later";
          break;
        case 500:
          errorObject.message = "Internal server error";
          break;
        default:
          errorObject.message = `Error: ${response.statusText || 'Unknown error'}`;
      }
      
      if (!import.meta.env.PROD) {
        console.error(errorObject);
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
      console.error(
        `Failed to fetch data for year ${year} and region ${regionId}:`,
        error
      );
      throw error;
    }
  },

  getDataByYearRegionAndBusiness: async (year, regionId, business) => {
    try {
      const response = await api.get(`/data/${year}/${regionId}/${business}`);
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch data for year ${year}, region ${regionId}, and business ${business}:`,
        error
      );
      throw error;
    }
  },
  getTotalSalary: async (year, regionId, business) => {
    try {
      // Handle default parameter values based on which parameters are provided
      let resolvedRegionId = regionId;
      let resolvedBusiness = business;

      // If only year is provided, use default values for Georgia (All) and All Activities
      if (year && !regionId && !business) {
        resolvedRegionId = "0"; // Georgia (All)
        resolvedBusiness = "AA"; // All Activities
      }
      // If year and region are provided but no business, use All Activities as default
      else if (year && regionId && !business) {
        resolvedBusiness = "AA"; // All Activities
      }
      // If year and business are provided but no region, use Georgia (All) as default
      else if (year && !regionId && business) {
        resolvedRegionId = "0"; // Georgia (All)
      }

      // Make the API request with resolved parameters
      const response = await api.get(
        `/data/total/${year}/${resolvedRegionId || "0"}/${
          resolvedBusiness || "AA"
        }`
      );
      return response.data.total;
    } catch (error) {
      console.error(
        `Failed to fetch total salary for year ${year}, region ${regionId}, and business ${business}:`,
        error
      );
      throw error;
    }
  },
  getGenderSalary: async (year, regionId, business, gender) => {
    try {
      // Validate gender parameter
      if (gender !== "male" && gender !== "female") {
        throw new Error('Invalid gender parameter. Use "male" or "female".');
      }

      // Handle default parameter values based on which parameters are provided
      let resolvedRegionId = regionId;
      let resolvedBusiness = business;

      // If only year is provided, use default values for Georgia (All) and All Activities
      if (year && !regionId && !business) {
        resolvedRegionId = "0"; // Georgia (All)
        resolvedBusiness = "AA"; // All Activities
      }
      // If year and region are provided but no business, use All Activities as default
      else if (year && regionId && !business) {
        resolvedBusiness = "AA"; // All Activities
      }
      // If year and business are provided but no region, use Georgia (All) as default
      else if (year && !regionId && business) {
        resolvedRegionId = "0"; // Georgia (All)
      }

      // Make the API request with resolved parameters
      const response = await api.get(
        `/data/gender/${year}/${resolvedRegionId || "0"}/${
          resolvedBusiness || "AA"
        }/${gender}`
      );
      return response.data[gender];
    } catch (error) {
      console.error(
        `Failed to fetch ${gender} salary data for year ${year}, region ${regionId}, and business ${business}:`,
        error
      );
      throw error;
    }
  },
};

// Activity API methods
export const activityApi = {
  getAll: async () => {
    try {
      const response = await api.get("/activity");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/activity/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch activity with id ${id}:`, error);
      throw error;
    }
  },
};

// ISCO08 API methods
export const isco08Api = {
  getAll: async (isEnglish = false) => {
    try {
      const response = await api.get("/isco08", {
        params: { lang: isEnglish ? "en" : "ge" },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch ISCO08 categories:", error);
      throw error;
    }
  },

  getAllLevel2: async (isEnglish = false) => {
    try {
      const response = await api.get("/isco08/level2", {
        params: { lang: isEnglish ? "en" : "ge" },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch ISCO08 level 2 categories:", error);
      throw error;
    }
  },

  getLevel2ByParent: async (parentCode, isEnglish = false) => {
    try {
      const response = await api.get(`/isco08/level2/parent/${parentCode}`, {
        params: { lang: isEnglish ? "en" : "ge" },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch ISCO08 level 2 categories for parent ${parentCode}:`,
        error
      );
      throw error;
    }
  },

  getByCode: async (code, isEnglish = false) => {
    try {
      const response = await api.get(`/isco08/code/${code}`, {
        params: { lang: isEnglish ? "en" : "ge" },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch ISCO08 category with code ${code}:`,
        error
      );
      throw error;
    }
  },

  getByLevel2Code: async (code, isEnglish = false) => {
    try {
      const response = await api.get(`/isco08/code/${code}`, {
        params: { lang: isEnglish ? "en" : "ge" },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch ISCO08 level 2 category with code ${code}:`,
        error
      );
      throw error;
    }
  },
};

// ISCO-88 (2017) API methods
export const isco88Api = {
  getAll: async (isEnglish = false) => {
    try {
      const response = await api.get(`/isco88?lang=${isEnglish ? "en" : "ge"}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch ISCO-88 data:", error);
      throw error;
    }
  },

  getAllLevel2: async (isEnglish = false) => {
    try {
      const response = await api.get(
        `/isco88/level2?lang=${isEnglish ? "en" : "ge"}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch ISCO-88 level 2 data:", error);
      throw error;
    }
  },

  getByCode: async (code, isEnglish = false) => {
    try {
      const response = await api.get(
        `/isco88/code/${code}?lang=${isEnglish ? "en" : "ge"}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ISCO-88 data for code ${code}:`, error);
      throw error;
    }
  },

  getLevel2ByParent: async (parentCode, isEnglish = false) => {
    try {
      const response = await api.get(
        `/isco88/level2/parent/${parentCode}?lang=${isEnglish ? "en" : "ge"}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch ISCO-88 subcategories for parent ${parentCode}:`,
        error
      );
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

export default {
  dataApi,
  activityApi,
  isco08Api,
  isco88Api,
};
