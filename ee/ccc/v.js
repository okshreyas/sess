const currentDate = new Date();

// Format time (HH:MM:SS)
const interaction_time = currentDate.toTimeString().slice(0, 8);

// Format date (MM/DD/YYYY)
const interaction_date = (currentDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
  currentDate.getDate().toString().padStart(2, '0') + '/' + currentDate.getFullYear();

// Extract year and month
const interaction_year = currentDate.getFullYear();
const interaction_month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

console.log("interaction_time:", interaction_time);
console.log("interaction_date:", interaction_date);
console.log("interaction_month:", interaction_month);
console.log("interaction_year:", interaction_year);
