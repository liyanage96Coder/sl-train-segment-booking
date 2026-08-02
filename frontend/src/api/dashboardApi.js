import api from "../services/axios";

export const getDashboardStats = () => api.get("/dashboard");