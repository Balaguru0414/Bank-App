'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Lakshmanan Raj',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2022-12-28T09:15:04.904Z',
    '2023-01-15T10:17:24.185Z',
    '2023-01-22T14:11:59.604Z',
    '2023-01-27T17:01:17.194Z',
    '2023-01-28T23:36:17.929Z',
    '2023-01-30T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // 
};

const account2 = {
  owner: 'Kavitha',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-08T21:31:17.178Z',
    '2022-12-15T07:42:02.383Z',
    '2022-12-19T09:15:04.904Z',
    '2023-01-02T10:17:24.185Z',
    '2023-01-11T14:11:59.604Z',
    '2023-01-15T17:01:17.194Z',
    '2023-01-27T23:36:17.929Z',
    '2023-01-30T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
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

/////////////////////////////////////////////////
// Functions

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | create Userame | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
     acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
    // console.log(acc.username);
  }); 
};

creatUserNames(accounts);
// console.log(accounts);
// console.log(creatUserNames("Bala Guru"));
// creatUserNames('Bala Guru');

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Day and Date | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const formatMovementsDate = function (date,locale) {

    const calcDayPassed = (date1,date2) => 
    Math.round(Math.abs(date2 - date1)/(1000 * 60 * 60 * 24));      // millisec - sec - minute - day

    const dayPassed = calcDayPassed(new Date(),date);
    // console.log(dayPassed);

    if (dayPassed === 0) return 'today';
    if (dayPassed === 1) return 'yesterday';
    if (dayPassed <= 7) return `${dayPassed} days ago`;
    
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    
    return new Intl.DateTimeFormat(locale).format(date)
};

const formatCur = function (value,locale,currency) {
  return new Intl.NumberFormat(locale,{        
          style : 'currency',
          currency : currency,
        }).format(value);
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Histry - Movements | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const displayMovements = function (acc,sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? 
  acc.movements.slice().sort((a,b) => a-b)
   : acc.movements;

  movs.forEach(function (mov,i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

      const date = new Date(acc.movementsDates[i]);      
      const displayDate = formatMovementsDate(date,acc.locale);

      const formattedMov = formatCur(mov,acc.locale,acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html);
  });
};
// displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Balance | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc,cur) => acc + cur,0);
  acc.balance = balance;

  labelBalance.textContent = formatCur(acc.balance,acc.locale,acc.currency);
};
// calcDisplayBalance(account1);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Summary in, out, interst | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const calcDisplaySummary = function (acc) {

  // ************** | in | ************** 
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov) => acc + mov,0);
  labelSumIn.textContent = formatCur(incomes,acc.locale,acc.currency);

  // ************** | out | ************** 
  const outGoing = acc.movements
                 .filter(mov => mov < 0)
                 .reduce((acc,mov) => acc + mov,0);
  labelSumOut.textContent = formatCur(Math.abs(outGoing),acc.locale,acc.currency);

  // ************** | interest | ************** 
  const interest = acc.movements
                 .filter(mov => mov > 0)        // plus value mattum eduka
                 .map((deposit,i,arr) => {
                  // console.log(arr)
                  return (deposit * acc.interestRate) / 100
                 })
                 .filter((int,i,arr) => {       // 0 - irundha adhakula interest poda mudiyadhu
                  // console.log(arr)
                  return int > 1
                 })
                 .reduce((acc,int) => acc + int);
  labelSumInterest.textContent = formatCur(interest,acc.locale,acc.currency);
}
// calcDisplaySummary(account1);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Update UI | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const updateUI = function (acc) {
  
    // ************** | Display Movement | ************** 
      displayMovements(acc);

    // ************** | Display balance | ************** 
      calcDisplayBalance(acc);

    // ************** | Display Summary | ************** 
      calcDisplaySummary(acc);
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | logout Timer | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const startLogoutTimer  = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2,'0');
    const sec = String(time % 60).padStart(2,'0');
    
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min} : ${sec}`;

  // When 0s stop timer and logout user
  if(time === 0){
    clearTimeout(timer);
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;
  };

  // Decrease 1s
    time--
  };

  // Set time to 3 minutes
  let time = 180;

  // Call the timer every second
  tick();
  
  const timer = setInterval(tick,1000);
  return timer;
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | login | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Event Handler

let currentAccount,timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// ************** | login inputs | ************** 

btnLogin.addEventListener('click',function (e) {
  // Prevent form from Submitting
  e.preventDefault(); 

  // get Correct Account
  currentAccount = accounts
    .find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);
  if (currentAccount?.pin === +(inputLoginPin.value)) {
    
    // ************** | Display UI and Message | ************** 
      labelWelcome.textContent = `👋 Welcome back, ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity = 100;

    // ************** | Date | ************** 

    const now = new Date();

    const options = {
      hour : 'numeric',
      minute : 'numeric',
      day : 'numeric',
      month : 'long',
      year : 'numeric',
      weekday : 'long',
    };

    // const locale = navigator.language;
    // console.log(locale)

    labelDate.textContent = new Intl.DateTimeFormat
    (currentAccount.locale,options).format(now)


    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // const sec = now.getSeconds();

    // const displayDate= `${day}/${month}/${year}, ${hour}:${min}`
    // labelDate.textContent = displayDate;

    // ************** | Clear inputs | **************   
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();

      // Timer
      if(timer) clearTimeout(timer);
      timer = startLogoutTimer();

      // Update UI
        updateUI(currentAccount);
    };
  
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Transfer Money | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

btnTransfer.addEventListener('click',function (e) {
  // Prevent form from Submitting
  e.preventDefault();

  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts
  .find(acc => acc.username === inputTransferTo.value);
  // console.log(amount, receiverAcc);

  // clean inputs
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();

 // Tranfer valid
  if (amount > 0 &&
      receiverAcc &&
      currentAccount.balance >= amount &&
      receiverAcc?.username !== currentAccount.username) 
  {
    // console.log('Transfer Valid');
  // Doing Transfer 
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

  // Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

  // Update UI
    updateUI(currentAccount);

  // reset timer
    clearTimeout(timer);
    timer = startLogoutTimer();
};

});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Request Loan | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

btnLoan.addEventListener('click',function (e) {
  // preventDefault
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if(loanAmount > 0 && currentAccount.movements
    .some(mov => mov >= loanAmount * 0.1)){
  setTimeout(function () {

      // Add Movement
      currentAccount.movements.push(loanAmount);

      // Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
        updateUI(currentAccount);

      // reset timer
        clearTimeout(timer);
        timer = startLogoutTimer();
    },1000);
  }
// clean input
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Close Account | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

btnClose.addEventListener('click',function (e) {
  // preventDefault
  e.preventDefault();
  let user = inputCloseUsername.value;
  let pin = +(inputClosePin.value);

  if (currentAccount.username === user &&
      currentAccount.pin === pin) {

    const index = accounts.findIndex(acc => 
      acc.username === currentAccount.username);
    // console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  };
  // clean Input
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Sorting Movements | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

let stored = false;

btnSort.addEventListener('click',function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements,!stored);
  stored = !stored;
});