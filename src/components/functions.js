export const formatDate = (date = new Date(), showWeekday = true) => {
    // If date is a string in 'yyyy-mm-dd' format, convert it to a Date object
    if (typeof date === 'string') {
      date = new Date(date);
    }
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date");
      return "";
    }
  
    const options = {
      year: 'numeric',  // "2024"
      month: 'long',    // "January"
      day: 'numeric',   // "12"
    };
  
    // If showWeekday is true, include the weekday in the format
    if (showWeekday) {
      options.weekday = 'long';  // "Monday"
    }
  
    return date.toLocaleDateString('en-US', options);
};

export const formatTime = (date) => {
  if (!date || !(date instanceof Date)) {
    return "Not set"
  }
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  })
}

export const getDaysString = (selectedDays) => {
  if (!Array.isArray(selectedDays) || selectedDays.length !== 7) {
    return "Not set"
  }
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return days.filter((_, index) => selectedDays[index]).join(", ") || "None"
}
