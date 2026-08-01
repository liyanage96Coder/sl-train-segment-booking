import { useEffect, useRef, useState } from "react"; import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Loader2, TrainFront } from "lucide-react";
import { getRoutes, getRoute } from "../../api/routesApi";
import { getTrain, addTrain, updateTrain } from "../../api/trainApi";
import * as S from "./styles.js";

const makeEmptyCoach = () => ({
    seat_count: "",
    price_local_per_km: "",
    price_foreign_per_km: "",
});

export default function AddTrain() {
    const { trainId } = useParams();
    const isEditing = Boolean(trainId);
    const navigate = useNavigate();

    const [trainName, setTrainName] = useState("");
    const [routes, setRoutes] = useState([]);
    const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
    const [isLoadingTrain, setIsLoadingTrain] = useState(isEditing);
    const [selectedRouteId, setSelectedRouteId] = useState("");

    const [routeStations, setRouteStations] = useState([]);
    const [isLoadingStations, setIsLoadingStations] = useState(false);
    const [stops, setStops] = useState({}); // stationId -> boolean

    const [coaches, setCoaches] = useState([makeEmptyCoach()]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [hasBookings, setHasBookings] = useState(false);
    const pendingStopIds = useRef(null);
    const [originalStopIds, setOriginalStopIds] = useState(new Set());

    useEffect(() => {
        getRoutes()
            .then((res) => setRoutes(res.data))
            .catch(() => setError("Could not load routes."))
            .finally(() => setIsLoadingRoutes(false));
    }, []);

    useEffect(() => {
        if (!isEditing) return;

        getTrain(trainId)
            .then((res) => {
                const train = res.data;
                setTrainName(train.train_name);
                setSelectedRouteId(train.route_id);
                setHasBookings(train.has_bookings);
                const stopIds = train.stops.map((s) => s.id);
                pendingStopIds.current = stopIds;
                setOriginalStopIds(new Set(stopIds));
            })
            .catch(() => setError("Couldn't load this train."))
            .finally(() => setIsLoadingTrain(false));
    }, [trainId, isEditing]);

    useEffect(() => {
        if (!selectedRouteId) {
            setRouteStations([]);
            setStops({});
            return;
        }

        setIsLoadingStations(true);
        getRoute(selectedRouteId)
            .then((res) => {
                const ordered = [...res.data.stations].sort(
                    (a, b) => a.pivot.stop_order - b.pivot.stop_order
                );
                setRouteStations(ordered);

                const checked = {};
                if (pendingStopIds.current) {
                    // Editing: restore this train's actual stops, then clear the stash.
                    ordered.forEach((station) => {
                        checked[station.id] = pendingStopIds.current.includes(station.id);
                    });
                    pendingStopIds.current = null;
                } else {
                    ordered.forEach((station) => {
                        checked[station.id] = true;
                    });
                }
                setStops(checked);
            })
            .catch(() => setError("Could not load stations for that route."))
            .finally(() => setIsLoadingStations(false));
    }, [selectedRouteId]);

    const toggleStop = (stationId) => {
        setStops((prev) => ({ ...prev, [stationId]: !prev[stationId] }));
    };

    const checkedStopCount = Object.values(stops).filter(Boolean).length;

    const handleCoachChange = (index, field, value) => {
        setCoaches((prev) =>
            prev.map((coach, i) =>
                i === index ? { ...coach, [field]: value } : coach
            )
        );
    };

    const addCoachRow = () => {
        setCoaches((prev) => [...prev, makeEmptyCoach()]);
    };

    const removeCoachRow = (index) => {
        setCoaches((prev) => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setTrainName("");
        setSelectedRouteId("");
        setRouteStations([]);
        setStops({});
        setCoaches([makeEmptyCoach()]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!trainName.trim()) {
            setError("Please enter a train name.");
            return;
        }

        if (!selectedRouteId) {
            setError("Please select a route.");
            return;
        }

        const selectedStopIds = Object.entries(stops)
            .filter(([, checked]) => checked)
            .map(([stationId]) => Number(stationId));

        if (selectedStopIds.length < 2) {
            setError("At least two stops must stay ticked.");
            return;
        }


        if (!isEditing) {
            if (coaches.length === 0) {
                setError("Add at least one coach.");
                return;
            }

            for (const coach of coaches) {
                if (
                    !coach.seat_count ||
                    !coach.price_local_per_km ||
                    !coach.price_foreign_per_km
                ) {
                    setError("Fill in seat count and both rates for every coach.");
                    return;
                }
            }
        }

        setIsSubmitting(true);

        try {
            if (isEditing) {
                await updateTrain(trainId, {
                    train_name: trainName.trim(),
                    stop_station_ids: selectedStopIds,
                });
            } else {
                await addTrain({
                    train_name: trainName.trim(),
                    route_id: Number(selectedRouteId),
                    stop_station_ids: selectedStopIds,
                    coaches: coaches.map((c) => ({
                        seat_count: Number(c.seat_count),
                        price_local_per_km: Number(c.price_local_per_km),
                        price_foreign_per_km: Number(c.price_foreign_per_km),
                    })),
                });
            }

            navigate("/trains");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                (isEditing ? "Could not update train." : "Could not create train.")
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingTrain) {
        return (
            <S.WrapperTrain>
                <S.HeadingTrain>Edit Train</S.HeadingTrain>
                <p>Loading train…</p>
            </S.WrapperTrain>
        );
    }

    return (
        <S.WrapperTrain>
            <S.HeadingTrain>{isEditing ? "Edit Train" : "Add Train"}</S.HeadingTrain>

            <form onSubmit={handleSubmit}>
                <S.Input
                    type="text"
                    placeholder="Train name (e.g. Udarata Menike)"
                    value={trainName}
                    onChange={(e) => setTrainName(e.target.value)}
                    disabled={isSubmitting}
                />

                <S.SectionLabel>Route</S.SectionLabel>
                <S.Select
                    value={selectedRouteId}
                    onChange={(e) => setSelectedRouteId(e.target.value)}
                    disabled={isSubmitting || isLoadingRoutes || isEditing}
                >
                    <option value="">
                        {isLoadingRoutes ? "Loading routes…" : "Select a route"}
                    </option>
                    {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                            {route.route_name}
                        </option>
                    ))}
                </S.Select>
                {isEditing && (
                    <S.HelperText>
                        Route can't be changed after a train is created.
                    </S.HelperText>
                )}

                {selectedRouteId && (
                    <>
                        <S.SectionLabel>
                            Stops on this route ({checkedStopCount} of{" "}
                            {routeStations.length} selected)
                        </S.SectionLabel>
                        <S.HelperText>
                            {hasBookings
                                ? "This train already has bookings, so its stops can't be changed."
                                : "All stations start ticked — untick any this train skips."}
                        </S.HelperText>
                        <S.StopList style={{ marginTop: 8 }}>
                            {isLoadingStations && (
                                <S.StopRow as="div">Loading stations…</S.StopRow>
                            )}

                            {!isLoadingStations &&
                                routeStations.map((station) => (
                                    <S.StopRow key={station.id}>
                                        <S.Checkbox
                                            type="checkbox"
                                            checked={!!stops[station.id]}
                                            onChange={() => toggleStop(station.id)}
                                            disabled={isSubmitting || (hasBookings && originalStopIds.has(station.id))}
                                        />
                                        <S.StopName>
                                            {station.pivot.stop_order}. {station.station_name} (
                                            {station.station_code})
                                        </S.StopName>
                                    </S.StopRow>
                                ))}
                        </S.StopList>
                    </>
                )}

                {!hasBookings  && (
                    <>
                        <S.SectionLabel>Coaches</S.SectionLabel>

                        {coaches.map((coach, index) => (
                            <S.CoachCard key={index}>
                                <S.CoachTitle>Coach {index + 1}</S.CoachTitle>

                                {coaches.length > 1 && (
                                    <S.RemoveCoachButton
                                        type="button"
                                        onClick={() => removeCoachRow(index)}
                                        disabled={isSubmitting}
                                    >
                                        <Trash2 size={12} />
                                    </S.RemoveCoachButton>
                                )}

                                <S.CoachFieldRow>
                                    <S.CoachFieldGroup>
                                        <S.CoachFieldLabel>Seats</S.CoachFieldLabel>
                                        <S.Input
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 60"
                                            value={coach.seat_count}
                                            onChange={(e) =>
                                                handleCoachChange(index, "seat_count", e.target.value)
                                            }
                                            disabled={isSubmitting}
                                        />
                                    </S.CoachFieldGroup>

                                    <S.CoachFieldGroup>
                                        <S.CoachFieldLabel>Local Rate (LKR/km)</S.CoachFieldLabel>
                                        <S.Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="e.g. 12.50"
                                            value={coach.price_local_per_km}
                                            onChange={(e) =>
                                                handleCoachChange(
                                                    index,
                                                    "price_local_per_km",
                                                    e.target.value
                                                )
                                            }
                                            disabled={isSubmitting}
                                        />
                                    </S.CoachFieldGroup>

                                    <S.CoachFieldGroup>
                                        <S.CoachFieldLabel>Foreign Rate (USD/km)</S.CoachFieldLabel>
                                        <S.Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="e.g. 0.15"
                                            value={coach.price_foreign_per_km}
                                            onChange={(e) =>
                                                handleCoachChange(
                                                    index,
                                                    "price_foreign_per_km",
                                                    e.target.value
                                                )
                                            }
                                            disabled={isSubmitting}
                                        />
                                    </S.CoachFieldGroup>
                                </S.CoachFieldRow>
                            </S.CoachCard>
                        ))}

                        <S.AddCoachButton
                            type="button"
                            onClick={addCoachRow}
                            disabled={isSubmitting}
                        >
                            <Plus size={16} />
                            Add New Coach
                        </S.AddCoachButton>
                    </>
                )}

                {error && <S.ErrorTextTrain>{error}</S.ErrorTextTrain>}

                <S.SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 size={16} className="spin" />
                    ) : (
                        <TrainFront size={16} />
                    )}
                    {isEditing ? "Save Changes" : "Create Train"}
                </S.SubmitButton>
            </form>
        </S.WrapperTrain>
    );
}