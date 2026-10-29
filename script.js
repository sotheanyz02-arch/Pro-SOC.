
const events = [
  {
    id: "blackpink",
    name: "Black Pink Night Performance",
    category: "COMING SOON",
    description: "Join the BLACKPINK concert for an unforgettable night filled with exciting songs, powerful dancing, colorful lights, and amazing memories with your favorite idols.",
    price: 489,
    image: "images/blackpink.jpg"
  },
  {
    id: "tfconcert",
    name: "Live TF Family Concert",
    category: "LIVE CONCERT",
    description: "The TF Family Concert is an exciting event where fans can enjoy wonderful music, energetic performances, and unforgettable moments with their favorite young artists.",
    price: 188,
    image: "images/TF.jpg"
  },
  {
    id: "theweekend",
    name: "The Weekend Concert",
    category: "COMING SOON",
    description: "The Weekend Concert is an exciting live music event where fans can enjoy great songs, amazing performances, and an unforgettable night with friends.",
    price: 578,
    image: "images/the-weekend.jpg"
  },
  {
    id: "football",
    name: "Football Championship",
    category: "SPORTS",
    description: "Feel the excitement of a live football match.",
    price: 250,
    image: "images/football.jpg"
  },
  {
    id: "tech",
    name: "Future Tech Expo",
    category: "TECHNOLOGY",
    description: "Discover innovation, AI, and future technology.",
    price: 10,
    image: "images/Technology.jpg"
  },
  {
    id: "food",
    name: "Street Food Festival",
    category: "FOOD FESTIVAL",
    description: "Explore delicious food and exciting new flavors.",
    price: 8,
    image: "photo-1555939594-58d7cb561ad1"
  },
  {
    id: "culture",
    name: "Cultural Celebration",
    category: "CULTURE",
    description: "Celebrate art, traditions, and cultural performances.",
    price: 10,
    image: "photo-1503095396549-807759245b35"
  },
  {
    id: "esports",
    name: "Esports Gaming Arena",
    category: "GAMING",
    description: "Experience competitive gaming and esports excitement.",
    price: 15,
    image: "photo-1542751371-adc38448a05e"
  },
  {
    id: "basketball",
    name: "Basketball Game",
    category: "SPORTS",
    description: "Enjoy an exciting basketball game filled with amazing shots, teamwork, and thrilling competition!",
    price: 150,
    image: "images/basketball.jpg"
  },
  {
    id: "Billie Eilish",
    name: "Billie Eilish Concert",
    category: "COMING SOON",
    description: "Enjoy an unforgettable night at the Billie Eilish Concert with amazing music, beautiful visuals, and her unique live performances!",
    price: 568,
    image: "images/billi.jpg"
  },
  {
    id: "racing",
    name: "Racing Car",
    category: "PLAY",
    description: "Experience the thrill of high-speed racing, powerful cars, and exciting competition at the Racing Car event!",
    price: 7,
    image: "images/racing.jpg"
  },
  {
    id: "bowling",
    name: "Bowling",
    category: "PLAY",
    description: "Have fun with friends and family at the Bowling event!",
    price: 5,
    image: "images/bowling.jpg"
  },
];

const money = amount => "$" + amount.toFixed(2);

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

// Display all eight events.
const eventGrid = document.getElementById("eventGrid");

