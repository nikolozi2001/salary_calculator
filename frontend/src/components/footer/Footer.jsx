import React from "react";
import "./Footer.scss";

const Footer = ({ language = "GE" }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          © {currentYear}{" "}
          <a href="https://www.geostat.ge" target="_blank" rel="noopener noreferrer">
            {language === "GE" ? "საქსტატი" : "Geostat"}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
