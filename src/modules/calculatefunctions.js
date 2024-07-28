export function round2dec(value) {
  if (value % 1 !== 0) {
    return Number(Math.round(value + 'e' + 2) + 'e-' + 2).toFixed(2);
  } else {
    return value;
  }
}

export function NumInWords(number) {
  const first = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen ',
  ];
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  const mad = ['', 'thousand', 'million', 'billion', 'trillion'];
  let word = '';

  for (let i = 0; i < mad.length; i++) {
    let tempNumber = number % (100 * Math.pow(1000, i));
    if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
      if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
        word = titleCase(
          first[Math.floor(tempNumber / Math.pow(1000, i))] +
            mad[i] +
            ' ' +
            word,
        );
      } else {
        word = titleCase(
          tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
            ' ' +
            first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
            mad[i] +
            ' ' +
            word,
        );
      }
    }

    tempNumber = number % Math.pow(1000, i + 1);
    if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
      word = titleCase(
        first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
          'hunderd ' +
          word,
      );
  }
  return word;
}

export function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

export function percentTotal(value) {
  if (value >= 90) {
    return 'A+';
  } else if (value >= 80) {
    return 'A';
  } else if (value >= 70) {
    return 'B+';
  } else if (value >= 60) {
    return 'B';
  } else if (value >= 45) {
    return 'C+';
  } else if (value >= 25) {
    return 'C';
  } else {
    return 'D';
  }
}

export function findEmptyValues(obj) {
  let emptyValues = false;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0)
      ) {
        emptyValues = true;
      }
    }
  }
  return emptyValues;
}

export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
}

export function validateEmptyValues(obj) {
  const emptyFields = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isEmpty(obj[key])) {
        emptyFields[key] = 'Field is empty';
      }
    }
  }

  return emptyFields;
}

export function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + 'st';
  }
  if (j === 2 && k !== 12) {
    return i + 'nd';
  }
  if (j === 3 && k !== 13) {
    return i + 'rd';
  }
  return i + 'th';
}

export const getMonthName = date => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const d = new Date(date);
  return monthNames[d.getMonth()];
};

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const finMonths = [
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
];
export const getMonthDays = [31, 30, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function GetMonthName(monthNumber) {
  monthNumber = monthNumber < 0 ? 11 : monthNumber;
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[monthNumber];
}
export function compareObjects(x, y) {
  if (x === y) return true;
  // if both x and y are null or undefined and exactly the same

  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) return false;
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.

  for (var p in x) {
    if (!x.hasOwnProperty(p)) continue;
    // other properties were tested using x.constructor === y.constructor

    if (!y.hasOwnProperty(p)) return false;
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[p] === y[p]) continue;
    // if they have the same strict value or identity then they are equal

    if (typeof x[p] !== 'object') return false;
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!compareObjects(x[p], y[p])) return false;
    // Objects and Arrays must be tested recursively
  }

  for (p in y) if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
  // allows x[ p ] to be set to undefined

  return true;
}

export const IndianFormat = x => {
  x = x?.toString();
  var afterPoint = '';
  if (x.indexOf('.') > 0) afterPoint = x.substring(x.indexOf('.'), x.length);
  x = Math.floor(x);
  x = x?.toString();
  var lastThree = x.substring(x.length - 3);
  var otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  return (
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + afterPoint
  );
};

export function INR(input) {
  const rupees = Number(parseInt(input, 10));
  const output = [];

  if (rupees === 0) {
    output.push('zero');
  } else if (rupees === 1) {
    output.push('one');
  } else {
    const crores = Math.floor(rupees / 10000000) % 100;
    if (crores > 0) {
      output.push(`${getHundreds(crores)} crore`);
    }

    const lakhs = Math.floor(rupees / 100000) % 100;
    if (lakhs > 0) {
      output.push(`${getHundreds(lakhs)} lakh`);
    }

    const thousands = Math.floor(rupees / 1000) % 100;
    if (thousands > 0) {
      output.push(`${getHundreds(thousands)} thousand`);
    }

    const hundreds = Math.floor((rupees % 1000) / 100);
    if (hundreds > 0 && hundreds < 10) {
      output.push(`${getOnes(hundreds)} hundred`);
    }

    const tens = rupees % 100;
    if (tens > 0) {
      if (rupees > 100) output.push('and');
      output.push(`${getHundreds(tens)}`);
    }
  }

  return ['Rupees', ...output, 'only']
    .join(' ')
    .split(/\s/)
    .filter(e => e)
    .map(e => e.substr(0, 1).toUpperCase() + e.substr(1))
    .join(' ');
}

function getOnes(number) {
  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];
  return ones[number] || '';
}

function getTeens(number) {
  const teens = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  return teens[number] || '';
}

function getTens(number) {
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  return tens[number] || '';
}

