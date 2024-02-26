import dayjs from "dayjs";

export function getMonth(month = dayjs().month()) {
  // Ensure month is a whole number
  //   month = Math.floor(month);
  // Get the current year
  const year = dayjs().year();
  // Get the day of the week of the first day of the month
  const firstDayOfTheMonth = dayjs(new Date(year, month, -1)).day();
  // Initialize a counter for the days of the month
  let currentMonthCount = 0 - firstDayOfTheMonth;
  // Create a 5x7 matrix to represent the month's days
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      // Increment the counter for each day
      currentMonthCount++;
      // Calculate the date for the current day
      return dayjs(new Date(year, month, currentMonthCount));
      // Format the date as a string in 'YYYY-MM-DD' format
      // return currentDate.format("YYYY-MM-DD");
      // return currentDate.format("YYYY-MM-DD");
    });
  });
  // Return the matrix representing the days of the month
  return daysMatrix;
}
