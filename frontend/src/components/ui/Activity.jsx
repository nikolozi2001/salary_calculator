import React, { useState } from "react";

const ActivityItem = ({ activity, isSelected, onSelect, language }) => (
  <div
    onClick={() =>
      onSelect(language === "GE" ? activity.name_ge : activity.name_en)
    }
    className={`workListElement clearfix border border-l-4 p-3 sm:p-5 cursor-pointer transition-colors ${
      isSelected
        ? "bg-selected/10 border-l-selected"
        : "border-l-transparent hover:bg-brand/5"
    }`}
    data-id={activity.id}
  >
    <img
      src={activity.icon}
      alt={language === "GE" ? activity.name_ge : activity.name_en}
      className="float-left mr-2 sm:mr-3 w-8 h-8 sm:w-12 sm:h-12 object-contain"
    />
    <div
      className="pt-1 sm:pt-2 text-[13px] leading-5 sm:text-sm sm:leading-[22px]"
      style={{
        fontWeight: 500,
        color: "#005a8c",
        fontFamily: '"Noto Sans Georgian", "Segoe UI", system-ui, sans-serif',
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
  const [query, setQuery] = useState("");

  // Sort activities by orderby field, then filter by the search query
  const sortedActivities = [...activitySectors].sort(
    (a, b) => a.orderby - b.orderby
  );
  const normalizedQuery = query.trim().toLowerCase();
  const visibleActivities = normalizedQuery
    ? sortedActivities.filter((activity) =>
        (language === "GE" ? activity.name_ge : activity.name_en)
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : sortedActivities;

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

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={language === "GE" ? "ძებნა..." : "Search..."}
        aria-label={language === "GE" ? "საქმიანობის ძებნა" : "Search activity"}
        className="w-full mb-2 px-3 py-2 text-sm text-brand-dark border border-brand/30 rounded focus:outline-none focus:ring-2 focus:ring-brand/40"
      />

      <div className="businessScroll lg:overflow-y-auto lg:max-h-[500px] border border-brand/20 rounded">
        {visibleActivities.length === 0 && (
          <p className="p-4 text-sm text-center text-brand-dark">
            {language === "GE" ? "ვერაფერი მოიძებნა" : "No matches"}
          </p>
        )}
        {visibleActivities.map((activity) => (
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
