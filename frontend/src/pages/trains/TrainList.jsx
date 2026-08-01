import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getTrains, deleteTrain } from "../../api/trainApi";
import Table from "../../components/shared/Table/Table.jsx";
import * as S from "./styles.js";

export default function TrainList() {
    const [trains, setTrains] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadTrains = async () => {
        try {
            setIsLoading(true);
            const res = await getTrains();
            setTrains(res.data);
        } catch {
            setError("Could not load trains.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTrains();
    }, []);

    const handleDelete = async (train) => {
        const confirmed = window.confirm(
            `Delete train "${train.train_name}"? This can't be undone.`
        );
        if (!confirmed) return;

        setDeletingId(train.id);
        setError(null);

        try {
            await deleteTrain(train.id);
            await loadTrains();
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete train.");
        } finally {
            setDeletingId(null);
        }
    };

    const totalSeats = (train) =>
        train.coaches.reduce((sum, c) => sum + c.seat_count, 0);

    const columns = [
        { key: "train_name", header: "Train Name" },
        {
            key: "route",
            header: "Route",
            render: (train) => <S.RouteText>{train.route.route_name}</S.RouteText>,
        },
        {
            key: "coaches",
            header: "Coaches",
            width: "100px",
            render: (train) => <S.Badge>{train.coaches.length}</S.Badge>,
        },
        {
            key: "seats",
            header: "Total Seats",
            width: "110px",
            render: (train) => <S.Badge>{totalSeats(train)}</S.Badge>,
        },
        {
            key: "stops",
            header: "Stops",
            width: "90px",
            render: (train) => <S.Badge>{train.stops.length}</S.Badge>,
        },
        {
            key: "actions",
            header: "Actions",
            width: "70px",
            render: (train) => (
                <S.IconButton
                    onClick={() => handleDelete(train)}
                    disabled={deletingId === train.id}
                >
                    <Trash2 size={14} />
                </S.IconButton>
            ),
        },
    ];

    return (
        <S.Wrapper>
            <S.Heading>Trains</S.Heading>

            {error && <S.ErrorText>{error}</S.ErrorText>}

            <Table
                columns={columns}
                rows={trains}
                rowKey="id"
                emptyMessage={isLoading ? "Loading trains…" : "No trains yet."}
            />
        </S.Wrapper>
    );
}