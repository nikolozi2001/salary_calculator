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
  return (
    <div className="col-span-12 md:col-span-3">
      <div className="relative h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 shadow-md border border-amber-100 flex flex-col justify-center">
        {/* Pushpin */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-md flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-blue-300 rounded-full"></div>
          </div>
        </div>

        {/* Note Content */}
        <div className="pt-4 text-center">
          {selectedYear && !selectedRegion && !selectedActivity ? (
            // Case 1: Only year is selected - show Georgia + All Activities as default
            (() => {
              // All Georgia
              const allGeorgiaActivity = activitySectors.find(
                (activity) => activity.id === "AA"
              );

              return (
                <>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#4A80F0" }} // Blue color for Georgia
                  >
                    {language === "GE" ? "საქართველო" : "Georgia"}
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="text-sm">
                      {language === "GE"
                        ? "საქართველოს ხელფასების სტატისტიკა"
                        : "Georgia salary statistics"}
                    </p>
                    <div className="pt-3 flex justify-center">
                      <div
                        className="px-4 py-2 rounded-lg bg-white shadow-sm"
                        style={{
                          borderLeft: `3px solid #4A80F0`,
                        }}
                      >
                        <p className="text-sm font-medium text-gray-700">
                          {language === "GE"
                            ? `რეგიონი: საქართველო (ყველა)`
                            : `Region: Georgia (All)`}
                        </p>

                        {selectedYear && totalSalary !== null && (
                          <div className="mt-3 pt-3 border-t border-amber-100">
                            <p className="text-sm font-medium text-gray-700">
                              {language === "GE"
                                ? `წელი: ${selectedYear}, საქმიანობის სახე: ${
                                    allGeorgiaActivity
                                      ? allGeorgiaActivity.shortName
                                      : "საქართველო (ყველა)"
                                  }, არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: `
                                : `Year: ${selectedYear}, Business sector: ${
                                    allGeorgiaActivity
                                      ? allGeorgiaActivity.shortName
                                      : "All Activities"
                                  }, Average salary: `}
                              <span className="font-bold text-amber-600">
                                {totalSalary.toLocaleString()}{" "}
                                {language === "GE" ? "ლარი" : "GEL"}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()
          ) : selectedYear && !selectedRegion && selectedActivity ? (
            // Case 2: Year and activity are selected but no region - show Georgia with selected activity
            (() => {
              // Find the selected activity information
              const activityInfo = activitySectors.find(
                (activity) => activity.name === selectedActivity
              );

              return (
                <>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#4A80F0" }} // Blue color for Georgia
                  >
                    {language === "GE" ? "საქართველო" : "Georgia"}
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="text-sm">
                      {language === "GE"
                        ? "საქართველოს ხელფასების სტატისტიკა"
                        : "Georgia salary statistics"}
                    </p>
                    <div className="pt-3 flex justify-center">
                      <div
                        className="px-4 py-2 rounded-lg bg-white shadow-sm"
                        style={{
                          borderLeft: `3px solid #4A80F0`,
                        }}
                      >
                        <p className="text-sm font-medium text-gray-700">
                          {language === "GE"
                            ? `რეგიონი: საქართველო (ყველა)`
                            : `Region: Georgia (All)`}
                        </p>

                        {selectedYear && totalSalary !== null && (
                          <div className="mt-3 pt-3 border-t border-amber-100">
                            <p className="text-sm font-medium text-gray-700">
                              {language === "GE"
                                ? `წელი: ${selectedYear}, საქმიანობის სახე: ${
                                    activityInfo
                                      ? activityInfo.shortName
                                      : selectedActivity
                                  }, არჩეული პარამეტრებით საშუალო ხელფასი შეადგენს: `
                                : `Year: ${selectedYear}, Business sector: ${
                                    activityInfo
                                      ? activityInfo.shortName
                                      : selectedActivity
                                  }, Average salary: `}
                              <span className="font-bold text-amber-600">
                                {totalSalary.toLocaleString()}{" "}
                                {language === "GE" ? "ლარი" : "GEL"}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()
          ) : selectedRegion ? (
            (() => {
              // Find GE-XX code corresponding to the numeric ID
              const geCode = getGeCodeFromRegionId(selectedRegion);
              if (geCode && regionData[geCode]) {
                // If only region and year are selected (no activity), use All Activities as default
                const displayActivity = selectedActivity
                  ? selectedActivity
                  : selectedYear
                  ? activitySectors.find((activity) => activity.id === "AA")
                      ?.shortName
                  : null;

                return (
                  <>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: regionData[geCode].color }}
                    >
                      {language === "GE"
                        ? regionData[geCode].nameGe
                        : regionData[geCode].nameEn}
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p className="text-sm">
                        {language === "GE"
                          ? `${regionData[geCode].nameGe}ს რეგიონის ხელფასების სტატისტიკა`
                          : `${regionData[geCode].nameEn} region salary statistics`}
                      </p>
                      <div className="pt-3 flex justify-center">
                        <div
                          className="px-4 py-2 rounded-lg bg-white shadow-sm"
                          style={{
                            borderLeft: `3px solid ${regionData[geCode].color}`,
                          }}
                        >
                          <p
                            className="text-sm font-medium"
                            style={{ color: regionData[geCode].color }}
                          >
                            {language === "GE"
                              ? "არჩეული რეგიონი"
                              : "Selected Region"}{" "}
                            (ID: {selectedRegion})
                          </p>
                          {selectedYear && totalSalary !== null && (
                            <div className="mt-3 pt-3 border-t border-amber-100">
                              <p className="text-sm font-medium text-gray-700">
                                {language === "GE"
                                  ? `წელი: ${selectedYear}, საქმიანობის სახე: ${
                                      displayActivity || "საქართველო (ყველა)"
                                    }, საშუალო ხელფასი შეადგენს: `
                                  : `Year: ${selectedYear}, Business sector: ${
                                      displayActivity || "All Activities"
                                    }, Average salary: `}
                                <span className="font-bold text-amber-600">
                                  {totalSalary.toLocaleString()}{" "}
                                  {language === "GE" ? "ლარი" : "GEL"}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              }
              return <p>Region ID: {selectedRegion}</p>;
            })()
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2 text-amber-800">
                {language === "GE"
                  ? "ხელფასების კალკულატორი"
                  : "Salary Calculator"}
              </h3>
              <div className="space-y-2 text-gray-700">
                <p className="text-sm">
                  {language === "GE"
                    ? "წარმოგიდგენთ დაქირავებით დასაქმებულთა საშუალო ნომინალური ხელფასის განაწილებების პორტალს"
                    : "Presents employee average nominal salary distribution portal"}
                </p>
                <div className="pt-3 flex justify-center">
                  <div className="px-4 py-2 rounded-lg bg-white shadow-sm">
                    <p className="text-sm text-blue-600 font-medium">
                      {language === "GE"
                        ? "აირჩიეთ რეგიონი, საქმიანობა, სქესი და წელი"
                        : "Choose region, activity, gender and year"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Note;
