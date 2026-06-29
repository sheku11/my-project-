// MAIN APPLICATION ROUTER & COORDINATOR
import { renderDestinations, destinations } from "./js/destinations.js";
import { initBudgetCalculator, initItineraryTimeline, initPackingAssistant, setBudgetValues, importTimelineHighlights } from "./js/planner.js";
import { initChatbot } from "./js/chatbot.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State Setup
  let activeFilter = "all";
  let searchVal = "";
// my name is kunal 
  // Initialize Sub-modules
  initBudgetCalculator();
  initItineraryTimeline();
  initPackingAssistant();
  initChatbot();

  // Render destinations grid
  renderDestinations("destinationsGrid", activeFilter, searchVal);

  // ==========================================
  // NAVIGATION & ROUTING
  // ==========================================
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const sections = document.querySelectorAll(".tab-content");

  const switchTab = (targetId) => {
    // Hide all tabs and deactivate all links
    sections.forEach(sec => sec.classList.remove("active"));
    navLinks.forEach(link => link.classList.remove("active"));
    mobileNavLinks.forEach(link => link.classList.remove("active"));

    // Activate the targeted tab and corresponding links
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Update active nav state
    document.querySelectorAll(`[data-target="${targetId}"]`).forEach(el => {
      el.classList.add("active");
    });

    // Window scroll reset
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bind desktop navigation links
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      switchTab(target);
    });
  });

  // Bind mobile navigation links
  mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      switchTab(target);
    });
  });

  // ==========================================
  // THEME SWITCHER
  // ==========================================
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const htmlElement = document.documentElement;

  // Load theme preference
  const savedTheme = localStorage.getItem("voyage_theme") || "dark";
  htmlElement.setAttribute("data-theme", savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("voyage_theme", newTheme);
  });

  // ==========================================
  // EXPLORE SEARCH & FILTERS
  // ==========================================
  const searchInput = document.getElementById("destSearchInput");
  const filterChips = document.querySelectorAll(".filter-chip");

  // Input listener
  searchInput.addEventListener("input", (e) => {
    searchVal = e.target.value;
    renderDestinations("destinationsGrid", activeFilter, searchVal);
    bindCardClicks(); // Re-bind click events since grid re-rendered
  });

  // Chip click listeners
  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      
      activeFilter = chip.getAttribute("data-filter");
      renderDestinations("destinationsGrid", activeFilter, searchVal);
      bindCardClicks(); // Re-bind card clicks
    });
  });

  // ==========================================
  // DETAILS MODAL LOGIC
  // ==========================================
  const modal = document.getElementById("destinationModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalBtnPlanTrip = document.getElementById("modalBtnPlanTrip");

  let activeModalDest = null;

  const openModal = (destId) => {
    const dest = destinations.find(d => d.id === destId);
    if (!dest) return;

    activeModalDest = dest;

    // Fill Modal Data
    const modalImageBanner = document.getElementById("modalImageBanner");
    const modalCategory = document.getElementById("modalCategory");
    const modalTitle = document.getElementById("modalTitle");
    const modalLocationText = document.getElementById("modalLocationText");
    const modalDescription = document.getElementById("modalDescription");
    const modalHighlights = document.getElementById("modalHighlights");
    const modalSeason = document.getElementById("modalSeason");
    const modalCost = document.getElementById("modalCost");

    modalImageBanner.style.backgroundImage = `url('${dest.image}')`;
    modalCategory.textContent = dest.tag;
    modalTitle.textContent = dest.title;
    modalLocationText.textContent = dest.location;
    modalDescription.textContent = dest.description;
    modalSeason.textContent = dest.bestSeason;
    modalCost.textContent = `$${dest.costPerDay} / day`;

    // Highlights list rendering
    modalHighlights.innerHTML = "";
    dest.highlights.forEach(h => {
      const li = document.createElement("li");
      li.textContent = h;
      modalHighlights.appendChild(li);
    });

    // Open Modal View
    modal.classList.add("open");
  };

  const closeModal = () => {
    modal.classList.remove("open");
    activeModalDest = null;
  };

  function bindCardClicks() {
    const cards = document.querySelectorAll(".dest-card");
    cards.forEach(card => {
      card.addEventListener("click", () => {
        const destId = card.getAttribute("data-id");
        openModal(destId);
      });
    });
  }

  // Click outside to close modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  modalCloseBtn.addEventListener("click", closeModal);

  // Modal Action: Add to Plan
  modalBtnPlanTrip.addEventListener("click", () => {
    if (!activeModalDest) return;

    // 1. Apply default estimated budgets (calculated for a 5-day trip)
    const costPerDay = activeModalDest.costPerDay;
    const flights = 600;
    const stay = costPerDay * 5;
    const dining = 50 * 5;
    const activities = 80 * 5;
    setBudgetValues(flights, stay, dining, activities);

    // 2. Import Highlights into Day 1 timeline
    importTimelineHighlights(activeModalDest.highlights, activeModalDest.title);

    // Close modal
    closeModal();

    // Route to plan view
    switchTab("plan-section");
  });

  // Initial card clicks binding
  bindCardClicks();
});
