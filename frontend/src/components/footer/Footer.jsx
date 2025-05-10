import React from "react";
import sakstatLogoGe from "../../assets/images/sakstat-logo.svg";
import sakstatLogoEn from "../../assets/images/sakstat-logo-en.png";
import "./Footer.scss";
import { Facebook, LinkedIn, Twitter } from "@mui/icons-material";
import { Tooltip, Fade } from "@mui/material";

const Footer = ({ language = "GE" }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-content">
        <img
          src={language === "GE" ? sakstatLogoGe : sakstatLogoEn}
          alt={language === "GE" ? "საქსტატის ლოგო" : "Geostat logo"}
          className="footer-logo"
        />        <p className="footer-text">
          {language === "GE"
            ? "საქართველოს სტატისტიკის ეროვნული სამსახური - საქსტატი"
            : "National Statistics Office of Georgia - Geostat"}
          <span className="footer-text2">
            {language === "GE"
              ? "საქართველოს შრომის ბაზრის ანალიზის ინსტრუმენტი"
              : "Georgian labor market analysis tool"}
          </span>
        </p>
      </div>

      <div className="social-links">
        <Tooltip
          title="Facebook"
          placement="top"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <a
            href="https://www.facebook.com/geostat.ge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Facebook />
          </a>
        </Tooltip>

        <Tooltip
          title="Twitter"
          placement="top"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <a
            href="https://twitter.com/Geostat100"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter />
          </a>
        </Tooltip>

        <Tooltip
          title="LinkedIn"
          placement="top"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <a
            href="https://www.linkedin.com/company/national-statistics-office-of-georgia-geostat-/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedIn />
          </a>
        </Tooltip>
      </div>

      <p className="copyright">
        © {currentYear}{" "}
        {language === "GE" ? "ყველა უფლება დაცულია" : "All rights reserved"}
      </p>
    </footer>
  );
};

export default Footer;
