import api from "../services/axios";

export const getTrainsForLeg = (routeId, fromStationId, toStationId) =>
    api.get("/trains/for-leg", {
        params: {
            route_id: routeId,
            from_station_id: fromStationId,
            to_station_id: toStationId,
        },
    });

export const getSeatMap = (trainId, travelDate, fromStationId, toStationId) =>
    api.get(`/trains/${trainId}/seat-map`, {
        params: {
            travel_date: travelDate,
            from_station_id: fromStationId,
            to_station_id: toStationId,
        },
    });

export const createBooking = (data) => api.post("/bookings", data);