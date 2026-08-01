import api from "../services/axios";

export const getTrains = () => api.get("/trains");

export const getTrain = (id) => {return api.get(`/trains/${id}`);};

export const addTrain = (data) => api.post("/trains", data);

export const updateTrain = (id, data) => api.put(`/trains/${id}`, data);

export const deleteTrain = (id) => api.delete(`/trains/${id}`);