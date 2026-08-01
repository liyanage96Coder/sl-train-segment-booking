import api from "../services/axios";


export const getStations = () => {
    return api.get("/stations");
};

export const addStation = (data) => {
    return api.post("/stations/insert-between",data);
};

export const updateStation = (id, data) => {
    return api.put(`/stations/${id}`, data);
};

export const deleteStation = (id) => {
    return api.delete(`/stations/${id}`);
};