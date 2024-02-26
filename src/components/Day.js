import React from "react";

export default function Day({ day, rowIdx }) {
  return (
    <div className="boder boder-gray-200 flex flex-col">
      {/* {day.format()} */}
      <header className="flex flex-col items-center">
        {/* In this case, the name of the every week should be in the first row. */}
        {rowIdx === 0 && (
          <p className="text-sm mt-1">{day.format("ddd").toUpperCase()}</p>
        )}
        <p className="text-sm p-1 my-1 text-center">{day.format("DD")}</p>
      </header>
    </div>
  );
}
