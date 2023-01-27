'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Lakshmanan Raj',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Kavitha',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Surya Narayanan',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Bala Guru',
  movements: [430, 1100, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Histry - Movements | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const displayMovements = function (movements,sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;

  movs.forEach(function (mov,i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov} ₹</div>
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
  labelBalance.textContent = `${acc.balance} ₹`
};
// calcDisplayBalance(account1);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Summary in, out, interst | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const calcDisplaySummary = function (acc) {

  // ************** | in | ************** 
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov) => acc + mov,0);
  labelSumIn.textContent = `${incomes}₹`;

  // ************** | out | ************** 
  const outGoing = acc.movements
                 .filter(mov => mov < 0)
                 .reduce((acc,mov) => acc + mov,0);
  labelSumOut.textContent = `${Math.abs(outGoing)}₹`;

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
  labelSumInterest.textContent = `${interest}₹`;
}
// calcDisplaySummary(account1);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Update UI | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const updateUI = function (acc) {
  // ************** | Display Movement | ************** 
      displayMovements(acc.movements);

    // ************** | Display balance | ************** 
      calcDisplayBalance(acc);

    // ************** | Display Summary | ************** 
      calcDisplaySummary(acc);
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | login | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Event Handler

let currentAccount;

btnLogin.addEventListener('click',function (e) {
  // Prevent form from Submitting
  e.preventDefault(); 

  // get Correct Account
  currentAccount = accounts
    .find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    
    // ************** | Display UI and Message | ************** 
      labelWelcome.textContent = `👋 Welcome back, ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity = 100;

    // Update UI
      updateUI(currentAccount);
  };
  // ************** | Clear inputs | **************   
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Transfer Money | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

btnTransfer.addEventListener('click',function (e) {
  // Prevent form from Submitting
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts
  .find(acc => acc.username === inputTransferTo.value);
  // console.log(amount, receiverAcc);

 // Tranfer valid
  if (amount > 0 &&
      receiverAcc &&
      currentAccount.balance >= amount &&
      receiverAcc?.username !== currentAccount.username) 
  {
    console.log('Transfer Valid');
  // Doing Transfer 
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

  // Update UI
    updateUI(currentAccount);
};
// clean inputs
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();

});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Request Loan | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

btnLoan.addEventListener('click',function (e) {
  // preventDefault
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  const percentAge = currentAccount.movements.some(mov => mov >= loanAmount * 0.1);

  if (loanAmount > 0 && percentAge ) {
      // Add Movement
      currentAccount.movements.push(loanAmount);

      // Update UI
        updateUI(currentAccount);
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
  let pin = Number(inputClosePin.value);

  if (currentAccount.username === user &&
      currentAccount.pin === pin) {

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ['a','b','c','d','e'];

// SLICE
console.log(arr.slice(2));    // ['c', 'd', 'e']
console.log(arr.slice(2,4));  // ['c', 'd']
console.log(arr.slice(-2));   // ['d', 'e']
console.log(arr.slice(-1));   // ['e']
console.log(arr.slice(1,-2)); // ['b', 'c']
console.log(arr.slice(0,-4)); // ['a']
console.log(arr.slice());     // ['a', 'b', 'c', 'd', 'e']
console.log([...arr])         // ['a', 'b', 'c', 'd', 'e']

// SPLICE
// console.log(arr.splice(2));   // ['c', 'd', 'e'] delete the original array
console.log(arr.splice(-1));     // ['e']
console.log(arr.splice(1,2));    // ['b','c']
console.log(arr)                 // ['a', 'b']

// REVERSE

arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse());      // ['f', 'g', 'h', 'i', 'j']

// CONCAT

const letters = arr.concat(arr2);
console.log(letters)
console.log([...arr, ...arr2]);

// JOIN

console.log(letters.join(' - '));

// at - method

const arr = [23,56,87];
console.log(arr[0]);    // 23
console.log(arr.at(0)); // 23

// getting last array element
console.log(arr[arr.length - 1]); // 87
console.log(arr.slice(-1));       // [87]
console.log(arr.slice(-1)[0])     // 87

console.log(arr.at(-1));          // 87
console.log(arr.at(-2));          // 56

// this also work on strings
const str = 'Bala Guru';
console.log(str.at(0));     // B
console.log(str.at(-1));    // u
///////////////////////////////////////////////////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for(const [i, movement] of movements.entries()){
  if (movement > 0) {
    console.log(`Movemnet ${i + 1} : You deposite ${movement}`);
  } else {
    console.log(`Movemnet ${i + 1} : You withdrew ${Math.abs(movement)}`);
  };
}

console.log('---- FOR EACH ----');

// forEach Method
movements.forEach(function (mov,i,arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1} : You deposite ${mov}`);
  } else {
    console.log(`Movement ${i + 1} : You withdrew ${Math.abs(mov)}`);
  };
})
//////////////////////////////////////////////////////////////
// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['INR', 'Rupee'],
]);

