// TRIP PLANNER, BUDGET ALLOCATOR & PACKER CONTROLLER

// ==========================================
// 1. BUDGET ALLOCATOR LOGIC
// ==========================================
let budget = {
  flights: 800,
  stay: 1200,
  dining: 500,
  activities: 600
};

export function initBudgetCalculator() {
  const inputFlights = document.getElementById("inputFlights");
  const inputStay = document.getElementById("inputStay");
  const inputDining = document.getElementById("inputDining");
  const inputActivities = document.getElementById("inputActivities");

  const valFlights = document.getElementById("valFlights");
  const valStay = document.getElementById("valStay");
  const valDining = document.getElementById("valDining");
  const valActivities = document.getElementById("valActivities");

  if (!inputFlights) return;

  // Load saved budget if exists
  const savedBudget = localStorage.getItem("voyage_budget");
  if (savedBudget) {
    try {
      budget = JSON.parse(savedBudget);
      inputFlights.value = budget.flights;
      inputStay.value = budget.stay;
      inputDining.value = budget.dining;
      inputActivities.value = budget.activities;
    } catch (e) {
      console.error("Error loading budget", e);
    }
  }

  const updateSlidersAndChart = () => {
    budget.flights = parseInt(inputFlights.value) || 0;
    budget.stay = parseInt(inputStay.value) || 0;
    budget.dining = parseInt(inputDining.value) || 0;
    budget.activities = parseInt(inputActivities.value) || 0;

    // Save to localStorage
    localStorage.setItem("voyage_budget", JSON.stringify(budget));

    // Update value displays
    valFlights.textContent = `$${budget.flights}`;
    valStay.textContent = `$${budget.stay}`;
    valDining.textContent = `$${budget.dining}`;
    valActivities.textContent = `$${budget.activities}`;

    renderBudgetChart();
  };

  // Add event listeners
  [inputFlights, inputStay, inputDining, inputActivities].forEach(slider => {
    slider.addEventListener("input", updateSlidersAndChart);
  });

  // Initial Draw
  updateSlidersAndChart();
}

export function setBudgetValues(flightsVal, stayVal, diningVal, activitiesVal) {
  const inputFlights = document.getElementById("inputFlights");
  const inputStay = document.getElementById("inputStay");
  const inputDining = document.getElementById("inputDining");
  const inputActivities = document.getElementById("inputActivities");

  if (inputFlights) inputFlights.value = flightsVal;
  if (inputStay) inputStay.value = stayVal;
  if (inputDining) inputDining.value = diningVal;
  if (inputActivities) inputActivities.value = activitiesVal;

  budget = { flights: flightsVal, stay: stayVal, dining: diningVal, activities: activitiesVal };
  localStorage.setItem("voyage_budget", JSON.stringify(budget));
  
  // Trigger UI Update
  const valFlights = document.getElementById("valFlights");
  if (valFlights) valFlights.textContent = `$${flightsVal}`;
  const valStay = document.getElementById("valStay");
  if (valStay) valStay.textContent = `$${stayVal}`;
  const valDining = document.getElementById("valDining");
  if (valDining) valDining.textContent = `$${diningVal}`;
  const valActivities = document.getElementById("valActivities");
  if (valActivities) valActivities.textContent = `$${activitiesVal}`;

  renderBudgetChart();
}

function renderBudgetChart() {
  const total = budget.flights + budget.stay + budget.dining + budget.activities;
  const totalDisplay = document.getElementById("budgetTotalDisplay");
  
  if (totalDisplay) {
    totalDisplay.textContent = `$${total.toLocaleString()}`;
  }

  const circFlights = document.querySelector(".circle-flights");
  const circStay = document.querySelector(".circle-stay");
  const circDining = document.querySelector(".circle-dining");
  const circActivities = document.querySelector(".circle-activities");

  if (!circFlights) return;

  if (total === 0) {
    [circFlights, circStay, circDining, circActivities].forEach(c => {
      c.style.strokeDasharray = "0 100";
      c.style.strokeDashoffset = "0";
    });
    return;
  }

  const pFlights = (budget.flights / total) * 100;
  const pStay = (budget.stay / total) * 100;
  const pDining = (budget.dining / total) * 100;
  const pActivities = (budget.activities / total) * 100;

  // Set dash array and cumulative offset
  circFlights.style.strokeDasharray = `${pFights} 100`;
  circFlights.style.strokeDashoffset = "0";

  circStay.style.strokeDasharray = `${pStay} 100`;
  circStay.style.strokeDashoffset = `-${pFights}`;

  circDining.style.strokeDasharray = `${pDining} 100`;
  circDining.style.strokeDashoffset = `-${pFights + pStay}`;

  circActivities.style.strokeDasharray = `${pActivities} 100`;
  circActivities.style.strokeDashoffset = `-${pFights + pStay + pDining}`;
}


