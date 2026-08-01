import { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { getStations, updateStation, deleteStation } from "../../api/stationApi";
import Table from "../../components/shared/Table/Table.jsx";
import * as S from "./styles.js";

export default function StationList() {
    const [stations, setStations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ station_name: "", station_code: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const loadStations = async () => {
        try {
            setIsLoading(true);
            const res = await getStations();
            setStations(res.data);
        } catch {
            setError("Could not load stations.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStations();
    }, []);

    const startEdit = (station) => {
        setEditingId(station.id);
        setEditForm({
            station_name: station.station_name,
            station_code: station.station_code,
        });
        setError(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = async (id) => {
        if (!editForm.station_name.trim() || !editForm.station_code.trim()) {
            setError("Station name and code can't be empty.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await updateStation(id, {
                station_name: editForm.station_name.trim(),
                station_code: editForm.station_code.trim().toUpperCase(),
            });
            setEditingId(null);
            await loadStations();
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not update station."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (station) => {
        const confirmed = window.confirm(
            `Delete "${station.station_name}"? This can't be undone.`
        );
        if (!confirmed) return;

        setDeletingId(station.id);
        setError(null);

        try {
            await deleteStation(station.id);
            await loadStations();
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not delete station."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        {
            key: "station_order",
            header: "#",
            width: "48px",
        },
        {
            key: "station_code",
            header: "Code",
            render: (row) =>
                editingId === row.id ? (
                    <S.EditInput
                        value={editForm.station_code}
                        onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, station_code: e.target.value }))
                        }
                        disabled={true}
                    />
                ) : (
                    row.station_code
                ),
        },
        {
            key: "station_name",
            header: "Station Name",
            render: (row) =>
                editingId === row.id ? (
                    <S.EditInput
                        value={editForm.station_name}
                        onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, station_name: e.target.value }))
                        }
                        disabled={isSaving}
                    />
                ) : (
                    row.station_name
                ),
        },
        {
            key: "actions",
            header: "Actions",
            width: "120px",
            render: (row) => {
                if (editingId === row.id) {
                    return (
                        <S.ActionsCell>
                            <S.IconButton onClick={() => saveEdit(row.id)} disabled={isSaving}>
                                <Check size={16} />
                            </S.IconButton>
                            <S.IconButton onClick={cancelEdit} disabled={isSaving}>
                                <X size={16} />
                            </S.IconButton>
                        </S.ActionsCell>
                    );
                }

                return (
                    <S.ActionsCell>
                        <S.IconButton onClick={() => startEdit(row)} disabled={deletingId === row.id}>
                            <Pencil size={14} />
                        </S.IconButton>
                        <S.IconButton
                            $variant="danger"
                            onClick={() => handleDelete(row)}
                            disabled={deletingId === row.id}
                        >
                            <Trash2 size={14} />
                        </S.IconButton>
                    </S.ActionsCell>
                );
            },
        },
    ];

    return (
        <S.WrapperList>
            <S.HeadingList>Stations</S.HeadingList>

            {error && <S.ErrorTextList>{error}</S.ErrorTextList>}

            <Table
                columns={columns}
                rows={stations}
                rowKey="id"
                emptyMessage={isLoading ? "Loading stations…" : "No stations yet."}
            />
        </S.WrapperList>
    );
}