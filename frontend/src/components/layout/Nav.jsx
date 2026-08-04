import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { TicketCheck, MapPin, Route as RouteIcon, TrainFront, LogOut } from "lucide-react";
import { logout } from "../../api/authApi";
import * as S from "./styles.js";

const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: TicketCheck },
    { to: "/admin/stations", label: "Stations", icon: MapPin },
    { to: "/admin/routes", label: "Routes", icon: RouteIcon },
    { to: "/admin/trains", label: "Trains", icon: TrainFront },
    { to: "/admin/bookings", label: "Bookings", icon: TicketCheck },
];



export default function Nav() {

    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("auth_token");

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            // Even if the API call fails (e.g. token already expired), still
            // clear locally and redirect — logging out should never get "stuck".
        } finally {
            localStorage.removeItem("auth_token");
            navigate("/");
        }
    };

    return (
        <S.NavBar>
            <S.Brand>LankaRail</S.Brand>
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
            {isLoggedIn && (
                <S.Spacer>
                    <S.LogoutButton onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </S.LogoutButton>
                </S.Spacer>
            )}
        </S.NavBar>
    );
}