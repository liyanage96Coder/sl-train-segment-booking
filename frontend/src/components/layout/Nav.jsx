import { NavLink as RouterNavLink } from "react-router-dom";
import * as S from "./styles.js";

const links = [
    { to: "/book_seat", label: "Book a Seat" },
    { to: "/stations", label: "Stations" },
    { to: "/station/add_station", label: "Add Station" },
    { to: "/routes", label: "Routes" },
    { to: "/route/add_route", label: "Add Route" },
    { to: "/trains", label: "Trains" },
    { to: "/train/add_train", label: "Add Train" },
];

export default function Nav() {
    return (
        <S.NavBar>
            {links.map((link) => (
                <RouterNavLink key={link.to} to={link.to} style={{ textDecoration: "none" }}>
                    {({ isActive }) => (
                        <S.NavLink as="span" $active={isActive}>
                            {link.label}
                        </S.NavLink>
                    )}
                </RouterNavLink>
            ))}
        </S.NavBar>
    );
}