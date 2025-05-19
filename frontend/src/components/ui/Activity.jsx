import React from "react";
// Import all activity icons
// These icons are not directly referenced but are needed when the activity objects
// contain the icon references that are passed to the component
// eslint-disable-next-line no-unused-vars
import educationIcon from "../../assets/icons/education.png";
// eslint-disable-next-line no-unused-vars
import manufacturingIcon from "../../assets/icons/manufacturing.png";
// eslint-disable-next-line no-unused-vars
import electricityIcon from "../../assets/icons/electricity.png";
// eslint-disable-next-line no-unused-vars
import tradeIcon from "../../assets/icons/trade.png";
// eslint-disable-next-line no-unused-vars
import constructionIcon from "../../assets/icons/construction.png";
// eslint-disable-next-line no-unused-vars
import realEstateIcon from "../../assets/icons/real-estate.png";
// eslint-disable-next-line no-unused-vars
import miningIcon from "../../assets/icons/mining.png";
// eslint-disable-next-line no-unused-vars
import hotelsIcon from "../../assets/icons/hotels.png";
// eslint-disable-next-line no-unused-vars
import financialIcon from "../../assets/icons/financial.png";
// eslint-disable-next-line no-unused-vars
import publicIcon from "../../assets/icons/public.png";
// eslint-disable-next-line no-unused-vars
import agroIcon from "../../assets/icons/agro.png";
// eslint-disable-next-line no-unused-vars
import transportIcon from "../../assets/icons/transport.png";
// eslint-disable-next-line no-unused-vars
import healthIcon from "../../assets/icons/health.png";
// eslint-disable-next-line no-unused-vars
import waterIcon from "../../assets/icons/water.png";
// eslint-disable-next-line no-unused-vars
import informationIcon from "../../assets/icons/information.png";
// eslint-disable-next-line no-unused-vars
import professionalIcon from "../../assets/icons/Professional.png";
// eslint-disable-next-line no-unused-vars
import administrativeIcon from "../../assets/icons/Administrative.png";
// eslint-disable-next-line no-unused-vars
import artsIcon from "../../assets/icons/Arts.png";
// eslint-disable-next-line no-unused-vars
import otherIcon from "../../assets/icons/Other.png";

// Component that displays an activity option
const ActivityItem = ({ activity, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(activity.name)}
    className={`workListElement clearfix border p-5 cursor-pointer transition-colors ${
      isSelected ? "bg-[#0090D6]/10" : "hover:bg-[#0090D6]/5"
    }`}
    data-id={activity.id}
  >
    {" "}
    <img
      src={activity.icon}
      alt={activity.name}
      className="float-left mr-3 w-12 h-12 object-contain"
    />
    <div
      className="pt-2"
      style={{
        fontSize: "12.8px",
        lineHeight: "19.2px",
        fontWeight: 400,
        letterSpacing: "normal",
        color: "#0090D6",
        fontFamily: "BPG NINO MTAVRULI",
      }}
    >
      {activity.name}
    </div>
  </div>
);

// Main Activity selection component
const Activity = ({
  language,
  selectedActivity,
  activitySectors,
  handleActivitySelect,
}) => {
  return (
    <div className="rounded-lg p-4 col-span-12 md:col-span-4">
      <div
        className="workListHead p-2 text-center mb-4"
        style={{
          fontFamily: "BPG Nino Mtavruli",
          fontSize: "24px",
          transition: "0.6s",
          color: "#0090D6",
        }}
      >
        {language === "GE" ? "აირჩიეთ საქმიანობის სახე" : "Choose Activity"}
      </div>

      <div className="businessScroll overflow-y-auto max-h-[500px] border border-[#0090D6]/20 rounded">
        {activitySectors.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isSelected={selectedActivity === activity.name}
            onSelect={handleActivitySelect}
          />
        ))}
      </div>
    </div>
  );
};

export default Activity;
