import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Wallet,
    Ticket,
    Armchair,
    CalendarClock,
} from "lucide-react";
import Header from "../../components/shared/Header/Header.jsx";
import { getDashboardStats } from "../../api/dashboardApi";
import Table from "../../components/shared/Table/Table.jsx";
import * as S from "./styles.js";

const PASSENGER_COLORS = { local: "#4f46e5", foreign: "#10b981" };

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDashboardStats()
            .then((res) => setStats(res.data))
            .catch(() => setError("Could not load dashboard data."));
    }, []);

    if (error) {
        return (
            <S.Wrapper>
                <Header title="Dashboard" subtitle="Overview of bookings, revenue, and occupancy." />
                <S.ErrorText>{error}</S.ErrorText>
            </S.Wrapper>
        );
    }

    if (!stats) {
        return (
            <S.Wrapper>
                <Header title="Dashboard" subtitle="Overview of bookings, revenue, and occupancy." />
                <S.EmptyState>Loading dashboard…</S.EmptyState>
            </S.Wrapper>
        );
    }

    const passengerSplit = [
        { name: "Local", value: stats.local_count, color: PASSENGER_COLORS.local },
        { name: "Foreign", value: stats.foreign_count, color: PASSENGER_COLORS.foreign },
    ];
    const totalPassengers = stats.local_count + stats.foreign_count;

    const recentColumns = [
        {
            key: "train",
            header: "Train",
            render: (b) => b.trip.train.train_name,
        },
        {
            key: "date",
            header: "Date",
            width: "110px",
            render: (b) => b.trip.travel_date,
        },
        {
            key: "route",
            header: "Leg",
            render: (b) => (
                <S.RouteText>
                    {b.from_station.station_name} → {b.to_station.station_name}
                </S.RouteText>
            ),
        },
        {
            key: "fare",
            header: "Fare",
            width: "90px",
            render: (b) => <S.FareText>{b.total_fare}</S.FareText>,
        },
    ];

    return (
        <S.Wrapper>
            <Header title="Dashboard" subtitle="Overview of bookings, revenue, and occupancy." />

            <S.StatGrid>
                <S.StatCard>
                    <S.StatIconWrap $color="#eef2ff" $iconColor="#4f46e5">
                        <Wallet size={20} />
                    </S.StatIconWrap>
                    <S.StatContent>
                        <S.StatValue>{stats.total_revenue.toLocaleString()}</S.StatValue>
                        <S.StatLabel>Total Revenue</S.StatLabel>
                    </S.StatContent>
                </S.StatCard>

                <S.StatCard>
                    <S.StatIconWrap $color="#ecfdf5" $iconColor="#059669">
                        <Ticket size={20} />
                    </S.StatIconWrap>
                    <S.StatContent>
                        <S.StatValue>{stats.total_bookings}</S.StatValue>
                        <S.StatLabel>Total Bookings</S.StatLabel>
                    </S.StatContent>
                </S.StatCard>

                <S.StatCard>
                    <S.StatIconWrap $color="#fef3c7" $iconColor="#d97706">
                        <Armchair size={20} />
                    </S.StatIconWrap>
                    <S.StatContent>
                        <S.StatValue>{stats.total_seats_booked}</S.StatValue>
                        <S.StatLabel>Seats Booked</S.StatLabel>
                    </S.StatContent>
                </S.StatCard>

                <S.StatCard>
                    <S.StatIconWrap $color="#fce7f3" $iconColor="#db2777">
                        <CalendarClock size={20} />
                    </S.StatIconWrap>
                    <S.StatContent>
                        <S.StatValue>{stats.upcoming_trips}</S.StatValue>
                        <S.StatLabel>Upcoming Trips</S.StatLabel>
                    </S.StatContent>
                </S.StatCard>
            </S.StatGrid>

            <S.PanelGrid>
                <S.Panel>
                    <S.PanelTitle>Revenue — Last 14 Days</S.PanelTitle>
                    <S.PanelSubtitle>Daily revenue from confirmed bookings.</S.PanelSubtitle>

                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={stats.revenue_by_day}>
                            <defs>
                                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ fontSize: "0.8rem", borderRadius: 8, borderColor: "#e5e7eb" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#4f46e5"
                                strokeWidth={2}
                                fill="url(#revenueFill)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </S.Panel>

                <S.Panel>
                    <S.PanelTitle>Local vs Foreign</S.PanelTitle>
                    <S.PanelSubtitle>Passenger split across all bookings.</S.PanelSubtitle>

                    <S.SplitRow>
                        <ResponsiveContainer width={140} height={140}>
                            <PieChart>
                                <Pie
                                    data={passengerSplit}
                                    dataKey="value"
                                    innerRadius={40}
                                    outerRadius={65}
                                    paddingAngle={3}
                                >
                                    {passengerSplit.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        <S.SplitLegend>
                            {passengerSplit.map((entry) => (
                                <S.SplitLegendItem key={entry.name}>
                                    <S.SplitDot $color={entry.color} />
                                    {entry.name}: {entry.value}
                                    {totalPassengers > 0 &&
                                        ` (${Math.round((entry.value / totalPassengers) * 100)}%)`}
                                </S.SplitLegendItem>
                            ))}
                        </S.SplitLegend>
                    </S.SplitRow>
                </S.Panel>
            </S.PanelGrid>

            <S.PanelGrid>
                <S.Panel>
                    <S.PanelTitle>Top Routes by Revenue</S.PanelTitle>
                    <S.PanelSubtitle>Highest-earning routes across all bookings.</S.PanelSubtitle>

                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={stats.top_routes} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                            <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis
                                type="category"
                                dataKey="route_name"
                                tick={{ fontSize: 11, fill: "#374151" }}
                                axisLine={false}
                                tickLine={false}
                                width={140}
                            />
                            <Tooltip contentStyle={{ fontSize: "0.8rem", borderRadius: 8, borderColor: "#e5e7eb" }} />
                            <Bar dataKey="revenue" fill="#4f46e5" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </S.Panel>

                <S.Panel>
                    <S.PanelTitle>Train Occupancy</S.PanelTitle>
                    <S.PanelSubtitle>Seats booked vs total, across all trips.</S.PanelSubtitle>

                    {stats.train_occupancy.length === 0 && (
                        <S.EmptyState>No trains yet.</S.EmptyState>
                    )}

                    {stats.train_occupancy.map((train) => (
                        <S.OccupancyRow key={train.train_name}>
                            <S.OccupancyHeader>
                                <span>{train.train_name}</span>
                                <span>
                                    {train.booked_seats}/{train.total_seats} ({train.occupancy_rate}%)
                                </span>
                            </S.OccupancyHeader>
                            <S.OccupancyBarTrack>
                                <S.OccupancyBarFill $pct={Math.min(train.occupancy_rate, 100)} />
                            </S.OccupancyBarTrack>
                        </S.OccupancyRow>
                    ))}
                </S.Panel>
            </S.PanelGrid>

            <S.Panel>
                <S.PanelTitle>Recent Bookings</S.PanelTitle>
                <S.PanelSubtitle>The latest confirmed bookings.</S.PanelSubtitle>

                <Table
                    columns={recentColumns}
                    rows={stats.recent_bookings}
                    rowKey="id"
                    emptyMessage="No bookings yet."
                />
            </S.Panel>
        </S.Wrapper>
    );
}