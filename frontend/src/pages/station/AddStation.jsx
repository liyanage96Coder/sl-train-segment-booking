import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { getStations, addStation } from "../../api/stationApi";
import * as S from "./styles.js";

const emptyForm = { station_name: "", station_code: "" };

export default function AddStation() {
    const [stations, setStations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const loadStations = async () => {
        try {
            setIsLoading(true);
            const res = await getStations();
            setStations(res.data);
        } catch {
            setError("Could not load stations. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStations();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddStation = async (previousId) => {
        if (!form.station_name.trim() || !form.station_code.trim()) {
            setError("Please enter a station name and code.");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await addStation({
                station_name: form.station_name.trim(),
                station_code: form.station_code.trim().toUpperCase(),
                previous_station_id: previousId,
            });

            setForm(emptyForm);
            await loadStations();
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Something went wrong adding the station. Please try again.";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <S.Wrapper>
            <S.Heading>Route Stations</S.Heading>

            <S.FormRow>
                <S.Input
                    type="text"
                    name="station_name"
                    placeholder="Station Name"
                    value={form.station_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                />
                <S.Input
                    type="text"
                    name="station_code"
                    placeholder="Station Code"
                    value={form.station_code}
                    onChange={handleChange}
                    disabled={isSubmitting}
                />
            </S.FormRow>

            {error && <S.ErrorText>{error}</S.ErrorText>}

            <S.AddAtStartButton
                onClick={() => handleAddStation(null)}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <Loader2 size={16} className="spin" />
                ) : (
                    <Plus size={16} />
                )}
                Add as first station
            </S.AddAtStartButton>

            <S.Divider />

            {isLoading && <S.EmptyState>Loading stations…</S.EmptyState>}

            {!isLoading && stations.length === 0 && (
                <S.EmptyState>No stations yet. Add the first one above.</S.EmptyState>
            )}

            {!isLoading &&
                stations.map((station) => (
                    <S.StationRow key={station.id}>
                        <S.StationLabel>
                            <S.StationOrder>{station.station_order}.</S.StationOrder>
                            {station.station_name}
                            <S.StationCode>({station.station_code})</S.StationCode>
                        </S.StationLabel>

                        <S.ActionButton
                            $variant="secondary"
                            onClick={() => handleAddStation(station.id)}
                            disabled={isSubmitting}
                        >
                            <Plus size={14} />
                            Add here
                        </S.ActionButton>
                    </S.StationRow>
                ))}
        </S.Wrapper>
    );
}