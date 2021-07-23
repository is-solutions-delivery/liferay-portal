/**
 * @param {Object} fields - Object containing form field values
 * @returns {number} Number of completed fields
 */
export const countCompletedFields = (fields) => {
  let count = 0;
  const keys = Object.keys(fields);

  keys.forEach((key) => {
    if (typeof fields[key] === "undefined") return;

    if (typeof fields[key] === "object") {
      count += countCompletedFields(fields[key]);
    } else if (
      (typeof fields[key] === "string" || typeof fields[key] === "boolean") &&
      fields[key] !== ""
    ) {
      count += 1;
    }
  });

  return count;
};

/**
 * @param {number} current - Current value (represents some percentage of a total)
 * @param {number} total - Total value (represents 100%)
 * @returns {number} Percentage
 */
export const calculatePercentage = (current, total) => {
  if (current > total) return 100;
  return (current * 100) / total;
};

/**
 * @param {number} radius - Circle radius
 * @returns {number} Circumference
 */
export const calculateCircumference = (radius) => radius * 2 * Math.PI;

/**
 * @param {number} percent - Current percentage
 * @param {number} circumference - Circumference
 * @returns {number} Circumference Offset
 */
export const calculateOffset = (percent, circumference) =>
  circumference - (percent / 100) * circumference;
