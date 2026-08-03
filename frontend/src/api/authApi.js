import api from "../services/axios";

export const login = (email, password) => api.post("/login", { email, password });
export const logout = () => api.post("/logout");
export const getMe = () => api.get("/me");