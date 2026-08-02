import { NavLink as RouterNavLink } from "react-router-dom";
import { TicketCheck, MapPin, Route as RouteIcon, TrainFront } from "lucide-react";
import * as S from "./styles.js";

const links = [
    { to: "/book_seat", label: "Book a Seat", icon: TicketCheck },
    { to: "/stations", label: "Stations", icon: MapPin },
    { to: "/routes", label: "Routes", icon: RouteIcon },
    { to: "/trains", label: "Trains", icon: TrainFront },
    { to: "/bookings", label: "Bookings", icon: TicketCheck },
];

export default function Nav() {
    return (
        <S.NavBar>
            <S.Brand>Train Booking</S.Brand>
            {links.map(({ to, label, icon: Icon }) => (
                <RouterNavLink key={to} to={to} style={{ textDecoration: "none" }}>
                    {({ isActive }) => (
                        <S.NavLink $active={isActive}>
                            <Icon size={16} />
                            {label}
                        </S.NavLink>
                    )}
                </RouterNavLink>
            ))}
        </S.NavBar>
    );
}