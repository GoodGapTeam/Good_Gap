import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/good_gap_logo.png";
import "./NavBar.css";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="navbar">
      <div className="navbar-inner">

        <div className="brand">
          <NavLink to="/" onClick={closeMenu}>
            <img src={logo} alt="Good Gap" className="brand-logo" />
          </NavLink>
        </div>


        <nav className={`nav nav-desktop ${open ? "show" : ""}`}>
          <NavLink to="/" end className={linkClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/services" end className={linkClass} onClick={closeMenu}>Services</NavLink>
          <NavLink to="/about" end className={linkClass} onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact/contactUs" className={linkClass} onClick={closeMenu}>Contact Us</NavLink>
        </nav>

        {/* One button: hamburger -> X */}
        <button type="button"
          className={`nav-toggle ${open ? "open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open} onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
