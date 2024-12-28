'use strict';

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const menuToggleBtn = document.querySelector("[data-menu-toggle-btn]");

menuToggleBtn.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    menuToggleBtn.classList.toggle("active");
  });
}

/**
 * header sticky & back to top
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * search box toggle
 */
const searchBtn = document.querySelector("[data-search-btn]");
const searchContainer = document.querySelector("[data-search-container]");
const searchSubmitBtn = document.querySelector("[data-search-submit-btn]");
const searchCloseBtn = document.querySelector("[data-search-close-btn]");

const searchBoxElems = [searchBtn, searchSubmitBtn, searchCloseBtn];

for (let i = 0; i < searchBoxElems.length; i++) {
  searchBoxElems[i].addEventListener("click", function () {
    searchContainer.classList.toggle("active");
    document.body.classList.toggle("active");
  });
}

/**
 * move cycle on scroll
 */
const deliveryBoy = document.querySelector("[data-delivery-boy]");

let deliveryBoyMove = -80;
let lastScrollPos = 0;

window.addEventListener("scroll", function () {
  let deliveryBoyTopPos = deliveryBoy.getBoundingClientRect().top;

  if (deliveryBoyTopPos < 500 && deliveryBoyTopPos > -250) {
    let activeScrollPos = window.scrollY;

    if (lastScrollPos < activeScrollPos) {
      deliveryBoyMove += 1;
    } else {
      deliveryBoyMove -= 1;
    }

    lastScrollPos = activeScrollPos;
    deliveryBoy.style.transform = `translateX(${deliveryBoyMove}px)`;
  }
});

/**
 * Fetch dish pairings
 */
document.getElementById('dishSelect').addEventListener('change', function () {
  const dishName = this.value;
  fetchPairings(dishName);
});

function fetchPairings(dishName) {
  if (!dishName) {
    return; // Exit if no dish is selected
  }

  const encodedDishName = encodeURIComponent(dishName); // To handle special characters
  const suggestionsList = document.getElementById('suggestionsList');
  suggestionsList.innerHTML = ''; // Clear previous suggestions

  // Show loading indicator
  const loadingLi = document.createElement('li');
  loadingLi.textContent = 'Loading pairings...';
  suggestionsList.appendChild(loadingLi);

  // Make the API call to fetch pairings
  fetch(`http://127.0.0.1:5000/api/pairings/${encodedDishName}`)
    .then(response => response.json())
    .then(data => {
      suggestionsList.innerHTML = ''; // Clear previous suggestions

      if (data.pairings && data.pairings.length > 0) {
        data.pairings.forEach(pairing => {
          const li = document.createElement('li');
          li.textContent = `${pairing.pairing_type}: ${pairing.pairing_name}`;
          suggestionsList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'No pairings found.';
        suggestionsList.appendChild(li);
      }
    })
    .catch(error => {
      console.error('Error fetching pairings:', error);
      suggestionsList.innerHTML = ''; // Clear previous suggestions
      const li = document.createElement('li');
      li.textContent = 'An error occurred while fetching pairings.';
      suggestionsList.appendChild(li);
    });
}

/**
 * Order Placement - Submit order data to backend
 */
function placeOrder(orderData) {
  fetch('http://127.0.0.1:5000/api/place_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData) // Send order data
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Order placed successfully', data);
      } else {
        console.log('Failed to place order', data.message);
      }
    })
    .catch(error => {
      console.error('Error placing order:', error);
    });
}

/**
 * Check Order Status - Fetch order status from backend
 */
function checkOrderStatus(orderId) {
  fetch(`http://127.0.0.1:5000/api/order_status/${orderId}`)
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        console.log('Order Status:', data.status);
      } else {
        console.log('Failed to fetch order status');
      }
    })
    .catch(error => {
      console.error('Error fetching order status:', error);
    });
}

/**
 * Reservation Booking - Book reservation via API
 */
function submitReservation() {
  // Get form data
  const reservationData = {
    customer_name: document.getElementById('full_name').value,
    reservation_time: document.getElementById('booking_date').value,
    num_people: document.getElementById('total_person').value,
    email_address: document.getElementById('email_address').value,  // Include email
    message: document.getElementById('message').value               // Include message
  };
  

  // Make sure all required fields are filled
  if (!reservationData.customer_name || !reservationData.reservation_time || !reservationData.num_people) {
    alert('Please fill all fields.');
    return;
  }

  // Send the reservation data via POST request to Flask
  fetch('http://127.0.0.1:5000/api/reservation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservationData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Reservation booked successfully!") {
        showReservationConfirmation();
      } else {
        showReservationError(data.message);
      }
    })
    .catch(error => {
      console.error('Error booking reservation:', error);
      showReservationError("An error occurred while booking the reservation.");
    });
}

/**
 * Reservation Success - Show Confirmation Message
 */
function showReservationConfirmation() {
  const confirmationMessage = document.getElementById("confirmationMessage");
  confirmationMessage.innerHTML = "<p>Your reservation has been booked successfully!</p>";
  confirmationMessage.style.display = "block";
  
  // Optionally reset the form
  document.getElementById("reservationForm").reset();
}

/**
 * Reservation Error - Show Error Message
 */
function showReservationError(errorMessage) {
  const confirmationMessage = document.getElementById("confirmationMessage");
  confirmationMessage.innerHTML = `<p>Failed to book reservation: ${errorMessage}</p>`;
  confirmationMessage.style.display = "block";
}
