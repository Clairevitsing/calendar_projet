import dayjs from "dayjs";
import React, { useContext } from "react";
import logo from "../assets/logo.png";
import GlobalContext from "../context/GlobalContext";


export default function CalendarHeader() {
  // Defining the functional component CalendarHeader
  // Destructuring monthIndex and setMonthIndex from the GlobalContext
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  function handlePrevMonth() {
    // Function to handle previous month button click
    // Decrementing the monthIndex by 1
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    // Function to handle next month button click
    // Incrementing the monthIndex by 1
    setMonthIndex(monthIndex + 1);
  }
  function handleReset() {
    // Function to handle reset button click
    setMonthIndex(
      // Setting the monthIndex based on conditions
      // Checking if monthIndex is the current month
      monthIndex === dayjs().month()
        ? // If true, adding a random value to monthIndex
          monthIndex + Math.random()
        : // If false, setting monthIndex to the current month
          dayjs().month()
    );
  }
  return (
    // Returning JSX for rendering
    <header className="px-4 py-2 flex items-center">
      {" "}
      {/* Header section */}
      <img src={logo} alt="calendar" className="mr-2 w-12 h-12" />{" "}
      {/* Logo image */}
      <h1 className="mr-10 text-xl text-gray-500 font-bold">
        {" "}
        {/* Title */}
        Calendar
      </h1>
      <button
        // Today button
        // Click event handler
        onClick={handleReset}
        className="border rounded py-2 px-4 mr-5" // Styling
      >
        Today
      </button>
      <button onClick={handlePrevMonth}>
        {" "}
        {/* Previous month button */}
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          {" "}
          {/* Icon */}
          chevron_left
        </span>
      </button>
      <button onClick={handleNextMonth}>
        {" "}
        {/* Next month button */}
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          {" "}
          {/* Icon */}
          chevron_right
        </span>
      </button>
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {" "}
        {/* Month and year */}
        {dayjs(new Date(dayjs().year(), monthIndex)).format(
          // Formatting the date
          // Displaying month and year
          "MMMM YYYY"
        )}
      </h2>
    </header>
  );
} 