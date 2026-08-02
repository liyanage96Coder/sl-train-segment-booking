import { useEffect, useMemo, useState } from "react";
import Header from "../../components/shared/Header/Header.jsx";
import { getBookings } from "../../api/bookingApi";
import Table from "../../components/shared/Table/Table.jsx";
import TrainSchedule from "../../components/shared/TrainSchedule/TrainSchedule.jsx";
import * as S from "./styles.js";

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const loadBookings = async () => {
        try {
            setIsLoading(true);
            const res = await getBookings();
            setBookings(res.data);
        } catch {
            setError("Could not load bookings.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const visibleBookings = useMemo(() => {
        if (!selectedDate) return bookings;
        return bookings.filter((b) => b.trip.travel_date === selectedDate);
    }, [bookings, selectedDate]);

    const columns = [
        {
            key: "train",
            header: "Train",
            render: (booking) => booking.trip.train.train_name,
        },
        {
            key: "date",
            header: "Date",
            width: "120px",
            render: (booking) => <S.DateText>{booking.trip.travel_date}</S.DateText>,
        },
        {
            key: "from",
            header: "Start Station",
            render: (booking) => (
                <S.RouteText>{booking.from_station.station_name}</S.RouteText>
            ),
        },
        {
            key: "to",
            header: "End Station",
            render: (booking) => (
                <S.RouteText>{booking.to_station.station_name}</S.RouteText>
            ),
        },
        {
            key: "seats",
            header: "Seats",
            width: "80px",
            render: (booking) => <S.Badge>{booking.booking_seats.length}</S.Badge>,
        },
        {
            key: "total_fare",
            header: "Total Fare",
            width: "100px",
            render: (booking) => <S.FareText>{booking.total_fare}</S.FareText>,
        },
    ];

    return (
        <S.Wrapper>
            <Header
                title="Bookings"
                subtitle="All confirmed seat bookings across every train."
            />

            {error && <S.ErrorText>{error}</S.ErrorText>}
            <TrainSchedule/>
            <Table
                columns={columns}
                rows={visibleBookings}
                rowKey="id"
                emptyMessage={
                    isLoading
                        ? "Loading bookings…"
                        : selectedDate
                            ? "No bookings on this date."
                            : "No bookings yet."
                }
            />
        </S.Wrapper>
    );
}