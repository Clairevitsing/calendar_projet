import React, { useState } from "react";
import "./App.css";
import { getMonth } from "./util";
import CalendarHeader from "./components/CalendarHeader";
// import Sidebar from "./components/SideBar";
import Month from "./components/Month";

function App() {
  const month = getMonth(3);
  console.table(month);
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  return (
    <React.Fragment>
      <div className="h-screen flex flex-columns">
        <CalendarHeader />
        {/* <Sidebar /> */}
        <Month month={currentMonth} />
      </div>
    </React.Fragment>
  );
}

export default App;
