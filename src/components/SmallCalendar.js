import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { getMonth } from "../util";

// Defining the SmallCalendar functional component
export default function SmallCalendar() {
  // Initializing state for current month index
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  // Initializing state for current month
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  useEffect(() => {
    // Effect hook to update current month when currentMonthIdx changes
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const { monthIndex, setSmallCalendarMonth, setDaySelected, daySelected } =
    // Destructuring values from GlobalContext
    useContext(GlobalContext);

  useEffect(() => {
    console.log({ monthIndex });
    // Effect hook to update currentMonthIdx when monthIndex changes
    // Setting currentMonthIdx to monthIndex
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  function handlePrevMonth() {
    // Function to handle previous month button click
    setCurrentMonthIdx(currentMonthIdx - 1);
  }
  function handleNextMonth() {
    // Function to handle next month button click
    setCurrentMonthIdx(currentMonthIdx + 1);
  }
  function getDayClass(day) {
    // Function to determine class for each day
    // Date format
    const format = "DD-MM-YY";
    // Current day
    const nowDay = dayjs().format(format);
    // Day in the current month
    const currDay = day.format(format);
    // Selected day
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) {
      // Check if current day matches today's date
      // Apply class for today's date
      return "bg-blue-500 rounded-full text-white";
    } else if (currDay === slcDay) {
      // Check if current day matches selected day
      // Apply class for selected day
      return "bg-blue-100 rounded-full text-blue-600 font-bold";
    } else {
      // Default case
      return "";
    }
  }
  return (
    // Returning JSX for rendering
    <div className="mt-9">
      {" "}
      {/* Container div */}
      <header className="flex justify-between">
        {" "}
        {/* Header section */}
        <p className="text-gray-500 font-bold">
          {" "}
          {/* Month and year */}
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format("MMMM YYYY")}
        </p>
        <div>
          {" "}
          {/* Buttons for navigating months */}
          <button onClick={handlePrevMonth}>
            {" "}
            {/* Button to navigate to previous month */}
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
              chevron_left
            </span>
          </button>
          <button onClick={handleNextMonth}>
            {" "}
            {/* Button to navigate to next month */}
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
              chevron_right
            </span>
          </button>
        </div>
      </header>
      <div className="grid grid-cols-7 grid-rows-6">
        {" "}
        {/* Grid for displaying calendar days */}
        {currentMonth[0].map(
          // Rendering weekday initials
          (day, i) => (
            <span key={i} className="text-sm py-1 text-center">
              {" "}
              {/* Weekday initials */}
              {day.format("dd").charAt(0)}
            </span>
          )
        )}
        {currentMonth.map(
          // Rendering calendar days
          (row, i) => (
            <React.Fragment key={i}>
              {" "}
              {/* Fragment for each row */}
              {row.map(
                // Mapping through each day in a row
                (day, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      // Click event to set small calendar month and selected day
                      // Setting small calendar month
                      setSmallCalendarMonth(currentMonthIdx);
                      // Setting selected day
                      setDaySelected(day);
                    }}
                    // Applying dynamic class based on day
                    className={`py-1 w-full ${getDayClass(day)}`}
                  >
                    <span className="text-sm">{day.format("D")}</span>{" "}
                    {/* Displaying day number */}
                  </button>
                )
              )}
            </React.Fragment>
          )
        )}
      </div>
    </div>
  );
}
