import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Home.css";
import "./Navbar.css";

import image1 from "./../assets/skin-care.jpg";
import img2 from "./../assets/head-care.jpg";
import img3 from "./../assets/hair-care.jpg";
import img4 from "./../assets/Body-Detox.jpg";
import img5 from "./../assets/Joint-Pain.jpg";
import img6 from "./../assets/Weight.jpg";

import abt1 from "./../assets/about/about1.jpg";
import abt2 from "./../assets/about/about2.jpg";
import abt3 from "./../assets/about/about3.jpg";

const treatments = [
  { name: "Skin Care", image: image1 },
  { name: "Head Care", image: img2 },
  { name: "Hair Care", image: img3 },
  { name: "Body Detox", image: img4 },
  { name: "Joint Pain Relief", image: img5 },
  { name: "Weight Management", image: img6 },
];

const Home = () => {
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const section = document.getElementById(activeSection);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSection]);

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
  }, []);

  // Hide navbar on the login page
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <>
      <div className="container">
        {/* Navbar */}
        <nav className="navbarr">
          <div className="logo">𝕁𝕖𝕖𝕧𝕒𝕟𝔸𝕞𝕣𝕚𝕥</div>
          <ul className="nav-links">
            <li>
              <a
                href="#home"
                className={activeSection === "home" ? "active" : ""}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={activeSection === "about" ? "active" : ""}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                className={activeSection === "services" ? "active" : ""}
              >
                Services
              </a>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
        </nav>

        {/* Home Section */}
        <section className="body section" id="home">
          <div className="titles">
            <h1 className="title">Welcome to 𝕁𝔼𝔼𝕍𝔸ℕ𝔸𝕄ℝ𝕀𝕋</h1>
          </div>
          <div className="sub-title">
            <h2>The Essence of Ayurveda</h2>
          </div>
        </section>

        {/* Treatment Section */}
        <section className="treatment-section" id="treatments">
          <h2 className="section-title">Our Ayurvedic Treatments</h2>
          <p className="section-subtitle">The Essence of Ayurveda</p>

          <div className="treatment-grid">
            {treatments.map((treatment, index) => (
              <div className="treatment-card" key={index}>
                <div className="image-wrapper">
                  <img
                    src={treatment.image}
                    alt={treatment.name}
                    className="treatment-image"
                  />
                </div>
                <h3 className="treatment-name">{treatment.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="about-section" id="about">
          <div className="about-head">
            <h2 className="about-title">About JeevanAmrit</h2>
          </div>
          <div className="about-body">
            <div className="img-container">
              <img className="img1" src={abt1} alt="About JeevanAmrit" />
              <div className="imges">
                <img className="img2" src={abt2} alt="About JeevanAmrit" />
                <img className="img3" src={abt3} alt="About JeevanAmrit" />
              </div>
            </div>
            <div className="titles">
              <h5>
                "Ayurveda for Life:{" "}
                <h2 className="sub-tit">
                  Natural Healing, Trusted by Generations
                </h2>
                "
              </h5>
              <p>"Harnessing the Power of Nature to Nurture Your Health"</p>
            </div>
          </div>
          <div className="footer-about">
            <h4>Best Ayurvedic Products in Our Company</h4>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section section" id="services">
          <div className="service-head">
            <h2 className="services-title">Our Ayurvedic Services</h2>
            <p className="services-subtitle">
              {/* Discover holistic treatments for your mind, body, and soul. */}
            </p>
          </div>

          <div className="services-wrapper">
            {" "}
            {/* New wrapper div */}
            <div className="services-grid">
              <div className="service-card">
                <h3>Panchakarma Therapy</h3>
                <p>
                  Detoxify and rejuvenate your body with our specialized
                  therapy.
                </p>
              </div>
              <div className="service-card">
                <h3>Herbal Treatments</h3>
                <p>Experience the power of natural herbs for healing.</p>
              </div>
              <div className="service-card">
                <h3>Ayurvedic Massage</h3>
                <p>Relax your body with traditional Ayurvedic massages.</p>
              </div>
              <div className="service-card">
                <h3>Yoga & Meditation</h3>
                <p>
                  Achieve mental and physical balance through guided sessions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-info">
            <h2>JeevanAmrit - The Essence of Ayurveda</h2>
            <p>
              At JeevanAmrit, we bring you{" "}
              <strong>authentic Ayurvedic medicines</strong> made from{" "}
              <strong>pure herbal ingredients</strong> to enhance your{" "}
              <strong>health, immunity, and well-being</strong>. Our products
              follow the ancient wisdom of Ayurveda for{" "}
              <strong>holistic healing</strong>.
            </p>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: support@jeevanamrit.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
        <p className="footer-bottom">
          &copy; 2025 JeevanAmrit. All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default Home;
