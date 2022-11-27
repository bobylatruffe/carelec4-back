import { NavLink } from "react-router-dom";
import "./Menu.scss";

function Menu() {
    return (
        <div id="Menu">
            <NavLink to="/" className="logo">
                <span className="red">car</span>elec
            </NavLink>
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "activeNavLink" : "")}
            >Accueil
            </NavLink>
            <NavLink
                to="/NotreGarage"
                className={({ isActive }) => (isActive ? "activeNavLink" : "")}
            >Notre garage
            </NavLink>
            <NavLink
                to="/Aides"
                className={({ isActive }) => (isActive ? "activeNavLink" : "")}
            >Besoin d'aides
            </NavLink>
            <NavLink to="/MonCompte" className="accountLogo">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path id="Tracé_1" data-name="Tracé 1" d="M14,2A12,12,0,1,0,26,14,12,12,0,0,0,14,2Zm0,3.6a3.6,3.6,0,1,1-3.6,3.6A3.6,3.6,0,0,1,14,5.6Zm0,17.04a8.641,8.641,0,0,1-7.2-3.864c.036-2.388,4.8-3.7,7.2-3.7s7.164,1.308,7.2,3.7A8.641,8.641,0,0,1,14,22.64Z" transform="translate(-2 -2)" fill="#fff" />
                </svg>
            </NavLink>
        </div>
    )
}

export default Menu;