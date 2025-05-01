import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ activeSection, setActiveSection }) => {
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute("id");
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setActiveSection]);

  // Hide navbar on the login page
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <nav className="navbarr">
      <div className="logo">𝕁𝕖𝕖𝕧𝕒𝕟𝔸𝕞𝕣𝕚𝕥</div>

      <ul className="nav-links">
        <li>
          <a href="#home" className={activeSection === "home" ? "active" : ""}>
            Home
          </a>
        </li>
        <li>
          <a href="#about" className={activeSection === "about" ? "active" : ""}>
            About
          </a>
        </li>
        <li>
          <a href="#services" className={activeSection === "services" ? "active" : ""}>
            Services
          </a>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
