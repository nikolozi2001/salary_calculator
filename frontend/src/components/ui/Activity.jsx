import React from "react";

const ActivityItem = ({ activity, isSelected, onSelect, language }) => (
  <div
    onClick={() =>
      onSelect(language === "GE" ? activity.name_ge : activity.name_en)
    }
    className={`workListElement clearfix border p-5 cursor-pointer transition-colors ${
      isSelected ? "bg-[#0090D6]/10" : "hover:bg-[#0090D6]/5"
    }`}
    data-id={activity.id}
  >
    <img
      src={activity.icon}
      alt={language === "GE" ? activity.name_ge : activity.name_en}
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
