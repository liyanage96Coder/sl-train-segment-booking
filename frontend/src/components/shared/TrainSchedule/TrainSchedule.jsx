import { useEffect, useMemo, useState } from "react";
import Header from "../Header/Header.jsx";
import { getTrains } from "../../../api/trainApi.js";
import { getTrainSchedule, deleteBooking, getBookedDates } from "../../../api/bookingApi.js";
import * as S from "./styles.js";

const ROW_HEIGHT = 44;
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const toDateKey = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export default function TrainSchedule() {
    const [trains, setTrains] = useState([]);
    const [trainId, setTrainId] = useState("");

    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(
        toDateKey(today.getFullYear(), today.getMonth(), today.getDate())
    );

    const [schedule, setSchedule] = useState(null);
    const [coachId, setCoachId] = useState("");
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookedDates, setBookedDates] = useState(new Set());

    useEffect(() => {
        getTrains()
            .then((res) => setTrains(res.data))
            .catch(() => setError("Could not load trains."));
    }, []);

    useEffect(() => {
        if (!trainId || !selectedDate) {
            setSchedule(null);
            return;
        }

        getTrainSchedule(trainId, selectedDate)
            .then((res) => {
                setSchedule(res.data);
                setCoachId((prev) =>
                    res.data.coaches.some((c) => c.id === prev) ? prev : res.data.coaches[0]?.id ?? ""
                );
            })
            .catch(() => setError("Could not load the schedule."));
    }, [trainId, selectedDate]);

    useEffect(() => {
        if (!trainId) {
            setBookedDates(new Set());
            return;
        }

        getBookedDates(trainId)
            .then((res) => setBookedDates(new Set(res.data)))
            .catch(() => setError("Could not load booked dates."));
    }, [trainId]);

    const days = useMemo(() => {
        const firstDow = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
        const cells = [];

        for (let i = 0; i < firstDow; i++) {
            const d = daysInPrevMonth - firstDow + 1 + i;
            const m = viewMonth === 0 ? 11 : viewMonth - 1;
            const y = viewMonth === 0 ? viewYear - 1 : viewYear;
            cells.push({ day: d, key: toDateKey(y, m, d), isOtherMonth: true });
        }
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push({ day: d, key: toDateKey(viewYear, viewMonth, d), isOtherMonth: false });
        }
        const remainder = (firstDow + daysInMonth) % 7;
        if (remainder > 0) {
            const m = viewMonth === 11 ? 0 : viewMonth + 1;
            const y = viewMonth === 11 ? viewYear + 1 : viewYear;
            for (let i = 1; i <= 7 - remainder; i++) {
                cells.push({ day: i, key: toDateKey(y, m, i), isOtherMonth: true });
            }
        }
        return cells;
    }, [viewYear, viewMonth]);

    const goPrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };
    const goNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };
    const goToday = () => {
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
        setSelectedDate(toDateKey(today.getFullYear(), today.getMonth(), today.getDate()));
    };

    const activeCoach = schedule?.coaches.find((c) => c.id === coachId);
    const routeStations = schedule?.route_stations ?? [];

    const bookingsForSeat = (seatId) =>
        (schedule?.bookings ?? []).filter((b) => b.seat_id === seatId);

    const handleDelete = async () => {
        if (!selectedBooking) return;
        const confirmed = window.confirm("Delete this booking? This can't be undone.");
        if (!confirmed) return;

        try {
            await deleteBooking(selectedBooking.booking_id);
            setSelectedBooking(null);
            const res = await getTrainSchedule(trainId, selectedDate);
            setSchedule(res.data);
        } catch {
            setError("Could not delete booking.");
        }
    };

    return (
        <S.Wrapper>
            <Header title="Train Schedule" subtitle="Select a train and date to view seat bookings." />

            {error && <S.ErrorText>{error}</S.ErrorText>}
            <S.ContentWrapper>
                <S.TopControls>
                    <S.Select value={trainId} onChange={(e) => setTrainId(e.target.value)}>
                        <option value="">Select a Train</option>
                        {trains.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.train_name}
                            </option>
                        ))}
                    </S.Select>

                    <S.CalendarPanel>
                        <S.CalendarHeader>
                            <S.TodayButton onClick={goToday}>Today</S.TodayButton>
                            <S.CalendarTitle>
                                {MONTHS[viewMonth]} {viewYear}
                            </S.CalendarTitle>
                            <div>
                                <S.NavButton onClick={goPrevMonth}>‹</S.NavButton>
                                <S.NavButton onClick={goNextMonth}>›</S.NavButton>
                            </div>
                        </S.CalendarHeader>

                        <S.CalendarGrid>
                            {DAY_LABELS.map((l, i) => (
                                <S.DayLabel key={i}>{l}</S.DayLabel>
                            ))}
                            {days.map((cell) => (
                                <S.DayCell
                                    key={cell.key}
                                    $isOtherMonth={cell.isOtherMonth}
                                    $isSelected={cell.key === selectedDate}
                                    $hasBooking={bookedDates.has(cell.key)}
                                    onClick={() => setSelectedDate(cell.key)}
                                >
                                    {cell.day}
                                </S.DayCell>
                            ))}
                        </S.CalendarGrid>
                    </S.CalendarPanel>
                </S.TopControls>

                {schedule ? (
                    <S.CoachWrapper>
                        <S.CoachTabs>
                            {schedule.coaches.map((c) => (
                                <S.CoachTab
                                    key={c.id}
                                    $active={c.id === coachId}
                                    onClick={() => setCoachId(c.id)}
                                >
                                    Coach {c.coach_number}
                                </S.CoachTab>
                            ))}
                        </S.CoachTabs>

                        <S.GridArea>
                            <S.HeaderRow>
                                <S.HeaderCell $isStationCol>Station</S.HeaderCell>
                                {activeCoach?.seats.map((seat) => (
                                    <S.HeaderCell key={seat.id}>Seat {seat.seat_number}</S.HeaderCell>
                                ))}
                            </S.HeaderRow>

                            {routeStations.map((station, rowIndex) => (
                                <S.BodyRow key={station.id}>
                                    <S.StationCell>{station.station_name}</S.StationCell>

                                    {activeCoach?.seats.map((seat) => {
                                        if (rowIndex !== 0) return <S.SeatColumn key={seat.id} />;
                                        const bookings = bookingsForSeat(seat.id);
                                        return (
                                            <S.SeatColumn key={seat.id}>
                                                {bookings.map((b) => {
                                                    const top = (b.from_stop_order - 1) * ROW_HEIGHT;
                                                    const height =
                                                        (b.to_stop_order - b.from_stop_order) * ROW_HEIGHT - 2;

                                                    return (
                                                        <S.BookingBlock
                                                            key={b.booking_seat_id}
                                                            $top={top}
                                                            $height={height}
                                                            $type={b.passenger_type}
                                                            title={`${b.passenger_name || "Passenger"} — ${b.from_station_name} → ${b.to_station_name}`}
                                                            onClick={() => setSelectedBooking(b)}
                                                        >
                                                            {b.passenger_type === "foreign" ? "F" : "L"}
                                                        </S.BookingBlock>
                                                    );
                                                })}
                                            </S.SeatColumn>
                                        );
                                    })}
                                </S.BodyRow>
                            ))}
                        </S.GridArea>
                    </S.CoachWrapper>
                ):(
                "Please select a train and date to check availability."
                )}
            </S.ContentWrapper>

            {selectedBooking && (
                <S.PopupOverlay onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}>
                    <S.PopupContainer>
                        <S.PopupHeader>
                            <S.PopupTitle>Booking Details</S.PopupTitle>
                            <S.CloseButton onClick={() => setSelectedBooking(null)}>✕</S.CloseButton>
                        </S.PopupHeader>

                        <S.InfoRow>
                            <span>Passenger</span>
                            <span>{selectedBooking.passenger_name || "N/A"}</span>
                        </S.InfoRow>
                        <S.InfoRow>
                            <span>Type</span>
                            <span>{selectedBooking.passenger_type}</span>
                        </S.InfoRow>
                        <S.InfoRow>
                            <span>From</span>
                            <span>{selectedBooking.from_station_name}</span>
                        </S.InfoRow>
                        <S.InfoRow>
                            <span>To</span>
                            <span>{selectedBooking.to_station_name}</span>
                        </S.InfoRow>
                        <S.InfoRow>
                            <span>Fare</span>
                            <span>{selectedBooking.fare}</span>
                        </S.InfoRow>

                        <S.DeleteButton onClick={handleDelete}>Delete Booking</S.DeleteButton>
                    </S.PopupContainer>
                </S.PopupOverlay>
            )}

        </S.Wrapper>
    );
}