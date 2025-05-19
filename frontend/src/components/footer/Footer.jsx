import React from "react";
import "./Footer.scss";

const Footer = ({ language = "GE" }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          {language === "GE" ? `საქსტატი ${currentYear}` : `Geostat ${currentYear}`}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
