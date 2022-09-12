"use strict";

const ul = document.querySelector(".transaction-history ul");
const balance = document.querySelector(".balance-info");
const totalDeposits = document.querySelector(".in .value");
const totalWithdrawals = document.querySelector(".out .value");
const totalInterests = document.querySelector(".interest .value");
const user = document.querySelector(".credentials input:nth-of-type(1)");
const pin = document.querySelector(".credentials input:nth-of-type(2)");
const sb = document.querySelector(".credentials .submit-button");
const sortBtn = document.querySelector(".sort");
const date = document.querySelector(".date");
const transferBtn = document.querySelector(
  ".operation-transfer .submit-button"
);
const transferTo = document.querySelector(
  ".operation-transfer div:nth-child(1) input"
);
const transferAmount = document.querySelector(
  ".operation-transfer div:nth-child(2) input"
);
const loanBtn = document.querySelector(".operation-loan .submit-button");
const loanAmount = document.querySelector(
  ".operation-loan div:nth-child(1) input"
);
const closeBtn = document.querySelector(".operation-close .submit-button");
const closeUser = document.querySelector(
  ".operation-close div:nth-child(1) input"
);
const closePin = document.querySelector(
  ".operation-close div:nth-child(2) input"
);
const container = document.querySelector(".container");
const heading = document.querySelector("header .heading");
const timer = document.querySelector(".transaction-operation .text");

let currentAcc = null;
let unsortedTransactions = null;
let sorted = false;

const account1 = {
  owner: "Deepraj Dey",
  pin: 1111,
  interestRate: 1.2,
  transactions: [
    {
      amount: 200,
      date: 1661379923000,
    },
    {
      amount: -100,
      date: 1661120723000,
    },
    {
      amount: 500,
      date: 1648933212000,
    },
    {
      amount: 800,
      date: 1648933212000,
    },
    {
      amount: -200,
      date: 1661382441000,
    },
    {
      amount: 300,
      date: 1661598926605,
    },
  ],
};

const account2 = {
  owner: "Anik Bose",
  pin: 1112,
  interestRate: 1.2,
  transactions: [
    {
      amount: 200,
      date: 1648933212000,
    },
    {
      amount: -100,
      date: 1648933212000,
    },
    {
      amount: 500,
      date: 1648933212000,
    },
    {
      amount: 800,
      date: 1648933212000,
    },
    {
      amount: -200,
      date: 1648933212000,
    },
    {
      amount: 9000,
      date: 1633208412000,
    },
  ],
};

const account3 = {
  owner: "Sourav Basak",
  pin: 1113,
  interestRate: 1.4,
  transactions: [
    {
      amount: 200,
      date: 1648933212000,
    },
    {
      amount: -100,
      date: 1648933212000,
    },
    {
      amount: 500,
      date: 1648933212000,
    },
    {
      amount: 800,
      date: 1648933212000,
    },
    {
      amount: -200,
      date: 1648933212000,
    },
    {
      amount: 1000,
      date: 1625259612000,
    },
  ],
};

const createDateAndTime = (timeStamp) => {
  const dateObj = new Date(timeStamp);
  // const currDateObj = new Date(Date.now());
  // const date = `${dateObj.getDate()}`.padStart(2, 0);
  // const month = `${dateObj.getMonth()}`.padStart(2, 0);
  // const year = `${dateObj.getFullYear()}`.slice(2).padStart(2, 0);
  // const minute = `${dateObj.getMinutes()}`.padStart(2, 0);
  // const hour = `${dateObj.getHours()}`.padStart(2, 0);
  // const secs = `${dateObj.getSeconds()}`.padStart(2, 0);
  // const calc = Number(`${currDateObj.getDate()}`.padStart(2, 0)) - date;
  // if (calc === 0) return `Today      ${hour}:${minute}:${secs}`;
  // if (calc === 1) return `${calc + 1} Day ago      ${hour}:${minute}:${secs}`;
  // if (calc > 1 && calc <= 7)
  //   return `${calc + 1} Days ago      ${hour}:${minute}:${secs}`;
  // else return `${date}/${month}/${year}      ${hour}:${minute}:${secs}`;
  return new Intl.DateTimeFormat("en-UK", {
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  }).format(dateObj);
};
const createDateAndTime2 = (timeStamp) => {
  const dateObj = new Date(timeStamp);
  // const date = `${dateObj.getDate()}`.padStart(2, 0);
  // const month = `${dateObj.getMonth()}`.padStart(2, 0);
  // const year = `${dateObj.getFullYear()}`.slice(2).padStart(2, 0);
  // const minute = `${dateObj.getMinutes()}`.padStart(2, 0);
  // const hour = `${dateObj.getHours()}`.padStart(2, 0);
  // const secs = `${dateObj.getSeconds()}`.padStart(2, 0);
  // return `${date}/${month}/${year}      ${hour}:${minute}:${secs}`;
  return new Intl.DateTimeFormat("en-UK", {
    hour: "numeric",
    minute: "numeric",
    weekday: "long",
    month: "long",
    year: "numeric",
    day: "numeric",
    second: "numeric",
  }).format(dateObj);
};

const accounts = [account1, account2, account3];
const addTransactions = (acc) => {
  ul.innerHTML = "";
  const transactions = sorted
    ? acc.transactions.slice().sort((a, b) => a.amount - b.amount)
    : acc.transactions;
  transactions.forEach((ele) => {
    const html = `<li>
                <span class="transaction-type ${
                  ele.amount > 0 ? "deposit" : "withdrawal"
                }">${ele.amount > 0 ? "Deposit" : "Withdrawal"}</span>
                <span class="transaction-amount">${ele.amount}</span>
                <span class="transaction-date">${createDateAndTime(
                  ele.date
                )}</span>
              </li>`;
    ul.insertAdjacentHTML("afterbegin", html);
  });
};