currencies.forEach(function (value,key,map) {
  console.log(`${key} : ${value}`);
})

// Sets
const correncies = new Set(['USD','INR','USD','EUR','INR']);
console.log(correncies);
correncies.forEach(function (value,_,map) {
  console.log(`${value} : ${value}`);
})
////////////////////////////////////////////////////////////////
// Coding Challenge #1

Julia and Kate are doing a study on dogs. So each of them asked 
5 dog owners about their dog's age, and stored the data into an 
array (one array for each). For now, they are just interested in 
owing whether a dog is an adult or a puppy. A dog is an adult if 
it is at least 3 years old, and it's a puppy if it's less than
 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's 
ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST 
TWO dogs actually have cats, not dogs! So create a shallow copy 
of Julia's array, and remove the cat ages from that copied array 
because it's a bad practice to mutate function parameters)

2. Create an array with both Julia's (corrected) and Kate's data

3. For each remaining dog, log to the console whether 
it's an adult ("Dog number 1 is an adult, and is 5 years old") 
or a puppy ("Dog number 2 is still a puppy 🐶")

4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀

///////////////   My try    ////////////////////////////////////////

const julia = [3, 5, 2, 12, 7];
const kate = [4, 1, 15, 8, 3];

julia.forEach(function (age,i) {
  if (age > 3) {
    console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`)
  } else {
    console.log(`Dog number ${i + 1} is still a puppy 🐶`)
  }
})

const checkDogs = function (dogsJulia,dogsKate) {
  // 1.
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0,1);   // [3]      - removed
  dogsJuliaCorrected.splice(-2);    // [12, 7]  - removed
  // console.log(dogsJulia.slice(1,3));

  // 2.
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);

  // 3.
  dogs.forEach(function (dogAge,i) {
    if (dogAge >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dogAge} years old`)
    } else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`)
    }
  });
  
}

// checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3],[10, 5, 6, 1, 4]);

// MAP Method | INR TO USD ///////////////////////////////////

const inrToUsd = 0.0123;

// const movemnetUSD = movements.map(function (mov) {
//   return mov * inrToUsd;
// });
// Arrow function
const movemnetUSD = movements.map(mov => mov * inrToUsd);

console.log(movements);
console.log(movemnetUSD);

// Another type ------|for of loop|----------------------
const convertUSD = []

for(const mov of movements) convertUSD.push(mov * inrToUsd);
console.log(convertUSD);

const movDesc = movements.map((mov,i,arr) => {
  if (mov > 0) {
    return `Movement ${i + 1} : You deposite ${mov}`;
  } else {
    return `Movement ${i + 1} : You withdrew ${Math.abs(mov)}`;
  };
})
console.log(movDesc);

// simpleah matha
const movDesc = movements.map((mov,i) =>
  `Movement ${i + 1} : You ${mov > 0 ? 'deposite' : 'withdrawal'} ${Math.abs(mov)}`);
console.log(movDesc);

// filter Method | -----------------------------------------------
console.log(movements)
const deposites = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposites)

// arrow function get results of withdrawal
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals)

// i can try for of loop
const depositesFor = [];
for(const mov of movements){
  if (mov > 0) depositesFor.push(mov);
}
console.log(depositesFor);

// Reduce Method | ------------------------------------------------
console.log(movements)

// accumulater -> snow ball (++ increase)
// const balance = movements.reduce(function (acc,cur,i,arr) {
//   console.log(`${i} : ${acc}`)
//   return acc + cur;
// },0)
// console.log(balance);

// arrow function
const balance1 = movements.reduce((acc,cur) => acc + cur,0);
console.log(balance1);

// for of loop
// let balance2 = 0;
// for(const mov of movements) balance2 += mov;
// console.log(balance2);

// Maximum Value
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const max = movements.reduce((acc,mov) => {
  if ( acc > mov ) return acc;    
  else return mov;                
},movements[0]);
console.log(max);
////////////////////////////////////////////////////////////////
// Coding Challenge #2

Let's go back to Julia and Kate's study about dogs.
This time, they want to convert dog ages to human ages and
calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an
arrays of dog's ages ('ages'), and does the following things 
in order:

1. Calculate the dog age in human years using the following 
formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. 
If the dog is > 2 years old, humanAge = 16 + dogAge * 4.

2. Exclude all dogs that are less than 18 human years old 
(which is the same as keeping dogs that are at least 18 years old)

3. Calculate the average human age of all adult dogs 
(you should already know from other challenges how we calculate 
averages 😉)

4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀

const calcAverageHumanAge = function (ages) {
  // 1.
  const humanAges = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4);
  console.log(humanAges);
  // 2.
  const adults = humanAges.filter(age => age >= 18);
  console.log(adults);
  // 3.
  // const average = Math.floor( adults.reduce((acc,age) => acc + age,0) / adults.length );
  const average = Math.floor( adults.reduce((acc,age,i,arr) => acc + age / arr.length,0) );
  // 2 3 | (2+3)/2 = 2.5 === 2/2 + 3/2 = 2.5 |
  console.log(average);

  return average;
}
// 4.
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1,avg2);

const inrToUsd = 0.0123;
const totalDepositUSD = movements
  .filter ( mov => mov > 0 )
  .map ( mov => mov * inrToUsd )
  .reduce ( (acc,mov) => acc + mov, 0 );

console.log(totalDepositUSD);

const movementsTotal = movements.reduce((acc,mov) => acc + mov,0)
console.log(movementsTotal)
//////////////////////////////////////////////////////////
// Coding Challenge #3

Rewrite the 'calcAverageHumanAge' function from the previous 
challenge, but this time as an arrow function, and using 
chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀

const calcAverageHumanAge = function (ages) {
  const humanAge = ages
  .map(age => age <= 2 ? age * 2 : 16 + age * 4)
  .filter(adult => adult >= 18)
  .reduce((acc,age,i,arr) => acc + age / arr.length,0)
  return humanAge;
}
const age1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const age2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(age1,age2)

/////////////////////////////////////////////////////////////
// find medhod || to get my account

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Bala Guru');
console.log(account)
////////////////////////////////////////////////////////////////
console.log(movements);

Equality
console.log(movements.includes(-130));

SOME -- Condition
console.log(movements.some(mov => mov === -130)); // | we use includes Medhud

console.log(movements.some(mov => mov > 4000));   // | some is perfect for that

EVERY
console.log(movements.every(mov => mov > -700));

Seperate call back
const depo = mov => mov > 1000;
console.log(movements.some(depo));
console.log(movements.every(depo));
console.log(movements.filter(depo));

// Flat Method //////////////////////////////////////////////////

const arr = [[1,2,3],[4,5,6],[7,8,9]];
const arr1 = [ [ [1,2] ,3] , [4, [5,6] ] , [7, [8,9] ] ];

console.log(arr.flat());
console.log(arr1.flat());

// const accountMovement = accounts.map(acc => acc.movements);
// console.log(accountMovement);

// const allMovement = accountMovement.flat();
// console.log(allMovement);

// const overallBalance = allMovement.reduce((acc,mov) => acc + mov,0);
// console.log(overallBalance);

// Above all in | Chaning medhod

const overallBalance = accounts
                        .map(acc => acc.movements)
                        .flat()
                        .reduce((acc,mov) => acc + mov,0);
console.log(overallBalance);

// flatMp 
const overallBalance1 = accounts
                        .flatMap(acc => acc.movements)
                        .reduce((acc,mov) => acc + mov,0);
console.log(overallBalance1);

// SORTiNG ///////////////////////////////////////////////////////

// Strings-------------------------
const owners = ['Dhana','Bala','Surya','Abi'];
// console.log(owners.sort());

// Number----------------------------
console.log(movements);
// console.log(movements.sort());


// return < 0,A,B | ( Keep Order )
// return < 0,B,A | ( Switch Order )

// Assending--------------------------
// movements.sort((a,b) => {
//   if (a > b) return 1;
//   if (b > a) return -1; // ----->   a < b | SAME
// });
//          ||
movements.sort((a,b) => a - b);   // assending
console.log(movements);

// Dessending-------------------------

// movements.sort((a,b) => {
//   if (a > b) return -1;
//   if (b > a) return 1; // ----->   a < b | SAME
// });
//          ||
movements.sort((a,b) => b - a);   // Dessending
console.log(movements);
*/














