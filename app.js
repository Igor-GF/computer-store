
// VARIABLES
let bankBalance = 0;
let loan = 0;
let pay = 0;
let laptopsData;
let image;
let model;
let description;
let price = 0;
let warnMessage;

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
  getLaptop(2);
  updateDisplay();
}

function bankTransfer() {
  if(loan > 0) {
    let tenPercent = pay * 0.1;

    if(tenPercent >= loan) {
      toggleLoanRepay();
      bankBalance += tenPercent - loan;
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

  console.log("pay: " + pay);
  console.log("bankBalance: " + bankBalance);
  console.log("loan: " + loan);
}

function getALoan(amount) {
  let maxAmount = bankBalance * 2;

  if(amount <= maxAmount && loan == 0) {
    toggleLoanRepay();
    bankBalance += amount;
    loan = amount;
    updateDisplay();

  } else {
    
    alert("You can only get up to " + maxAmount);
  }

  updateDisplay();
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

function createDropdownElements(jsonData) {
  jsonData.map((pc) => {
    let liElement = document.createElement("li");
    liElement.setAttribute("class", "list-item");
    liElement.setAttribute("id", pc.id);
    liElement.innerHTML = pc.title;
    laptopList.append(liElement);
  });
}

function getLaptop(laptopId) {
  let laptop = laptopsData.find(item => {
    return item.id == laptopId;
  })
  return setLaptopBox(laptop);
}

function setLaptopBox(laptop) {
  model = laptop.title;
  description = laptop.description;
  price = laptop.price;
  image = laptop.image;
}

function updateDisplay() {
  balanceElement.textContent = "€ " + bankBalance;
  loanElement.textContent = "€ " + loan;
  payElement.textContent = "€ " + pay;
  modelElement.textContent = model;
  descriptionElement.textContent = description;
  priceElement.textContent = "€" + price;
  image ? imageElement.src = image : imageElement.src = "./assets/images/default.jpg";
}

// EVENT LISTENERS
getLoanBtn.addEventListener("click", e => {
  let input = window.prompt('How much do you want to get?');
  getALoan(parseInt(input));
});

bankBtn.addEventListener("click", e => {
  bankTransfer();
});

workBtn.addEventListener("click", e => {
  toWork();
});

dropdownPlaceholder.addEventListener("click", e => {
  laptopList.classList.toggle("visible-list");
});

buyBtn.addEventListener("click", e => {
  toBuy();
});

repayBtn.addEventListener("click", e => {
  toRepay();
});

// laptopList.addEventListener("click", e => {
  
// });