import axios from "axios";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// API methods for regions
export const regionsApi = {
  getAll: () => api.get("/regions"),
  getById: (id) => api.get(`/regions/${id}`),
  getByRegionId: (regionId) => api.get(`/regions/byregion/${regionId}`),
};

// Function to test database connection
export const testDbConnection = () => api.get("/test-db");

export default api;
