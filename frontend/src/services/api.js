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

// API methods for regions
export const regionsApi = {
  getAll: async () => {
    try {
      const response = await api.get("/regions");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch regions:", error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/regions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch region with ID ${id}:`, error);
      throw error;
    }
  },
  getByRegionId: async (regionId) => {
    try {
      const response = await api.get(`/regions/byregion/${regionId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch data for region ${regionId}:`, error);
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