// ==========================================
// 2. ITINERARY TIMELINE LOGIC
// ==========================================
let itinerary = [
  { id: "1", day: "1", time: "09:00 AM", activity: "Check-in at Hotel & Refresh", location: "Grand Plaza Resort" },
  { id: "2", day: "1", time: "02:00 PM", activity: "Historic Walking Tour", location: "City Center & Old Quarter" },
  { id: "3", day: "1", time: "07:30 PM", activity: "Traditional Dinner Experience", location: "Local Tavern & Bistro" },
  { id: "4", day: "2", time: "10:00 AM", activity: "Guided Museum Excursion", location: "National Heritage Museum" }
];

export function initItineraryTimeline() {
  const timelineForm = document.getElementById("timelineForm");
  const daySelector = document.getElementById("itineraryDaySelector");
  const timelineList = document.getElementById("timelineList");

  if (!timelineForm) return;

  // Load saved itinerary
  const savedItinerary = localStorage.getItem("voyage_itinerary");
  if (savedItinerary) {
    try {
      itinerary = JSON.parse(savedItinerary);
    } catch (e) {
      console.error("Error loading itinerary", e);
    }
  }

  const renderTimeline = () => {
    const selectedDay = daySelector.value;
    timelineList.innerHTML = "";

    const dayItems = itinerary
      .filter(item => item.day === selectedDay)
      // Basic sort by time string (optional, keeps entries chronological if entered properly)
      .sort((a, b) => a.time.localeCompare(b.time));

    if (dayItems.length === 0) {
      timelineList.innerHTML = `
        <div class="empty-timeline">
          <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <h4>No activities scheduled for Day ${selectedDay}</h4>
          <p>Add some plans above to start constructing your trip itinerary.</p>
        </div>
      `;
      return;
    }

    dayItems.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.className = "timeline-item";
      itemEl.innerHTML = `
        <div class="timeline-item-header">
          <span class="timeline-time">${item.time}</span>
          <button class="timeline-delete-btn" data-id="${item.id}" title="Remove activity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
        <div class="timeline-title">${item.activity}</div>
        ${item.location ? `
        <div class="timeline-location">
          <svg class="icon-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${item.location}</span>
        </div>` : ''}
      `;
      timelineList.appendChild(itemEl);
    });

    // Setup delete buttons
    timelineList.querySelectorAll(".timeline-delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-id");
        itinerary = itinerary.filter(item => item.id !== id);
        localStorage.setItem("voyage_itinerary", JSON.stringify(itinerary));
        renderTimeline();
      });
    });
  };

  // Day filter changes
  daySelector.addEventListener("change", renderTimeline);

  // Form submit handler
  timelineForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const timeInput = document.getElementById("timeInput");
    const activityInput = document.getElementById("activityInput");
    const locationInput = document.getElementById("locationInput");

    const newItem = {
      id: Date.now().toString(),
      day: daySelector.value,
      time: timeInput.value,
      activity: activityInput.value,
      location: locationInput.value || ""
    };

    itinerary.push(newItem);
    localStorage.setItem("voyage_itinerary", JSON.stringify(itinerary));

    // Clear inputs
    timeInput.value = "";
    activityInput.value = "";
    locationInput.value = "";

    renderTimeline();
  });

  // Initial rendering
  renderTimeline();
}

export function importTimelineHighlights(highlights, destinationName) {
  // Clear existing default/loaded itinerary and inject new itinerary highlights for Day 1
  itinerary = itinerary.filter(item => item.day !== "1"); // Clear day 1

  const times = ["09:00 AM", "01:00 PM", "04:30 PM", "08:00 PM"];
  
  highlights.forEach((h, index) => {
    const time = times[index] || "12:00 PM";
    itinerary.push({
      id: `imported-${Date.now()}-${index}`,
      day: "1",
      time: time,
      activity: h.substring(0, 50),
      location: destinationName
    });
  });

  localStorage.setItem("voyage_itinerary", JSON.stringify(itinerary));
  
  // Update UI if itinerary is ready
  const selector = document.getElementById("itineraryDaySelector");
  if (selector) {
    selector.value = "1";
    // Trigger render by dispatching event or direct call
    const timelineList = document.getElementById("timelineList");
    if (timelineList) {
      // Re-trigger timeline initialization to update UI
      initItineraryTimeline();
    }
  }
}


// ==========================================
// 3. SMART PACKING ASSISTANT
// ==========================================
const defaultPackingList = {
  documents: [
    { text: "Passport & Visas", checked: true },
    { text: "Flight Tickets & E-reserves", checked: false },
    { text: "Hotel Booking Invoices", checked: false },
    { text: "Travel Insurance Card", checked: false }
  ],
  clothing: [
    { text: "Lightweight T-shirts", checked: false },
    { text: "Comfy Hiking Shoes", checked: false },
    { text: "Undergarments & Socks", checked: true },
    { text: "Waterproof Rain Jacket", checked: false }
  ],
  toiletries: [
    { text: "Toothbrush & Paste", checked: true },
    { text: "Sunscreen SPF 50+", checked: false },
    { text: "Hand Sanitizer & Wipes", checked: false },
    { text: "First-aid Medication", checked: false }
  ],
  gear: [
    { text: "Phone, Camera & Chargers", checked: false },
    { text: "Universal Wall Adapter", checked: false },
    { text: "Powerbank (10,000mAh)", checked: true }
  ]
};

