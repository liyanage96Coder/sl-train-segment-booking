import api from "../services/axios";

export const getRoutes = () => {
    return api.get("/routes");
};

export const getRoute = (id) => {
    return api.get(`/routes/${id}`);
};

export const addRoute = (data) => {
    return api.post("/routes", data);
};

export const updateRoute = (id, data) => {
    return api.put(`/routes/${id}`, data);
};

export const deleteRoute = (id) => {
    return api.delete(`/routes/${id}`);
};