import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getRoutes, deleteRoute } from "../../api/routesApi";
import Table from "../../components/shared/Table/Table.jsx";
import * as S from "./styles.js";

export default function RouteList() {
    const [routes, setRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadRoutes = async () => {
        try {
            setIsLoading(true);
            const res = await getRoutes();
            setRoutes(res.data);
        } catch {
            setError("Could not load routes.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRoutes();
    }, []);

    const handleDelete = async (route) => {
        const confirmed = window.confirm(
            `Delete route "${route.route_name}"? This can't be undone.`
        );
        if (!confirmed) return;

        setDeletingId(route.id);
        setError(null);

        try {
            await deleteRoute(route.id);
            await loadRoutes();
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete route.");
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        {
            key: "route_name",
            header: "Route Name",
        },
        {
            key: "station_count",
            header: "No. of Stations",
            width: "140px",
            render: (route) => (
                <S.StationCount>{route.stations?.length ?? 0}</S.StationCount>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            width: "100px",
            render: (route) => (
                <S.ActionsCell>
                    <S.IconButton disabled={deletingId === route.id}>
                        <Pencil size={14} />
                    </S.IconButton>
                    <S.IconButton
                        $variant="danger"
                        onClick={() => handleDelete(route)}
                        disabled={deletingId === route.id}
                    >
                        <Trash2 size={14} />
                    </S.IconButton>
                </S.ActionsCell>
            ),
        },
    ];

    return (
        <S.Wrapper>
            <S.Heading>Routes</S.Heading>

            {error && <S.ErrorText>{error}</S.ErrorText>}

            <Table
                columns={columns}
                rows={routes}
                rowKey="id"
                emptyMessage={isLoading ? "Loading routes…" : "No routes yet."}
            />
        </S.Wrapper>
    );
}