import React from "react";

// Note component to display salary information based on selected parameters
const Note = ({
  language,
  selectedYear,
  selectedRegion,
  selectedActivity,
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
    lineHeight: "27px",
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
          <h3>{language === "GE" ? "საქართველო" : "Georgia"}</h3>
          <p>
            {language === "GE"
              ? "საქართველოს ხელფასების სტატისტიკა"
              : "Georgia salary statistics"}
          </p>
          <p>
            {language === "GE"
              ? `რეგიონი: საქართველო (ყველა)`
              : `Region: Georgia (All)`}
          </p>
          {selectedYear && totalSalary !== null && (
            <p>
              {language === "GE"
                ? `წელი: ${selectedYear}, საქმიანობის სახე: საქართველო (ყველა), არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: ${totalSalary.toLocaleString()} ლარი`
                : `Year: ${selectedYear}, Business sector: All Activities, Average salary: ${totalSalary.toLocaleString()} GEL`}
            </p>
          )}
        </>
      );
    }

    if (selectedYear && !selectedRegion && selectedActivity) {
      // Case 2: Year and activity selected
      const activityDisplay = getActivityName(selectedActivity);
      return (
        <>
          <h3>{language === "GE" ? "საქართველო" : "Georgia"}</h3>
          <p>
            {language === "GE"
              ? "საქართველოს ხელფასების სტატისტიკა"
              : "Georgia salary statistics"}
          </p>
          <p>
            {language === "GE"
              ? `რეგიონი: საქართველო (ყველა)`
              : `Region: Georgia (All)`}
          </p>
          {selectedYear && totalSalary !== null && (
            <p>
              {language === "GE"
                ? `წელი: ${selectedYear}, საქმიანობის სახე: ${activityDisplay}, არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: ${totalSalary.toLocaleString()} ლარი`
                : `Year: ${selectedYear}, Business sector: ${activityDisplay}, Average salary: ${totalSalary.toLocaleString()} GEL`}
            </p>
          )}
        </>
      );
    }

    if (selectedRegion) {
      // Case 3: Region selected
      const geCode = getGeCodeFromRegionId(selectedRegion);
      if (geCode && regionData[geCode]) {
        const activityDisplay = selectedActivity
          ? getActivityName(selectedActivity)
          : language === "GE"
          ? "საქართველო (ყველა)"
          : "All Activities";

        return (
          <>
            <h3>
              {language === "GE"
                ? regionData[geCode].nameGe
                : regionData[geCode].nameEn}
            </h3>
            <p>
              {language === "GE"
                ? `${regionData[geCode].nameGe}ს რეგიონის ხელფასების სტატისტიკა`
                : `${regionData[geCode].nameEn} region salary statistics`}
            </p>
            <p>
              {language === "GE" ? "არჩეული რეგიონი" : "Selected Region"} (ID:{" "}
              {selectedRegion})
            </p>
            {selectedYear && totalSalary !== null && (
              <p>
                {language === "GE"
                  ? `წელი: ${selectedYear}, საქმიანობის სახე: ${activityDisplay}, საშუალო ხელფასი შეადგენს: ${totalSalary.toLocaleString()} ლარი`
                  : `Year: ${selectedYear}, Business sector: ${activityDisplay}, Average salary: ${totalSalary.toLocaleString()} GEL`}
              </p>
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
    <div className="col-span-8 md:col-span-4 p-4">
      <div style={noteStyle}>
        <div className="text-center">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Note;