const createUsernames = (accnts) => {
  accnts.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((ele) => ele[0])
        .join(""))
  );
};

const calcBalance = (acc) => {
  acc.balance = acc.transactions.reduce((acc, curr) => acc + curr.amount, 0);
  balance.textContent = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "INR",
  }).format(acc.balance);
};

const calcIn = (acc) => {
  acc.totalDeposits = acc.transactions
    .filter((ele) => ele.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);
  totalDeposits.textContent = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "INR",
  }).format(acc.totalDeposits);
};
const calcOut = (acc) => {
  acc.totalWithdrawals = acc.transactions
    .filter((ele) => ele.amount < 0)
    .reduce((acc, curr) => acc + curr.amount, 0);
  totalWithdrawals.textContent = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "INR",
  }).format(Math.abs(acc.totalWithdrawals));
};
const calcInterest = (acc) => {
  acc.totalInterests = acc.transactions
    .filter((ele) => ele.amount > 0)
    .map((ele) => ele.amount * (acc.interestRate / 100))
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);
  totalInterests.textContent = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "INR",
  }).format(acc.totalInterests);
};

createUsernames(accounts);
let newInterval = null;

const clearTime = () => {
  clearInterval(newInterval);
  timer.textContent = "You will be logged out in 05:00";
};
const timeInterval = () => {
  const timeArr = timer.textContent.split(" ").pop().split(":");

  let secs = 60;
  let minute = 5;

  newInterval = setInterval(() => {
    if (secs === 0) {
      minute--;
      secs = 60;
      timeArr[0] = String(minute).padStart(2, 0);
    }
    if (minute < 0) {
      clearTime();
      if (container.classList.contains("container-show"))
        container.classList.remove("container-show");

      heading.textContent = `Log in to account`;
      return;
    }
    secs--;
    timeArr[1] = String(secs).padStart(2, 0);
    timer.textContent = "You will be logged out in" + " " + timeArr.join(":");
  }, 1000);
};

let currentLoginIntervalSt = null;
const clearcurrentLoginInterval = () => {
  clearInterval(currentLoginIntervalSt);
};
const currentLoginInterval = () => {
  currentLoginIntervalSt = setInterval(() => {
    date.textContent = `As of ${createDateAndTime2(Date.now())}`;
  }, 1000);
};

const updateUI = (acc) => {
  date.textContent = `As of ${createDateAndTime2(Date.now())}`;
  if (currentLoginInterval) clearcurrentLoginInterval();
  currentLoginInterval();
  calcBalance(acc);
  calcIn(acc);
  calcOut(acc);
  calcInterest(acc);
  addTransactions(acc);
  if (newInterval !== null) clearTime();
  timeInterval();
};

const login = (e) => {
  e.preventDefault();
  let userValue = user.value;
  let pinValue = pin.value;
  currentAcc = accounts.find(
    (acc) => acc.pin === Number(pinValue) && acc.username === userValue
  );
  if (!currentAcc) return;
  updateUI(currentAcc);
  user.value = pin.value = "";
  user.blur();
  pin.blur();
  heading.textContent = `Welcome to bankist, ${currentAcc.owner}`;
  if (!container.classList.contains("container-show"))
    container.classList.add("container-show");
};
const transfer = (e) => {
  e.preventDefault();
  const transferAcc = accounts.find((acc) => acc.username === transferTo.value);
  if (
    !transferAcc ||
    transferTo.value === currentAcc.username ||
    Number(transferAmount.value) >= currentAcc.balance ||
    +transferAmount.value < 0
  )
    return;
  transferAcc.transactions.push({
    amount: +Number(transferAmount.value).toFixed(2),
    date: Date.now(),
  });
  currentAcc.transactions.push({
    amount: +Number(`-${transferAmount.value}`).toFixed(2),
    date: Date.now(),
  });
  transferAmount.value = transferTo.value = "";
  transferTo.blur();
  transferAmount.blur();
  updateUI(currentAcc);
};

const closeAcc = (e) => {
  e.preventDefault();
  const closeAccIdx = accounts.findIndex(
    (acc) =>
      acc.username === closeUser.value && acc.pin === Number(closePin.value)
  );
  closeUser.value = closePin.value = "";
  closeUser.blur();
  closePin.blur();
  if (
    !accounts[closeAccIdx] ||
    accounts[closeAccIdx].username !== currentAcc.username
  )
    return;
  accounts.splice(closeAccIdx, 1);
  if (container.classList.contains("container-show"))
    container.classList.remove("container-show");

  heading.textContent = `Log in to account`;
};

const loan = (e) => {
  e.preventDefault();
  if (
    currentAcc.transactions
      .filter((ele) => ele.amount > 0)
      .some((ele) => Number(loanAmount.value) * 0.1 <= ele.amount) &&
    +loanAmount.value > 0
  ) {
    setTimeout(() => {
      currentAcc.transactions.push({
        amount: +Number(loanAmount.value).toFixed(2),
        date: Date.now(),
      });
      loanAmount.value = "";
      loanAmount.blur();
      updateUI(currentAcc);
    }, 2500);
  }
};
const sort = (e) => {
  sorted = !sorted;
  updateUI(currentAcc);
};

sortBtn.addEventListener("click", sort);
sb.addEventListener("click", login);
transferBtn.addEventListener("click", transfer);
closeBtn.addEventListener("click", closeAcc);
loanBtn.addEventListener("click", loan);
