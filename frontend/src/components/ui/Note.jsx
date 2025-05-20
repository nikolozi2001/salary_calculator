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
}) => {
  const noteStyle = {
    backgroundImage: 'url("/src/assets/images/note.png")',
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    fontFamily: "BPG Nino Mtavruli",
    fontSize: "18px",
    lineHeight: "25px",
    fontWeight: 400,
    letterSpacing: "normal",
    color: "#0090D6",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "2rem",
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
              <p className="mt-8">
                {language === "GE"
                  ? `არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: `
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
              <p className="mt-8">
                {language === "GE"
                  ? `არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: `
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
      <div style={noteStyle}>
        <div className="text-center">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Note;
