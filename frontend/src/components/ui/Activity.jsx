import React from "react";

const ActivityItem = ({ activity, isSelected, onSelect, language }) => (
  <div
    onClick={() =>
      onSelect(language === "GE" ? activity.name_ge : activity.name_en)
    }
    className={`workListElement clearfix border p-3 sm:p-5 cursor-pointer transition-colors ${
      isSelected ? "bg-[#C85861] text-white" : "hover:bg-[#0090D6]/5"
    }`}
    data-id={activity.id}
  >
    <img
      src={activity.icon}
      alt={language === "GE" ? activity.name_ge : activity.name_en}
      className="float-left mr-2 sm:mr-3 w-8 h-8 sm:w-12 sm:h-12 object-contain"
    />
    <div
      className="pt-1 sm:pt-2"
      style={{
        fontSize: window.innerWidth < 640 ? "11px" : "12.8px",
        lineHeight: window.innerWidth < 640 ? "16px" : "19.2px",
        fontWeight: 400,
        letterSpacing: "normal",
        color: isSelected ? "#fff" : "#0090D6",
        fontFamily: "BPG NINO MTAVRULI",
      }}
    >
      {language === "GE" ? activity.name_ge : activity.name_en}
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
  // Sort activities by orderby field
  const sortedActivities = [...activitySectors].sort(
    (a, b) => a.orderby - b.orderby
  );

  return (
    <div className="rounded-lg p-2 sm:p-4 col-span-12 md:col-span-4">
      <div
        className="workListHead p-2 text-center mb-2 sm:mb-4"
        style={{
          fontFamily: "BPG Nino Mtavruli",
          fontSize: window.innerWidth < 640 ? "20px" : "24px",
          transition: "0.6s",
          color: "#0090D6",
        }}
      >
        {language === "GE" ? "აირჩიეთ საქმიანობის სახე" : "Choose Activity"}
      </div>

      <div className="businessScroll overflow-y-auto max-h-[calc(100vh-380px)] sm:max-h-[500px] border border-[#0090D6]/20 rounded mb-16 sm:mb-0">
        {sortedActivities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isSelected={
              selectedActivity ===
              (language === "GE" ? activity.name_ge : activity.name_en)
            }
            onSelect={handleActivitySelect}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};

export default Activity;
