// global variables
let employeesArray = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US`;
const mainGridContainer = document.querySelector(".gallery-grid");
const overlay = document.querySelector(".overlay");
const modalDialogContainer = document.querySelector(".modal-dialog-container");
const closeModal = document.querySelector(".modal-close");

// fetch data from API
fetchEmployees(urlAPI);
 

async function getJSON(URL) {
  try {
    const response = await fetch(URL);
    return await response.json();
  }
  catch(error) {
    throw error;
  }
}

async function fetchEmployees(url) {
  const employeeJSON = await getJSON(url);
  const employeeProfiles = [employeeJSON].map( async employee => {
  return fetch(urlAPI)
          .then(response => response.json())
          .then(response => response.results)
          .then(displayEmployees)
          .catch(error => console.log(error))
  });
  return Promise.all(employeeProfiles);
}

// generate the markup for each employee profile
function displayEmployees(employeeData) {
  employeesArray = employeeData;
  employeesArray.map( (employee, index) => {
    let { picture, name, email, location } = employee;
    let fullName = `${name.first} ${name.last}`;
    let employeeCard = document.createElement("div");

    employeeCard.innerHTML = `
    <div class="employee-card" data-index="${index}">
      <img class="avatar" src="${picture.large}" alt="image of ${fullName}">
      <div class="employee-info-container">
        <h2 class="employee-name">${fullName}</h2>
        <p class="employee-email">${email}</p>
        <p class="employee-address">${location.state}​</p>
      </div>
    </div>
  `;
    mainGridContainer.appendChild(employeeCard);
  });
}


// generate the modal dialog

function displayModal(index) {
  // use object destructuring to make template literal cleaner
  let { name,
        dob,
        phone,
        email,
        location: {
                    city,
                    street,
                    state,
                    postcode
                  },
        picture
      } = employeesArray[index]; 
  
  let fullEmployeeName = `${name.first} ${name.last}`;
  let date = new Date(dob.date); // dob is date of birth

  const modalContentHTML = `
    <div class="modal-content center-content">
      <img class="avatar center-content" src="${picture.large}" />
      <h2 class="employee-name">${fullEmployeeName}</h2>
      <p class="employee-email">${email}</p>
      <p class="employee-address">${city}</p>
      <hr class="grey-line"/>
      <p>${phone}</p>
      <p class="employee-address">${street.number} ${street.name}, ${state} ${postcode}</p>
      <p>Birthday:
      ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
`;
overlay.classList.remove("hidden");
modalDialogContainer.innerHTML = modalContentHTML;
}


mainGridContainer.addEventListener('click', e => {
  if (e.target !== mainGridContainer) {
  // select the card element based on its proximity to actual element
    const card = e.target.closest(".employee-card");
    const index = card.getAttribute('data-index');
    displayModal(index);
  }
});

closeModal.addEventListener('click', () => {
  overlay.classList.add("hidden");
});