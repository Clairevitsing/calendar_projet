import React from "react";

// Creating a global context to store month-related information
const GlobalContext = React.createContext({
  // Index of the current month
  monthIndex: 0,
  // Function to set the month index
  setMonthIndex: (index) => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: (index) => {},
  daySelected: null,
  setDaySelected: (day) => {},
  showEventModal: false,
  setShowEventModal: () => {},
});

export default GlobalContext;
