"use strict";
const { TZ } = require("./config");
const dayKey = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d); // YYYY-MM-DD
const addHours = (d, h) => new Date(d.getTime() + h * 3600e3);
const addDays = (d, n) => new Date(d.getTime() + n * 86400e3);
const toDate = (v) => (v && v.toDate ? v.toDate() : v ? new Date(v) : null);
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
module.exports = { dayKey, addHours, addDays, toDate, norm };