function getHundreds(num) {
  if (num > 0 && num < 10) {
    return getOnes(num);
  }
  if (num >= 10 && num < 20) {
    return getTeens(num % 10);
  }
  if (num >= 20 && num < 100) {
    return `${getTens(Math.floor(num / 10))} ${getOnes(num % 10)}`;
  }
  return '';
}
export const getDay = text => {
  let date = new Date(text);
  let day = date.getDate();
  return ordinal_suffix_of(day);
};
export const getFullYear = text => {
  let date = new Date(text);

  let year = date.getFullYear();
  return year;
};

export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export const randRGBColor = () => {
  let min = 0;
  let max = 255;
  let color = `rgb(${randBetween(min, max)},${randBetween(
    min,
    max,
  )},${randBetween(min, max)})`;

  return color;
};
export const randRGBAColor = () => {
  let min = 0;
  let max = 255;
  let color = `rgba(${randBetween(min, max)},${randBetween(
    min,
    max,
  )},${randBetween(min, max)},.3)`;

  return color;
};
export function getSubmitDateInput(date) {
  if (date) {
    let data = date.split('/');
    let day = data[1];
    let month = data[0];
    let year = data[2];
    return `${day}-${month}-${year}`;
  }
}
export function getSubmitYearInput(date) {
  if (date) {
    let data = date.split('/');
    let day = data[1];
    let month = data[0];
    let year = data[2];
    return `${year}-${month}-${day}`;
  }
}
export function dateStringToDateObj(date) {
  if (date) {
    let data = date.split('-');
    let day = data[0];
    let month = data[1];
    let year = data[2];
    return new Date(year, month, day);
  }
}

export function differenceInDays(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  const diff = end - start;
  const seconds = (end.getTime() - start.getTime()) / 86400000;
  return seconds;
}
export function dateObjToDateFormat(date) {
  let currentDate = new Date(date);
  let day = currentDate.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let month = currentDate.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let year = currentDate.getFullYear();
  return `${day}-${month}-${year}`;
}
export function getCurrentDateInput(date) {
  if (date) {
    let data = date.split('-');
    let day = data[0];
    let month = data[1];
    let year = data[2];
    return `${year}-${month}-${day}`;
  }
}
export function getCurrentDateSlashInput(date) {
  if (date) {
    let data = date.split('/');
    let day = data[0];
    let month = data[1];
    let year = data[2];
    return `${year}-${month}-${day}`;
  }
}
export function getCurrentDateReverseSlashInput(date) {
  if (date) {
    let data = date.split('-');
    let day = data[0];
    let month = data[1];
    let year = data[2];
    return `${year}/${month}/${day}`;
  }
}

export const generateID = () => {
  const capitalAlphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let randomCode = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * capitalAlphabets.length);
    randomCode += capitalAlphabets[randomIndex];
  }

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomCode += numbers[randomIndex];
  }

  return randomCode;
};

export function avoidNaN(val) {
  if (isNaN(val)) {
    return 0;
  }
  return parseInt(val);
}

export const getServiceAge = date => {
  if (!date) return '';
  let currentDate = Date.now();
  let birthDate = Date.parse(getCurrentDateInput(date));
  let yearInMillis = 31556926000;
  let age = Math.floor((currentDate - birthDate) / yearInMillis);
  return age;
};
export const getServiceLife = date => {
  if (!date) return '';
  let currentDate = Date.now();
  let birthDate = Date.parse(getCurrentDateInput(date));
  let yearInMillis = 31556926000;
  let monthinMillis = 2629800000;
  let age = Math.floor((currentDate - birthDate) / yearInMillis);
  let months = Math.floor(
    ((currentDate - birthDate) % yearInMillis) / monthinMillis,
  );
  if (age) {
    return `${age} years ${months} months`;
  } else {
    return `${months} months`;
  }
};
export function removeDuplicates(books) {
  // Create an array of objects

  // Declare a new array
  let newArray = [];

  // Declare an empty object
  let uniqueObject = {};
  let objTitle;
  // Loop for the array elements
  for (let i in books) {
    // Extract the title
    objTitle = books[i]['id'];

    // Use the title as the index
    uniqueObject[objTitle] = books[i];
  }

  // Loop to push unique object into array
  for (let i in uniqueObject) {
    newArray.push(uniqueObject[i]);
  }

  // Display the unique objects
  return newArray;
}

export const filterArrayExtraItems = (x, y) => {
  return x.filter(item => !y.includes(item));
};
export const filterArraySameItems = (x, y) => {
  return x.filter(item => y.includes(item));
};
export const uniqArray = a => [...new Set(a)];
export const monthNamesWithIndex = [
  {monthName: 'January', index: '01', rank: 1},
  {monthName: 'February', index: '02', rank: 2},
  {monthName: 'March', index: '03', rank: 3},
  {monthName: 'April', index: '04', rank: 4},
  {monthName: 'May', index: '05', rank: 5},
  {monthName: 'June', index: '06', rank: 6},
  {monthName: 'July', index: '07', rank: 7},
  {monthName: 'August', index: '08', rank: 8},
  {monthName: 'September', index: '09', rank: 9},
  {monthName: 'October', index: '10', rank: 10},
  {monthName: 'November', index: '11', rank: 11},
  {monthName: 'December', index: '12', rank: 12},
];
