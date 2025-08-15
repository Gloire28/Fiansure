export const isDateNotFuture = (date) => new Date(date) <= new Date();
export const isEndDateValid = (startDate, endDate) => new Date(endDate) > new Date(startDate);
export const daysRemaining = (endDate) => {
  const diff = new Date(endDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};