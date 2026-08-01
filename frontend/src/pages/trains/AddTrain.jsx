import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, TrainFront } from "lucide-react";
import { getRoutes, getRoute } from "../../api/routesApi";
import { addTrain } from "../../api/trainApi";
import * as S from "./styles.js";

const makeEmptyCoach = () => ({
    seat_count: "",
    price_local_per_km: "",
    price_foreign_per_km: "",
});

export default function AddTrain() {
    const [trainName, setTrainName] = useState("");
    const [routes, setRoutes] = useState([]);
    const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
    const [selectedRouteId, setSelectedRouteId] = useState("");

    const [routeStations, setRouteStations] = useState([]);
    const [isLoadingStations, setIsLoadingStations] = useState(false);
    const [stops, setStops] = useState({}); // stationId -> boolean

    const [coaches, setCoaches] = useState([makeEmptyCoach()]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getRoutes()
            .then((res) => setRoutes(res.data))
            .catch(() => setError("Could not load routes."))
            .finally(() => setIsLoadingRoutes(false));
    }, []);

    // When the route changes, fetch that route's stations (in order) and
    // default every stop to checked — most trains stop at nearly every
    // station on their route, so unticking the exceptions is less work
    // than ticking every single stop by hand.
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

                const allChecked = {};
                ordered.forEach((station) => {
                    allChecked[station.id] = true;
                });
                setStops(allChecked);
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
                setError(
                    "Fill in seat count and both rates for every coach."
                );
                return;
            }
        }

        setIsSubmitting(true);

        try {
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

            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || "Could not create train.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <S.WrapperTrain>
            <S.HeadingTrain>Add Train</S.HeadingTrain>

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
                    disabled={isSubmitting || isLoadingRoutes}
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

                {selectedRouteId && (
                    <>
                        <S.SectionLabel>
                            Stops on this route ({checkedStopCount} of{" "}
                            {routeStations.length} selected)
                        </S.SectionLabel>
                        <S.HelperText>
                            All stations start ticked — untick any this train skips.
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
                                            disabled={isSubmitting}
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

                {error && <S.ErrorTextTrain>{error}</S.ErrorTextTrain>}

                <S.SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 size={16} className="spin" />
                    ) : (
                        <TrainFront size={16} />
                    )}
                    Create Train
                </S.SubmitButton>
            </form>
        </S.WrapperTrain>
    );
}