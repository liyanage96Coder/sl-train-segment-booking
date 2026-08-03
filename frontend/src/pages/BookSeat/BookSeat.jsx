import { useState, useEffect, useMemo, useCallback } from "react";
import { Loader2, CheckCircle2, LogIn } from "lucide-react";
import { getRoutes } from "../../api/routesApi";
import { getTrainsForLeg, getSeatMap, createBooking } from "../../api/bookingApi";
import SeatGrid from "../../components/shared/SeatGrid/SeatGrid.jsx";
import LoginModal from "../../components/shared/LoginModal/LoginModal.jsx";
import * as S from "./styles.js";

export default function BookSeat() {
    // Reference data
    const [routes, setRoutes] = useState([]);
    const [routesLoading, setRoutesLoading] = useState(true);

    // Selections
    const [routeId, setRouteId] = useState("");
    const [fromStationId, setFromStationId] = useState("");
    const [toStationId, setToStationId] = useState("");
    const [travelDate, setTravelDate] = useState("");
    const [trainId, setTrainId] = useState("");

    // Derived data from the backend
    const [trains, setTrains] = useState([]);
    const [trainsLoading, setTrainsLoading] = useState(false);
    const [seatMap, setSeatMap] = useState(null); // { trip_id, coaches }
    const [seatMapLoading, setSeatMapLoading] = useState(false);

    // Passenger + seat selection
    const [localCount, setLocalCount] = useState(1);
    const [foreignCount, setForeignCount] = useState(0);
    const [selectedSeatIds, setSelectedSeatIds] = useState([]); // order matters
    const [passengerName, setPassengerName] = useState("");

    // Submission state
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    //Login
    const [showLoginModal, setShowLoginModal] = useState(false);

    const selectedRoute = useMemo(
        () => routes.find((r) => String(r.id) === String(routeId)),
        [routes, routeId]
    );

    const orderedStations = useMemo(() => {
        if (!selectedRoute) return [];
        return [...selectedRoute.stations].sort(
            (a, b) => a.pivot.stop_order - b.pivot.stop_order
        );
    }, [selectedRoute]);

    const seatsNeeded = localCount + foreignCount;

    // Lookup: seat_id -> { fare_local, fare_foreign } from whichever coach owns it
    const fareByCoachForSeat = useMemo(() => {
        const map = {};
        if (!seatMap) return map;
        seatMap.coaches.forEach((coach) => {
            coach.seats.forEach((seat) => {
                map[seat.id] = { fare_local: coach.fare_local, fare_foreign: coach.fare_foreign };
            });
        });
        return map;
    }, [seatMap]);

    const seatTypeFor = useCallback(
        (seatId) => {
            const clickIndex = selectedSeatIds.indexOf(seatId);
            if (clickIndex === -1) return null;
            return clickIndex < localCount ? "local" : "foreign";
        },
        [selectedSeatIds, localCount]
    );

    const totalFare = useMemo(() => {
        return selectedSeatIds.reduce((sum, seatId) => {
            const fares = fareByCoachForSeat[seatId];
            if (!fares) return sum;
            const type = seatTypeFor(seatId);
            return sum + Number(type === "foreign" ? fares.fare_foreign : fares.fare_local);
        }, 0);
    }, [selectedSeatIds, fareByCoachForSeat, seatTypeFor]);

    // --- Load routes once ---
    useEffect(() => {
        getRoutes()
            .then((res) => setRoutes(res.data))
            .catch(() => setError("Couldn't load routes. Refresh and try again."))
            .finally(() => setRoutesLoading(false));
    }, []);

    // --- Reset everything downstream when the route changes ---
    useEffect(() => {
        setFromStationId("");
        setToStationId("");
        setTrainId("");
        setTrains([]);
        setSeatMap(null);
        setSelectedSeatIds([]);
    }, [routeId]);

    // --- Fetch trains for the chosen leg once from/to are both set ---
    useEffect(() => {
        if (!routeId || !fromStationId || !toStationId || fromStationId === toStationId) {
            setTrains([]);
            setTrainId("");
            return;
        }

        setTrainsLoading(true);
        setError("");
        getTrainsForLeg(routeId, fromStationId, toStationId)
            .then((res) => setTrains(res.data))
            .catch(() => setError("Couldn't load trains for that leg."))
            .finally(() => setTrainsLoading(false));
    }, [routeId, fromStationId, toStationId]);

    // --- Fetch the seat map once a train + date are chosen ---
    useEffect(() => {
        if (!trainId || !travelDate || !fromStationId || !toStationId) {
            setSeatMap(null);
            return;
        }

        setSeatMapLoading(true);
        setError("");
        setSelectedSeatIds([]);
        getSeatMap(trainId, travelDate, fromStationId, toStationId)
            .then((res) => setSeatMap(res.data))
            .catch(() => setError("Couldn't load the seat map for this train."))
            .finally(() => setSeatMapLoading(false));
    }, [trainId, travelDate, fromStationId, toStationId]);

    const handleSeatClick = (seatId) => {
        setSuccessMessage("");
        setSelectedSeatIds((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            }
            if (prev.length >= seatsNeeded) {
                return prev; // already picked enough seats — ignore extra clicks
            }
            return [...prev, seatId];
        });
    };

    const refreshSeatMap = () => {
        if (!trainId || !travelDate || !fromStationId || !toStationId) return;
        getSeatMap(trainId, travelDate, fromStationId, toStationId)
            .then((res) => setSeatMap(res.data))
            .catch(() => { });
    };

    const handleConfirm = async () => {
        setError("");
        setSuccessMessage("");

        if (selectedSeatIds.length !== seatsNeeded) {
            setError(`Select exactly ${seatsNeeded} seat${seatsNeeded === 1 ? "" : "s"} (${selectedSeatIds.length} selected).`);
            return;
        }

        const payload = {
            train_id: trainId,
            travel_date: travelDate,
            from_station_id: fromStationId,
            to_station_id: toStationId,
            passenger_name: passengerName || undefined,
            seats: selectedSeatIds.map((seatId) => ({
                seat_id: seatId,
                passenger_type: seatTypeFor(seatId),
            })),
        };

        setSubmitting(true);
        try {
            const res = await createBooking(payload);
            setSuccessMessage(
                `Booking confirmed — total fare ${Number(res.data.data.total_fare).toFixed(2)}.`
            );
            setSelectedSeatIds([]);
            refreshSeatMap();
        } catch (err) {
            if (err.response?.status === 409) {
                setError(
                    Object.values(err.response.data.errors || {})[0] ||
                    "One of your seats was just booked by someone else. The seat map has been refreshed."
                );
                setSelectedSeatIds([]);
                refreshSeatMap();
            } else {
                setError("Something went wrong confirming the booking. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <S.Wrapper>
            <S.LoginWrapper>
                <S.LoginButton onClick={() => setShowLoginModal(true)}>
                    <LogIn size={16} />
                    Login
                </S.LoginButton>
            </S.LoginWrapper>
            <S.Heading>Book a Seat</S.Heading>

            {error && <S.ErrorText>{error}</S.ErrorText>}
            {successMessage && (
                <S.SuccessBanner>
                    <CheckCircle2 size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    {successMessage}
                </S.SuccessBanner>
            )}

            <S.SelectorGrid>
                <S.FieldGroup>
                    <S.FieldLabel>Route</S.FieldLabel>
                    <S.Select
                        value={routeId}
                        onChange={(e) => setRouteId(e.target.value)}
                        disabled={routesLoading}
                    >
                        <option value="">{routesLoading ? "Loading routes..." : "Select a route"}</option>
                        {routes.map((route) => (
                            <option key={route.id} value={route.id}>
                                {route.route_name}
                            </option>
                        ))}
                    </S.Select>
                </S.FieldGroup>

                <S.FieldGroup>
                    <S.FieldLabel>Travel date</S.FieldLabel>
                    <S.Input
                        type="date"
                        min={today}
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        disabled={!routeId}
                    />
                </S.FieldGroup>

                <S.FieldGroup>
                    <S.FieldLabel>From</S.FieldLabel>
                    <S.Select
                        value={fromStationId}
                        onChange={(e) => setFromStationId(e.target.value)}
                        disabled={!routeId}
                    >
                        <option value="">Select origin</option>
                        {orderedStations.map((station) => (
                            <option
                                key={station.id}
                                value={station.id}
                                disabled={String(station.id) === String(toStationId)}
                            >
                                {station.station_name}
                            </option>
                        ))}
                    </S.Select>
                </S.FieldGroup>

                <S.FieldGroup>
                    <S.FieldLabel>To</S.FieldLabel>
                    <S.Select
                        value={toStationId}
                        onChange={(e) => setToStationId(e.target.value)}
                        disabled={!routeId}
                    >
                        <option value="">Select destination</option>
                        {orderedStations.map((station) => (
                            <option
                                key={station.id}
                                value={station.id}
                                disabled={String(station.id) === String(fromStationId)}
                            >
                                {station.station_name}
                            </option>
                        ))}
                    </S.Select>
                </S.FieldGroup>
            </S.SelectorGrid>

            <S.FieldGroup style={{ marginBottom: 16 }}>
                <S.FieldLabel>Train</S.FieldLabel>
                <S.Select
                    value={trainId}
                    onChange={(e) => setTrainId(e.target.value)}
                    disabled={!fromStationId || !toStationId || trainsLoading}
                >
                    <option value="">
                        {trainsLoading
                            ? "Loading trains..."
                            : trains.length === 0
                                ? "No trains run this leg"
                                : "Select a train"}
                    </option>
                    {trains.map((train) => (
                        <option key={train.id} value={train.id}>
                            {train.train_name}
                        </option>
                    ))}
                </S.Select>
            </S.FieldGroup>

            <S.Divider />

            <S.PassengerRow>
                <S.CountField>
                    <S.CountLabel>Local passengers</S.CountLabel>
                    <S.CountInput
                        type="number"
                        min={0}
                        max={20}
                        value={localCount}
                        onChange={(e) => {
                            setSelectedSeatIds([]);
                            setLocalCount(Math.max(0, Number(e.target.value)));
                        }}
                    />
                </S.CountField>
                <S.CountField>
                    <S.CountLabel>Foreign passengers</S.CountLabel>
                    <S.CountInput
                        type="number"
                        min={0}
                        max={20}
                        value={foreignCount}
                        onChange={(e) => {
                            setSelectedSeatIds([]);
                            setForeignCount(Math.max(0, Number(e.target.value)));
                        }}
                    />
                </S.CountField>
            </S.PassengerRow>
            <S.HelperText>
                Note :-  Click seats in the order you'd like them assigned — the first {localCount || 0} clicks are
                tagged local fare, the rest foreign fare.
            </S.HelperText>

            <S.FieldGroup style={{ marginBottom: 20 }}>
                <S.FieldLabel>Passenger name (optional)</S.FieldLabel>
                <S.Input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="For the booking record"
                />
            </S.FieldGroup>

            {seatMapLoading && <p>Loading seat map...</p>}

            {seatMap &&
                seatMap.coaches.map((coach) => (
                    <SeatGrid
                        key={coach.id}
                        coach={coach}
                        selectedSeatIds={selectedSeatIds}
                        seatTypeFor={seatTypeFor}
                        onSeatClick={handleSeatClick}
                    />
                ))}
            {seatMap && (
                <S.SummaryBar>
                    <S.SummaryText>
                        {selectedSeatIds.length} / {seatsNeeded} seats selected
                        <br />
                        Total fare: <strong>{totalFare.toFixed(2)}</strong>
                    </S.SummaryText>
                    <S.ConfirmButton
                        onClick={handleConfirm}
                        disabled={submitting || selectedSeatIds.length !== seatsNeeded || seatsNeeded === 0}
                    >
                        {submitting && <Loader2 size={16} className="spin" />}
                        {submitting ? "Confirming..." : "Confirm Booking"}
                    </S.ConfirmButton>
                </S.SummaryBar>
            )}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </S.Wrapper>
    );
}