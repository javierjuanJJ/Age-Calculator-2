const { DateTime } = luxon;

const form = document.querySelector("#age-form");
const input = document.querySelector("#birthdate");
const errorBox = document.querySelector("#error-message");
const result = document.querySelector("#result");
const totals = document.querySelector("#totals");
const extra = document.querySelector("#extra");

const units = {
  years: document.querySelector("#years"),
  months: document.querySelector("#months"),
  days: document.querySelector("#days"),
};

const labels = {
  years: document.querySelector("#years-label"),
  months: document.querySelector("#months-label"),
  days: document.querySelector("#days-label"),
};

const today = () => DateTime.local().startOf("day");

flatpickr(input, {
  dateFormat: "Y-m-d",
  maxDate: today().toFormat("Y-m-d"),
  allowInput: true,
  disableMobile: true,
});

const pluralize = (value, unit) => `${value} ${unit}${value === 1 ? "" : "s"}`;

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
  input.classList.add("invalid");
  result.hidden = true;
}

function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = "";
  input.classList.remove("invalid");
}

function calculateAge(birth, now) {
  const diff = now.diff(birth, ["years", "months", "days"]);

  return {
    years: diff.years,
    months: diff.months,
    days: diff.days,
    totalMonths: now.diff(birth, "months").months,
    totalDays: Math.floor(now.diff(birth, "days").days),
    totalHours: Math.floor(now.diff(birth, "hours").hours),
    totalMinutes: now.diff(birth, "minutes").minutes,
  };
}

function render(age) {
  Object.entries(units).forEach(([unit, node]) => {
    node.textContent = age[unit];
    labels[unit].textContent = unit;
  });

  const totalWeeks = Math.floor(age.totalDays / 7);
  const remainingDays = age.totalDays % 7;

  totals.textContent = [
    pluralize(age.totalMonths, "month"),
    pluralize(totalWeeks, "week"),
    pluralize(remainingDays, "day"),
    pluralize(age.totalHours, "hour"),
    pluralize(age.totalMinutes, "minute"),
  ].join(" · ");

  extra.textContent = `That is about ${Math.floor(
    age.totalDays / 365.25
  )} years of life so far.`;

  result.hidden = false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();

  const raw = input.value.trim();
  if (!raw) {
    showError("Please select your date of birth.");
    return;
  }

  const birth = DateTime.fromISO(raw, { zone: "local" }).startOf("day");
  if (!birth.isValid) {
    showError("That date is not valid. Use the format YYYY-MM-DD.");
    return;
  }

  const now = today();
  if (birth > now) {
    showError("Your birthdate cannot be in the future.");
    return;
  }

  render(calculateAge(birth, now));
});

input.addEventListener("input", clearError);
