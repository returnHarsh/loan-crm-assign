const { startOfDay, parseISO } = require('date-fns');

const customStart = "2026-05-21";
const parsed = parseISO(customStart);
const sod = startOfDay(parsed);

console.log("Input:", customStart);
console.log("parseISO(customStart):", parsed.toString(), "UTC:", parsed.toISOString());
console.log("startOfDay(parseISO):", sod.toString(), "UTC:", sod.toISOString());
