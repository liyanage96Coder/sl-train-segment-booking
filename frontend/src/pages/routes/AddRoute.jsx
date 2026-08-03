import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Route as RouteIcon } from "lucide-react";
import Header from "../../components/shared/Header/Header.jsx";
import { getStations } from "../../api/stationApi";
import { addRoute, getRoute, updateRoute } from "../../api/routesApi";
import * as S from "./styles.js";

export default function AddRoute() {
    const { routeId } = useParams(); // undefined when adding, a string when editing
    const isEditing = Boolean(routeId);
    const navigate = useNavigate();

    const [stations, setStations] = useState([]);
    const [isLoadingStations, setIsLoadingStations] = useState(true);
    const [isLoadingRoute, setIsLoadingRoute] = useState(isEditing);
    const [routeName, setRouteName] = useState("");
    // Map of stationId -> stop_order, only present for checked stations.
    const [selected, setSelected] = useState({});
    const [distances, setDistances] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Load the existing route (only in edit mode) and seed selected/distances from it.
    useEffect(() => {
        if (!isEditing) return;

        getRoute(routeId)
            .then((res) => {
                const route = res.data;
                setRouteName(route.route_name);

                const nextSelected = {};
                const nextDistances = {};
                route.stations.forEach((s) => {
                    nextSelected[s.id] = s.pivot.stop_order;
                    nextDistances[s.id] = s.pivot.distance_km;
                });
                setSelected(nextSelected);
                setDistances(nextDistances);
            })
            .catch(() => setError("Couldn't load this route."))
            .finally(() => setIsLoadingRoute(false));
    }, [routeId, isEditing]);

    useEffect(() => {
        getStations()
            .then((res) => setStations(res.data))
            .catch(() => setError("Could not load stations."))
            .finally(() => setIsLoadingStations(false));
    }, []);

    const selectedCount = Object.keys(selected).length;

    // Numbers already claimed by OTHER stations — used to filter each
    // dropdown's own options so no two stations can hold the same order.
    const usedOrdersExcluding = (stationId) =>
        new Set(
            Object.entries(selected)
                .filter(([id]) => Number(id) !== stationId)
                .map(([, order]) => order)
        );

    const smallestAvailableOrder = (excludeStationId) => {
        const used = usedOrdersExcluding(excludeStationId);
        for (let n = 1; n <= selectedCount + 1; n += 1) {
            if (!used.has(n)) return n;
        }
        return selectedCount + 1;
    };

    const handleToggle = (station) => {
        setSelected((prev) => {
            const next = { ...prev };

            if (station.id in next) {
                delete next[station.id];
                setDistances((prevDist) => {
                    const { [station.id]: _, ...rest } = prevDist;
                    return rest;
                });
                const remaining = Object.entries(next).sort((a, b) => a[1] - b[1]);
                remaining.forEach(([id], index) => {
                    next[id] = index + 1;
                });
            } else {
                next[station.id] = smallestAvailableOrder(station.id);
            }

            return next;
        });
    };

    const handleOrderChange = (stationId, newOrder) => {
        setSelected((prev) => ({ ...prev, [stationId]: Number(newOrder) }));
    };

    const handleDistanceChange = (stationId, value) => {
        setDistances((prev) => ({ ...prev, [stationId]: value }));
    };

    const orderOptionsFor = (stationId) => {
        const used = usedOrdersExcluding(stationId);
        const options = [];
        for (let n = 1; n <= selectedCount; n += 1) {
            if (!used.has(n) || n === selected[stationId]) {
                options.push(n);
            }
        }
        return options;
    };

    const stationRows = useMemo(
        () =>
            stations.map((station) => ({
                ...station,
                isChecked: station.id in selected,
                order: selected[station.id],
            })),
        [stations, selected]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!routeName.trim()) {
            setError("Please enter a route name.");
            return;
        }

        if (selectedCount < 2) {
            setError("Select at least two stations for the route.");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        const payload = {
            route_name: routeName.trim(),
            stations: Object.entries(selected).map(([station_id, stop_order]) => ({
                station_id: Number(station_id),
                stop_order,
                distance_km: Number(distances[station_id] || 0),
            })),
        };

        try {
            if (isEditing) {
                await updateRoute(routeId, payload);
            } else {
                await addRoute(payload);
            }
            navigate("/routes");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                (isEditing ? "Could not update route." : "Could not create route.")
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingRoute) {
        return (
            <S.Wrapper>
                <S.Heading>Edit Route</S.Heading>
                <p>Loading route…</p>
            </S.Wrapper>
        );
    }

    return (
        <S.Wrapper>
            <Header
                title="Add Routes"
                subtitle="Add routes on the network."
            />
            <S.Heading>{isEditing ? "Edit Route" : "Add Route"}</S.Heading>

            <form onSubmit={handleSubmit}>
                <S.Input
                    type="text"
                    placeholder="Route name (e.g. Colombo Fort - Badulla Express)"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    disabled={isSubmitting}
                />

                {error && <S.ErrorText>{error}</S.ErrorText>}

                <S.HelperText>
                    Check the stations on this route, then set the order each one is
                    reached in.
                </S.HelperText>

                <S.StationList>
                    {isLoadingStations && (
                        <S.StationRow as="div">Loading stations…</S.StationRow>
                    )}

                    {!isLoadingStations &&
                        stationRows.map((station) => (
                            <S.StationRow key={station.id}>
                                <S.Checkbox
                                    type="checkbox"
                                    checked={station.isChecked}
                                    onChange={() => handleToggle(station)}
                                    disabled={isSubmitting}
                                />

                                <S.StationName>
                                    {station.station_name} ({station.station_code})
                                </S.StationName>

                                {station.isChecked && (
                                    <>
                                        <S.OrderSelect
                                            value={station.order}
                                            onChange={(e) =>
                                                handleOrderChange(station.id, e.target.value)
                                            }
                                            disabled={isSubmitting}
                                        >
                                            {orderOptionsFor(station.id).map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </S.OrderSelect>
                                        <S.DistanceInput
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            placeholder="km"
                                            value={distances[station.id] || ""}
                                            onChange={(e) => handleDistanceChange(station.id, e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                        <S.DistanceLabel>km from origin</S.DistanceLabel>
                                    </>
                                )}
                            </S.StationRow>
                        ))}
                </S.StationList>

                <S.SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 size={16} className="spin" />
                    ) : (
                        <RouteIcon size={16} />
                    )}
                    {isEditing ? "Save Changes" : "Create Route"}
                </S.SubmitButton>
            </form>
        </S.Wrapper>
    );
}