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
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    fontFamily: 'BPG_Nino',
    fontSize: '18px',
    lineHeight: '27px',
    fontWeight: 400,
    letterSpacing: 'normal',
    color: '#0090D6',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '2rem'
  };

  const renderContent = () => {
    if (selectedYear && !selectedRegion && !selectedActivity) {
      // Case 1: Only year selected
      const allGeorgiaActivity = activitySectors.find(activity => activity.id === "AA");
      return (
        <>
          <h3>{language === "GE" ? "საქართველო" : "Georgia"}</h3>
          <p>{language === "GE" ? "საქართველოს ხელფასების სტატისტიკა" : "Georgia salary statistics"}</p>
          <p>
            {language === "GE" ? `რეგიონი: საქართველო (ყველა)` : `Region: Georgia (All)`}
          </p>
          {selectedYear && totalSalary !== null && (
            <p>
              {language === "GE"
                ? `წელი: ${selectedYear}, საქმიანობის სახე: ${allGeorgiaActivity ? allGeorgiaActivity.shortName : "საქართველო (ყველა)"}, არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: ${totalSalary.toLocaleString()} ლარი`
                : `Year: ${selectedYear}, Business sector: ${allGeorgiaActivity ? allGeorgiaActivity.shortName : "All Activities"}, Average salary: ${totalSalary.toLocaleString()} GEL`}
            </p>
          )}
        </>
      );
    }

    if (selectedYear && !selectedRegion && selectedActivity) {
      // Case 2: Year and activity selected
      const activityInfo = activitySectors.find(activity => activity.name === selectedActivity);
      return (
        <>
          <h3>{language === "GE" ? "საქართველო" : "Georgia"}</h3>
          <p>{language === "GE" ? "საქართველოს ხელფასების სტატისტიკა" : "Georgia salary statistics"}</p>
          <p>
            {language === "GE" ? `რეგიონი: საქართველო (ყველა)` : `Region: Georgia (All)`}
          </p>
          {selectedYear && totalSalary !== null && (
            <p>
              {language === "GE"
                ? `წელი: ${selectedYear}, საქმიანობის სახე: ${activityInfo ? activityInfo.shortName : selectedActivity}, არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: ${totalSalary.toLocaleString()} ლარი`
                : `Year: ${selectedYear}, Business sector: ${activityInfo ? activityInfo.shortName : selectedActivity}, Average salary: ${totalSalary.toLocaleString()} GEL`}
            </p>
          )}
        </>
      );
    }

    if (selectedRegion) {
      // Case 3: Region selected
      const geCode = getGeCodeFromRegionId(selectedRegion);
      if (geCode && regionData[geCode]) {
        const displayActivity = selectedActivity
          ? selectedActivity
          : selectedYear
          ? activitySectors.find(activity => activity.id === "AA")?.shortName
          : null;

        return (
          <>
            <h3>
              {language === "GE" ? regionData[geCode].nameGe : regionData[geCode].nameEn}
            </h3>
            <p>
              {language === "GE"
                ? `${regionData[geCode].nameGe}ს რეგიონის ხელფასების სტატისტიკა`
                : `${regionData[geCode].nameEn} region salary statistics`}
            </p>
            <p>
              {language === "GE" ? "არჩეული რეგიონი" : "Selected Region"} (ID: {selectedRegion})
            </p>
            {selectedYear && totalSalary !== null && (
              <p>
                {language === "GE"
                  ? `წელი: ${selectedYear}, საქმიანობის სახე: ${displayActivity || "საქართველო (ყველა)"}, საშუალო ხელფასი შეადგენს: ${totalSalary.toLocaleString()} ლარი`
                  : `Year: ${selectedYear}, Business sector: ${displayActivity || "All Activities"}, Average salary: ${totalSalary.toLocaleString()} GEL`}
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
    <div className="col-span-12 md:col-span-3">
      <div style={noteStyle}>
        <div className="text-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Note;
