import api from "../services/axios";

export const getTrains = () => api.get("/trains");
export const addTrain = (data) => api.post("/trains", data);
export const deleteTrain = (id) => api.delete(`/trains/${id}`);