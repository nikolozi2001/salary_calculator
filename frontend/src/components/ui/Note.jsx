import React from "react";

// Note component to display salary information based on selected parameters
const Note = ({
  language,
  selectedYear,
  selectedRegion,
  selectedActivity,
  selectedGender,
  totalSalary,
  activitySectors,
  regionData,
  getGeCodeFromRegionId,
  onClear,
}) => {
  const noteStyle = {
    fontFamily: "BPG Nino Mtavruli",
    fontWeight: 400,
    letterSpacing: "normal",
    color: "#005a8c",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
  };

  const SalaryResult = () => (
    <div className="mt-4 sm:mt-6">
      <p className="text-xs sm:text-sm opacity-80">
        {language === "GE"
          ? "საშუალო ხელფასი არჩეული პარამეტრებით"
          : "Average salary by selected criteria"}
      </p>
      <p className="mt-1 leading-none">
        <span className="text-4xl sm:text-5xl font-bold">
          {totalSalary.toLocaleString()}
        </span>
        <span className="ml-2 text-lg sm:text-xl">
          {language === "GE" ? "ლარი" : "GEL"}
        </span>
      </p>
    </div>
  );

  const getActivityName = (activityName) => {
    if (!activityName) return null;
    const activity = activitySectors.find(
      (act) =>
        act.name_ge === activityName ||
        act.name_en === activityName ||
        act.name === activityName
    );
    return activity
      ? language === "GE"
        ? activity.name_ge
        : activity.name_en
      : activityName;
  };

  const renderContent = () => {
    if (selectedYear && !selectedRegion && !selectedActivity) {
      // Case 1: Only year selected
      return (
        <>
          {selectedYear && totalSalary !== null && (
            <>
              {" "}
              <p>
                <strong>{language === "GE" ? "წელი" : "Year"}:</strong>{" "}
                {selectedYear}
              </p>
              {selectedGender && (
                <p>
                  <strong>{language === "GE" ? "სქესი" : "Gender"}:</strong>{" "}
                  {language === "GE"
                    ? selectedGender === "female"
                      ? "ქალი"
                      : "კაცი"
                    : selectedGender === "female"
                    ? "Female"
                    : "Male"}
                </p>
              )}
              <SalaryResult />
            </>
          )}
        </>
      );
    }

    if (selectedYear && !selectedRegion && selectedActivity) {
      // Case 2: Year and activity selected
      const activityDisplay = getActivityName(selectedActivity);
      return (
        <>
          {selectedYear && totalSalary !== null && (
            <>
              <p>
                <strong>{language === "GE" ? "წელი" : "Year"}:</strong>{" "}
                {selectedYear}
              </p>
              <p>
                {language === "GE" ? (
                  <span>
                    {" "}
                    <strong>საქმიანობის სახე:</strong> {activityDisplay}
                  </span>
                ) : (
                  <span>
                    <strong>Business sector:</strong> {activityDisplay}
                  </span>
                )}
              </p>
              {selectedGender && (
                <p>
                  <strong>{language === "GE" ? "სქესი" : "Gender"}:</strong>{" "}
                  {language === "GE"
                    ? selectedGender === "female"
                      ? "ქალი"
                      : "კაცი"
                    : selectedGender === "female"
                    ? "Female"
                    : "Male"}
                </p>
              )}
              <SalaryResult />
            </>
          )}
        </>
      );
    }

    if (selectedRegion) {
      // Case 3: Region selected
      const activityDisplay = getActivityName(selectedActivity);
      const geCode = getGeCodeFromRegionId(selectedRegion);
      if (geCode && regionData[geCode]) {
        return (
          <>
            {" "}
            <h3 className="mt-8">
              <strong>{language === "GE" ? "რეგიონი" : "Region"}:</strong>{" "}
              {language === "GE"
                ? regionData[geCode].nameGe
                : regionData[geCode].nameEn}
            </h3>
            {selectedYear && totalSalary !== null && (
              <>
                <p>
                  <strong>{language === "GE" ? "წელი" : "Year"}:</strong>{" "}
                  {selectedYear}
                </p>
                <p>
                  {language === "GE" ? (
                    <span>
                      {" "}
                      <strong>საქმიანობის სახე:</strong> {activityDisplay}
                    </span>
                  ) : (
                    <span>
                      <strong>Business sector:</strong> {activityDisplay}
                    </span>
                  )}
                </p>
                {selectedGender && (
                  <p>
                    <strong>{language === "GE" ? "სქესი" : "Gender"}:</strong>{" "}
                    {language === "GE"
                      ? selectedGender === "female"
                        ? "ქალი"
                        : "კაცი"
                      : selectedGender === "female"
                      ? "Female"
                      : "Male"}
                  </p>
                )}
                <SalaryResult />
              </>
            )}
          </>
        );
      }
      return <p>Region ID: {selectedRegion}</p>;
    }

    // Default state
    return (
      <>
        <h3>
          {language === "GE" ? "ხელფასების კალკულატორი" : "Salary Calculator"}
        </h3>
        <p>
          {language === "GE"
            ? "წარმოგიდგენთ დაქირავებით დასაქმებულთა საშუალო ნომინალური ხელფასის განაწილებების პორტალს"
            : "Presents employee average nominal salary distribution portal"}
        </p>
        <p>
          {language === "GE"
            ? "აირჩიეთ რეგიონი, საქმიანობა, სქესი და წელი"
            : "Choose region, activity, gender and year"}
        </p>
      </>
    );
  };

  return (
    <div className="hidden md:block col-span-8 md:col-span-4">
      <div
        style={noteStyle}
        className="min-h-[220px] sm:min-h-[260px] p-4 sm:p-8 text-sm sm:text-base bg-white rounded-xl border border-brand/20 border-t-4 border-t-brand shadow-sm"
      >
        {(selectedYear ||
          selectedRegion ||
          selectedActivity ||
          selectedGender) && (
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-2"
            title={language === "GE" ? "გასუფთავება" : "Clear"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-[#0090d6] hover:text-selected"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <div className="text-center">
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

// Compact result bar pinned to the bottom of the screen on mobile,
// where the full Note card would sit above the selectors
export const ResultBar = ({
  language,
  selectedYear,
  selectedRegion,
  selectedActivity,
  selectedGender,
  totalSalary,
  activitySectors,
  regionData,
  getGeCodeFromRegionId,
  onClear,
}) => {
  const isGe = language === "GE";
  const geCode = selectedRegion && getGeCodeFromRegionId(selectedRegion);
  const region = geCode && regionData[geCode];
  const activity = activitySectors.find(
    (act) => act.name_ge === selectedActivity || act.name_en === selectedActivity
  );
  const genderLabel =
    selectedGender &&
    (isGe
      ? selectedGender === "female"
        ? "ქალი"
        : "კაცი"
      : selectedGender === "female"
      ? "Female"
      : "Male");
  const summary = [
    selectedYear,
    region && (isGe ? region.nameGe : region.nameEn),
    activity && (isGe ? activity.name_ge : activity.name_en),
    genderLabel,
  ]
    .filter(Boolean)
    .join(" · ");
  const hasResult = selectedYear && totalSalary !== null;

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t-4 border-t-brand shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-4 py-2 text-brand-dark">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          {hasResult ? (
            <>
              <p className="text-xs truncate">{summary}</p>
              <p className="font-bpg-nino leading-tight">
                <span className="text-2xl font-bold">
                  {totalSalary.toLocaleString()}
                </span>
                <span className="ml-1 text-sm">{isGe ? "ლარი" : "GEL"}</span>
              </p>
            </>
          ) : (
            <p className="text-sm py-2">
              {isGe
                ? "აირჩიეთ წელი საშუალო ხელფასის სანახავად"
                : "Choose a year to see the average salary"}
            </p>
          )}
        </div>
        {summary && (
          <button
            onClick={onClear}
            className="p-2 text-brand hover:text-selected"
            aria-label={isGe ? "გასუფთავება" : "Clear"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Note;
