//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
//https://stackoverflow.com/questions/48621533/how-convert-date-format-in-javascript-reactjs
//https://stackoverflow.com/questions/44784774/in-react-how-to-format-a-number-with-commas

/* This module was copied here from a different project. This is why there are many unused
 * functions in this file. Needs to be reviewed, but anything string formatting related
 * is going here. */
const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const dateOnlyFormat = new Intl.DateTimeFormat("en-US", {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencySign: "accounting",
  minimumFractionDigits: 2,
});

const percentFormat = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
});

const padLeft = (num: number, count: number = 2): string =>
  num.toString().padStart(count, "0");

export const formatTimeStamp = (
  hour: number,
  minute: number,
  second: number
) => {
  return `${padLeft(hour)}:${padLeft(minute)}:${padLeft(second)}`;
};

export const formatTimeSpan = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number
) => {
  return `${padLeft(days)}.${formatTimeStamp(
    hours,
    minutes,
    seconds
  )}.${padLeft(milliseconds, 7)}`;
};

//I hate JavaScript so much because of things like this
export const formatIsoDate = (date: Date): string => {
  const output = `${date.getFullYear()}-${padLeft(
    date.getMonth() + 1
  )}-${padLeft(date.getDate())}`;

  console.log(output);

  return output;
};

export const formatDate = (date: Date): string =>
  dateOnlyFormat.format(new Date(date));

export const formatDateTime = (dateTime: Date): string =>
  dateTimeFormat.format(new Date(dateTime));

export const formatNumber = (number: number, places: number = 0): string => {
  const nf = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: places,
  });

  return nf.format(number);
};

export const formatCurrency = (amount: number): string =>
  currencyFormat.format(amount);

export const formatPercent = (ratio: number): string =>
  percentFormat.format(ratio);

const guidPattern =
  /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

export const isValidGuidString = (guid: string): boolean =>
  guidPattern.test(guid);
