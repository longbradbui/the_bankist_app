'use strict';
///////////////////////////////////////////////////
////////////// THE BANKIST APP ///////////////////
/////////////////////////////////////////////////

/////////////////////////////////////////////////
///////////// User  Account ////////////////////
///////////////////////////////////////////////

const account1 = {
  owner: 'Long Bui',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1234,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-02-03T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2022-02-06T10:51:36.790Z',
  ],
  currency: 'VND',
  locale: 'vi-vn',
};

const account2 = {
  owner: 'Tony Stark',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 50, 10, 100],
  interestRate: 1.5,
  pin: 1234,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

///////////////////////////////////////////////////
///////////////// Elements ///////////////////////
/////////////////////////////////////////////////

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////////////////////////////////////
//////////////// Functions ///////////////////////
/////////////////////////////////////////////////

// DISPLAYING MOVEMENTS DATE //
const formatMovementDate = function (date, locale) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); // millisecond * second * minute * hour
  const daysPassed = calcDayPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else return new Intl.DateTimeFormat(locale).format(date);
};

// FORMATTING USERS' CURRENCY //
const formatCurrency = function (value, locale, userCurrency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: userCurrency,
  }).format(value);
};

// DISPLAYING USER TRANSACTIONS //
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // Display the time of transaction
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMovement = formatCurrency(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">      
        ${i + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovement}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// CALCULATING BANK BALANCE //
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

// CALCULATING MONEY IN MONEY OUT //
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCurrency(
    incomes,
    acc.locale,
    acc.currency
  )}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  )}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatCurrency(
    interest,
    acc.locale,
    acc.currency
  )}`;
};

// CREATING ACCOUNT 'USERNAME' //
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// UPDATE USER INTERFACE
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// LOGOUT TIMER
const startLogOutTimer = function () {
  const tick = function () {
    const minute = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${minute} : ${second}`;
    // When we reach 0, stop timer and log out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Lod in to get started`;
      containerApp.style.opacity = 0;
      // Decrease 1 second
    }
    time--;
  };
  // Set the time to 5 minutes
  let time = 120;
  // Call the timer every second
  tick(); //this to call the function IMMEDIATELY
  const timer = setInterval(tick, 1000); // this to call after 1s
  return timer;
};

///////////////////////////////////////////////////
////////////// Event handlers ////////////////////
/////////////////////////////////////////////////

let currentAccount;
let timer;

// LOGGING USER IN
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Creating current date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const mins = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // Delete previous owner's timer
    if (timer) {
      clearInterval(timer);
    }
    // Start a new timer + Update new user interface
    startLogOutTimer();
    updateUI(currentAccount);
  }
});

// TRANSFERRING MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Adding transfer date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    // Update UI
    updateUI(currentAccount);
    // Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// REQUESTING A LOAN FROM BANK
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      // Adding loan date
      currentAccount.movementsDates.push(new Date());
      // Update UI
      updateUI(currentAccount);
      // Reset the timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 4000);
  }
  inputLoanAmount.value = '';
});

// CLOSING AN ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // Delete account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// SORTING MOVEMENTS
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

///////////////////////////////////////////////////
//////////////// LECTURES ////////////////////////
/////////////////////////////////////////////////

console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

// Conversion
console.log(Number('23'));
console.log(+'23');

// Parsing (the number has to stand before)
console.log(Number.parseInt('30MP', 10));
console.log(Number.parseInt('MP30', 10));
console.log(Number.parseFloat('MP30', 10));

// Math operator
console.log(Math.sqrt(25));
console.log(64 ** (1 / 2));
console.log(Math.max(1, 2, 3, 4, 5, 6));
console.log(Math.min(1, 2, 3, 4, 5, 6));
console.log(Math.PI * parseFloat('10px') ** 2);
console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0 <...< 1 -> 0<...< (max-min)-> +min <...< +max
console.log(randomInt(1, 10));

// Rounding integers
console.log(Math.trunc(23.9));

console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor(23.9));

console.log(Math.trunc(-23.5));
console.log(Math.floor(-23.5));

// Rounding decimals
console.log((2.6).toFixed(4));
console.log((2.6).toFixed(0));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));

// Remainder operator
console.log(5 % 2);

const isEven = n => n % 2 === 0;
console.log(isEven(9));
console.log(isEven(20));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) {
      row.style.backgroundColor = 'orange';
    }
  });
});

// Numeric Seperators
const diameter = 287_460_000_000;
console.log(diameter);

const priceInCents = 345_99;
console.log(priceInCents);

// BigInt

// Dates and Time
// Create Date
const now1 = new Date();
console.log(now1);
console.log(new Date('2022'));
console.log(new Date(account1.movementsDates[1]));

// Intl Numbers
const number = 123456.789;
const options = {
  style: 'unit',
  unit: 'mile-per-hour',
};
console.log(
  'US:      ',
  new Intl.NumberFormat('en-US', options).format(number)
);
console.log(
  'Germany: ',
  new Intl.NumberFormat('de-DE', options).format(number)
);
console.log(
  'Syria:   ',
  new Intl.NumberFormat('ar-SY', options).format(number)
);
console.log(
  'Browser: ',
  new Intl.NumberFormat(navigator.language, options).format(number)
);

// Set timeout
console.log('---Pizza Store---');
const ingredients = ['peperoni 🌭', 'olives 🫒', 'spinach 🥬'];
const pizzaMaker = setTimeout(
  (ing1, ing2, ing3) =>
    console.log(` 🍕 Here is your pizza 🍕 with ${(ing1, ing2)} and ${ing3} `),
  5000,
  ...ingredients
);
console.log('Waiting.....⏰');
if (ingredients.includes('spinach 🥬')) {
  clearTimeout(pizzaMaker);
  setTimeout(() => console.log(`We cannot make your pizza`), 5000);
}

//Set time intervals
// setInterval(function () {
//   const day = new Date();
//   console.log(day);
// }, 1000);
