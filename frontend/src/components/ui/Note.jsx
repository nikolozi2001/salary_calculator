import React from "react";
import noteBackground from "../../assets/images/note.png";

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
    backgroundImage: `url(${noteBackground})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    fontFamily: "BPG Nino Mtavruli",
    fontSize: window.innerWidth < 640 ? "14px" : "18px",
    lineHeight: window.innerWidth < 640 ? "20px" : "25px",
    fontWeight: 400,
    letterSpacing: "normal",
    color: "#0090D6",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: window.innerWidth < 640 ? "1rem" : "2rem",
    position: "relative",
  };

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
              <p className="mt-4 sm:mt-8">
                {language === "GE"
                  ? `არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: `
                  : "BY THE SELECTED CRITERIA THE AVERAGE SALARY IS: "}
                <strong className="text-xl sm:text-2xl">
                  {totalSalary.toLocaleString()}
                </strong>
                {language === "GE" ? " ლარს" : " GEL"}
              </p>
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
              <p className="mt-4 sm:mt-8">
                {language === "GE"
                  ? `არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: `
                  : "BY THE SELECTED CRITERIA THE AVERAGE SALARY IS: "}
                <strong className="text-xl sm:text-2xl">
                  {totalSalary.toLocaleString()}
                </strong>
                {language === "GE" ? " ლარს" : " GEL"}
              </p>
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
                <p className="mt-8">
                  {language === "GE"
                    ? "არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: "
                    : "BY THE SELECTED CRITERIA THE AVERAGE SALARY IS: "}
                  <strong className="text-2xl">
                    {totalSalary.toLocaleString()}
                  </strong>
                  {language === "GE" ? " ლარს" : " GEL"}
                </p>
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
    <div className="col-span-8 md:col-span-4">
      <div style={noteStyle} className="min-h-[300px] sm:min-h-0">
        {(selectedYear ||
          selectedRegion ||
          selectedActivity ||
          selectedGender) && (
          <button
            onClick={onClear}
            className="absolute top-8 sm:top-12 right-2 sm:right-4 p-2"
            title={language === "GE" ? "გასუფთავება" : "Clear"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-[#0090d6] hover:text-[#C85861]"
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
          <div className="text-sm sm:text-base">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Note;