let packingList = {};

export function initPackingAssistant() {
  const savedList = localStorage.getItem("voyage_packing");
  if (savedList) {
    try {
      packingList = JSON.parse(savedList);
    } catch (e) {
      packingList = { ...defaultPackingList };
    }
  } else {
    packingList = { ...defaultPackingList };
  }

  // Draw checklists
  renderAllPackingColumns();

  // Bind add triggers
  const forms = document.querySelectorAll(".add-item-form");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const cat = form.getAttribute("data-category");
      const input = form.querySelector("input");
      const text = input.value.trim();

      if (text) {
        packingList[cat].push({ text, checked: false });
        localStorage.setItem("voyage_packing", JSON.stringify(packingList));
        input.value = "";
        renderPackingColumn(cat);
        updateOverallProgress();
      }
    });
  });
}

function renderPackingColumn(category) {
  const listContainer = document.getElementById(`list-${category}`);
  const countDisplay = document.getElementById(`count-${category}`);
  
  if (!listContainer) return;
  
  listContainer.innerHTML = "";
  const items = packingList[category] || [];
  
  countDisplay.textContent = items.length;

  items.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.className = "checklist-item";
    
    const uniqueId = `pack-${category}-${index}`;
    
    itemEl.innerHTML = `
      <label class="checklist-label" for="${uniqueId}">
        <input type="checkbox" id="${uniqueId}" class="checklist-checkbox" ${item.checked ? "checked" : ""}>
        <span class="checklist-text">${item.text}</span>
      </label>
      <button class="checklist-remove" data-category="${category}" data-index="${index}">&times;</button>
    `;

    // Toggle event listener
    const checkbox = itemEl.querySelector(".checklist-checkbox");
    checkbox.addEventListener("change", () => {
      packingList[category][index].checked = checkbox.checked;
      localStorage.setItem("voyage_packing", JSON.stringify(packingList));
      updateOverallProgress();
    });

    // Remove event listener
    const removeBtn = itemEl.querySelector(".checklist-remove");
    removeBtn.addEventListener("click", () => {
      packingList[category].splice(index, 1);
      localStorage.setItem("voyage_packing", JSON.stringify(packingList));
      renderPackingColumn(category);
      updateOverallProgress();
    });

    listContainer.appendChild(itemEl);
  });
}

function renderAllPackingColumns() {
  const categories = ["documents", "clothing", "toiletries", "gear"];
  categories.forEach(cat => renderPackingColumn(cat));
  updateOverallProgress();
}

function updateOverallProgress() {
  let totalItems = 0;
  let packedItems = 0;

  Object.values(packingList).forEach(list => {
    list.forEach(item => {
      totalItems++;
      if (item.checked) packedItems++;
    });
  });

  const percentDisplay = document.getElementById("packProgressPercent");
  const barFill = document.getElementById("packProgressBar");
  const ratioDisplay = document.getElementById("packProgressRatio");

  if (!percentDisplay) return;

  if (totalItems === 0) {
    percentDisplay.textContent = "0%";
    barFill.style.width = "0%";
    ratioDisplay.textContent = "0 / 0 items packed";
    return;
  }

  const percent = Math.round((packedItems / totalItems) * 100);
  percentDisplay.textContent = `${percent}%`;
  barFill.style.width = `${percent}%`;
  ratioDisplay.textContent = `${packedItems} / ${totalItems} items packed`;
}

export function importPackingList(customItemsList) {
  // merges items into packing list depending on keywords or adds items to relevant list
  customItemsList.forEach(itemText => {
    let cat = "gear"; // default
    const textLower = itemText.toLowerCase();
    
    if (textLower.includes("passport") || textLower.includes("ticket") || textLower.includes("card") || textLower.includes("license") || textLower.includes("booking")) {
      cat = "documents";
    } else if (textLower.includes("shirt") || textLower.includes("shoes") || textLower.includes("pants") || textLower.includes("jacket") || textLower.includes("socks") || textLower.includes("dress")) {
      cat = "clothing";
    } else if (textLower.includes("toothbrush") || textLower.includes("shampoo") || textLower.includes("sunscreen") || textLower.includes("cream") || textLower.includes("med")) {
      cat = "toiletries";
    }

    packingList[cat].push({ text: itemText, checked: false });
  });

  localStorage.setItem("voyage_packing", JSON.stringify(packingList));
  renderAllPackingColumns();
}