if (eventGrid) {
  eventGrid.innerHTML = events.map(event => `
    <article class="event-card">
      <div class="event-image">
        <img
          src="${event.image.startsWith("photo-")
            ? `https://images.unsplash.com/${event.image}?auto=format&fit=crop&w=700&q=80`
            : event.image}"
          alt="${event.name}"
          loading="lazy">
        <span class="event-category">${event.category}</span>
      </div>

      <div class="event-info">
        <h3>${event.name}</h3>
        <p>${event.description}</p>

        <div class="event-bottom">
          <span class="event-price">
            ${money(event.price)}
            <small>per ticket</small>
          </span>
          <a class="book-link" href="booking.html?event=${event.id}">
            Book Now ↗
          </a>
        </div>
      </div>
    </article>
  `).join("");
}

// Show account status in the navbar.
const accountLink = document.getElementById("accountLink");
const userGreeting = document.getElementById("userGreeting");
const user = readStorage("eventoraUser");

if (accountLink && user) {
  accountLink.textContent = "Registered ✓";
  accountLink.href = "#events";
}

if (userGreeting && user) {
  userGreeting.textContent = `Hello, ${user.name}`;
}

// Registration.
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;
    const message = document.getElementById("registerMessage");

    if (!name || !email || !phone || password.length < 6) {
      message.textContent = "Please complete all fields correctly.";
      return;
    }

    // Demo registration: never save the password.
    try {
      localStorage.setItem("eventoraUser", JSON.stringify({
        name: name,
        email: email,
        phone: phone
      }));

      window.location.href = "index.html";
    } catch {
      message.textContent =
        "Registration could not be saved in this browser.";
    }
  });
}

// Booking page.
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  const currentUser = readStorage("eventoraUser");

  // Registration is required before booking.
  if (!currentUser) {
    window.location.replace("register.html");
  } else {
    const nameInput = document.getElementById("bookingName");
    const emailInput = document.getElementById("bookingEmail");
    const phoneInput = document.getElementById("bookingPhone");
    const eventSelect = document.getElementById("selectedEvent");
    const ticketType = document.getElementById("ticketType");
    const quantityInput = document.getElementById("ticketQuantity");
    const unitPrice = document.getElementById("unitPrice");
    const totalPrice = document.getElementById("totalPrice");
    const message = document.getElementById("bookingMessage");

    nameInput.value = currentUser.name;
    emailInput.value = currentUser.email;
    phoneInput.value = currentUser.phone;

    eventSelect.innerHTML = events.map(event => `
      <option value="${event.id}">
        ${event.name} — ${money(event.price)}
      </option>
    `).join("");

    const requestedEvent =
      new URLSearchParams(window.location.search).get("event");

    if (events.some(event => event.id === requestedEvent)) {
      eventSelect.value = requestedEvent;
    }

    function calculateTotal() {
      const selected =
        events.find(event => event.id === eventSelect.value);

      if (!selected) return;

      const quantity = Math.min(
        10,
        Math.max(1, Number(quantityInput.value) || 1)
      );

      const price = selected.price *
        (ticketType.value === "VIP" ? 1.8 : 1);

      unitPrice.textContent = money(price);
      totalPrice.textContent = money(price * quantity);
    }

    eventSelect.addEventListener("change", calculateTotal);
    ticketType.addEventListener("change", calculateTotal);
    quantityInput.addEventListener("input", calculateTotal);

    calculateTotal();

    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const quantity = Number(quantityInput.value);
      const selected =
        events.find(item => item.id === eventSelect.value);

      if (
        !nameInput.value.trim() ||
        !emailInput.validity.valid ||
        !phoneInput.value.trim() ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10 ||
        !selected
      ) {
        message.textContent =
          "Please check your information and ticket quantity.";
        return;
      }

      const price = selected.price *
        (ticketType.value === "VIP" ? 1.8 : 1);

      const booking = {
        reference: "EVT-" + Date.now().toString().slice(-8),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        event: selected.name,
        ticketType: ticketType.value,
        quantity: quantity,
        specialRequest:
          document.getElementById("specialRequest").value.trim(),
        price: price,
        total: price * quantity
      };

      try {
        localStorage.setItem("eventoraBooking", JSON.stringify(booking));
        window.location.href = "confirmation.html";
      } catch {
        message.textContent =
          "Unable to save the booking in this browser.";
      }
    });
  }
}

// Confirmation page.
const confirmationDetails =
  document.getElementById("confirmationDetails");

if (confirmationDetails) {
  const booking = readStorage("eventoraBooking");

  if (!booking) {
    confirmationDetails.textContent =
      "No booking found. Please select an event first.";
  } else {
    const details = [
      ["Booking Reference", booking.reference],
      ["Full Name", booking.name],
      ["Email", booking.email],
      ["Phone", booking.phone],
      ["Event", booking.event],
      ["Ticket Type", booking.ticketType],
      ["Number of Tickets", String(booking.quantity)],
      ["Price per Ticket", money(booking.price)],
      ["Total Price", money(booking.total)],
      ["Special Request", booking.specialRequest || "None"]
    ];

    details.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "detail-row";

      const labelElement = document.createElement("span");
      labelElement.textContent = label;

      const valueElement = document.createElement("strong");
      valueElement.textContent = value;

      row.append(labelElement, valueElement);
      confirmationDetails.appendChild(row);
    });
  }
}
