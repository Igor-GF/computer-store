
// VARIABLES
let bankBalance = 0;
let loan = 0;
let pay = 0;
let laptopsData;
let image = "assets/images/default.jpg";
let model;
let description;
let price = 0;
let warnMessage;
let specs = "";

// QUERIES
const balanceElement = document.querySelector(".balance");
const loanBlockElement = document.querySelector(".loan-hidden");
const loanElement = document.querySelector(".loan");
const payElement = document.querySelector(".pay");
const getLoanBtn = document.querySelector(".btn-get-loan");
const bankBtn = document.querySelector(".btn-bank");
const workBtn = document.querySelector(".btn-work");
const repayBtn = document.querySelector(".btn-repay-hidden");
const dropdownPlaceholder = document.querySelector(".dropdown-placeholder");
const laptopList = document.querySelector(".hidden-list");
const buyBtn = document.querySelector(".btn-buy");
let warnElement = document.querySelector(".label-warn");
let modelElement = document.querySelector(".label-model");
let descriptionElement = document.querySelector(".label-description");
let priceElement = document.querySelector(".label-price");
let imageElement = document.querySelector(".image");
let specificsElement = document.querySelector(".specifics");

//FETCH API
fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
.then((result) => {
  return result.json();
})
.then((jsonData) => {
  laptopsData = jsonData;
  createDropdownElements(jsonData);
})
.catch((err) => {
  console.log(err);
})


// FUNCTIONS
function toWork() {
  pay += 100;
  updateDisplay();
}

function bankTransfer() {
  if(loan > 0) {
    let tenPercent = pay * 0.1;

    if(tenPercent >= loan) {
      toggleLoanRepay();
      bankBalance += pay - loan;
      loan = 0;
    } else {
      // when transfering loan substracts 10% of pay
      loan -= tenPercent; 
      // bank balance receive pay leftovers
      bankBalance += pay - tenPercent;
    }
    
  } else {
    bankBalance += pay;
  }

  pay = 0;
  updateDisplay();
}

function getALoan() {
  let maxAmount = bankBalance * 2;

  if(loan <= 0) {
    let input = parseInt(window.prompt('How much do you want to get?'));

    if(input <= maxAmount) {
      toggleLoanRepay();
      bankBalance += input;
      loan = input;
      updateDisplay();

    } else {
      alert("You can only get up to " + maxAmount);
    }

  } else {
    alert("You already have a loan.")
  }

  updateDisplay();
}

function toRepay() {
  if(pay >= loan) {
    pay -= loan;
    loan = 0;
    toggleLoanRepay();
  } else {
    loan -= pay;
    pay = 0;
  }

  updateDisplay();
}

function toggleLoanRepay() {
  repayBtn.classList.toggle("btn-repay-visible");
  loanBlockElement.classList.toggle("loan-visible");
}

function toggleDropdown() {
  laptopList.classList.toggle("visible-list");
}

function setLaptopBox(laptop) {
  model = laptop.title;
  description = laptop.description;
  price = laptop.price;
  image = "https://noroff-komputer-store-api.herokuapp.com/" + laptop.image;

  displaySpecifications(laptop.specs);

  toggleDropdown();
  updateDisplay();
}

function displaySpecifications(info) {
  specs = "";

  info.map((specification) => {
    specs += specification + " | ";
  })
}

function createDropdownElements(jsonData) {
  jsonData.map((laptop) => {
    let liElement = document.createElement("li");
    liElement.setAttribute("class", "list-item");
    liElement.onclick = () => setLaptopBox(laptop);
    liElement.innerHTML = laptop.title;
    laptopList.append(liElement);
  });
}

function toBuy() {
  if(bankBalance >= price) {
    bankBalance -= price;
    warnElement.textContent = "You are the owner of this laptop";
  } else {
    warnElement.textContent = "You CANNOT afford this laptop";
  }

  updateDisplay();
}

function updateDisplay() {
  balanceElement.textContent = "??? " + bankBalance;
  loanElement.textContent = "??? " + loan;
  payElement.textContent = "??? " + pay;
  modelElement.textContent = model;
  descriptionElement.textContent = description;
  priceElement.textContent = "???" + price;
  imageElement.src = image;
  specificsElement.textContent = specs;
}

// EVENT LISTENERS
getLoanBtn.addEventListener("click", e => {
  getALoan();
});

bankBtn.addEventListener("click", e => {
  bankTransfer();
});

workBtn.addEventListener("click", e => {
  toWork();
});

dropdownPlaceholder.addEventListener("click", e => {
  warnElement.textContent = "";
  toggleDropdown();
});

buyBtn.addEventListener("click", e => {
  toBuy();
});

repayBtn.addEventListener("click", e => {
  toRepay();
});
