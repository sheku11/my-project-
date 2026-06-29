// DESTINATIONS DATABASE & RENDER CONTROLLER

export const destinations = [
  {
    id: "kyoto-japan",
    title: "Kyoto Historic Temples",
    location: "Kyoto, Japan",
    costPerDay: 130,
    rating: 4.9,
    tag: "Cultural",
    category: "culture",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
    description: "Immerse yourself in Japan's imperial history. Kyoto boasts thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden merchant houses. Renowned for its seasonal cherry blossoms, autumn colors, and culinary traditions.",
    bestSeason: "Spring (Mar-May) / Autumn (Oct-Nov)",
    highlights: [
      "Stroll through the iconic orange arches of Fushimi Inari-taisha Shrine.",
      "Explore the golden Kinkaku-ji temple reflecting over the mirroring pond.",
      "Experience a formal tea ceremony in a traditional Gion machiya wooden townhouses.",
      "Walk among towering stalks in the Arashiyama Bamboo Grove."
    ]
  },
  {
    id: "amalfi-coast",
    title: "Amalfi Coast Villages",
    location: "Campania, Italy",
    costPerDay: 220,
    rating: 4.8,
    tag: "Tropical",
    category: "beach",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=600&auto=format&fit=crop",
    description: "The Amalfi Coast is a 50-kilometer stretch of coastline along the southern edge of Italy’s Sorrentine Peninsula. It's a popular holiday destination with sheer cliffs, rugged shoreline dotted with small beaches, and pastel-colored fishing villages cascading down the mountain.",
    bestSeason: "Late Spring (May) / Early Autumn (Sep)",
    highlights: [
      "Wander through Positano's steep, narrow streets lined with boutique shops and cafes.",
      "Take a private boat tour along the coastline to the Emerald Grotto.",
      "Hike the famous Sentiero degli Dei (Path of the Gods) trail for breathtaking views.",
      "Taste fresh limoncello and seafood in Amalfi town."
    ]
  },
  {
    id: "iceland-adventure",
    title: "Iceland Fire & Ice",
    location: "Reykjavik, Iceland",
    costPerDay: 180,
    rating: 4.9,
    tag: "Nature",
    category: "nature",
    image: "https://images.unsplash.com/photo-1504893524553-ac55fce69cbf?q=80&w=600&auto=format&fit=crop",
    description: "Iceland is a Nordic island nation defined by its dramatic landscape with volcanoes, geysers, hot springs, and lava fields. Massive glaciers are protected in Vatnajökull and Snæfellsjökull national parks, while northern lights appear frequently in the winter.",
    bestSeason: "Summer (Jun-Aug) for Hiking / Winter (Nov-Mar) for Aurora",
    highlights: [
      "Drive the Golden Circle route visiting Gullfoss waterfall, Geysir, and Þingvellir.",
      "Soak in the mineral-rich, milky blue waters of the famous Blue Lagoon.",
      "Walk along the black sand beach of Reynisfjara and inspect basalt column cliffs.",
      "Descend into an ice cave inside the Vatnajökull glacier."
    ]
  },
  {
    id: "serengeti-safari",
    title: "Serengeti Wildlife Safari",
    location: "Serengeti, Tanzania",
    costPerDay: 260,
    rating: 4.9,
    tag: "Adventure",
    category: "adventure",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop",
    description: "Tanzania's oldest and most popular national park, a UNESCO World Heritage Site. The Serengeti is famed for its annual migration, when some six million hooves pound the open plains as more than 200,000 zebra and 300,000 Thomson's gazelle join the wildebeest's trek for fresh grazing.",
    bestSeason: "Dry Season (Jun-Oct)",
    highlights: [
      "Witness the dramatic wildebeest river crossings during the Great Migration.",
      "Take a sunrise hot air balloon flight over the expansive savannah.",
      "Go on game drives to track the African Big Five (Lion, Leopard, Elephant, Rhino, Buffalo).",
      "Visit a traditional Maasai village to learn about native cultural customs."
    ]
  },
  {
    id: "patagonia-trek",
    title: "Patagonia Wild Glaciers",
    location: "El Chaltén, Argentina",
    costPerDay: 110,
    rating: 4.7,
    tag: "Nature",
    category: "nature",
    image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=600&auto=format&fit=crop",
    description: "Patagonia is a sparse region at the southern end of South America, shared by Argentina and Chile. The Argentine side features arid steppes, grasslands, and deserts, while the Chilean side has glacial fjords and temperate rainforests. A paradise for hikers and mountaineers.",
    bestSeason: "Summer (Nov-Mar)",
    highlights: [
      "Hike the Laguna de los Tres trail to get a close view of the majestic Mount Fitz Roy.",
      "Walk on the frozen expanse of the massive Perito Moreno Glacier.",
      "Explore the granite towers of Torres del Paine National Park.",
      "Navigate the Chilean fjords by kayak alongside penguins."
    ]
  },
  {
    id: "santorini-getaway",
    title: "Santorini Sunset Escapes",
    location: "Cyclades, Greece",
    costPerDay: 210,
    rating: 4.8,
    tag: "Tropical",
    category: "beach",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600&auto=format&fit=crop",
    description: "Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The giant water-filled caldera is flanked by whitewashed houses clinging to volcanic cliffs.",
    bestSeason: "Shoulder Season (May-Jun / Sep-Oct)",
    highlights: [
      "Watch the world-famous golden hour sunset from the castle ruins in Oia.",
      "Hike the caldera edge path from Fira to Oia for panoramic volcanic views.",
      "Swim at the Red Beach and Kamari Black Sand Beach.",
      "Sample local volcanic wines at cliffside estate wineries."
    ]
  }
];

export function renderDestinations(containerId, filter = "all", searchVal = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const filtered = destinations.filter(dest => {
    const matchesCategory = filter === "all" || dest.category === filter;
    const matchesSearch = dest.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                          dest.location.toLowerCase().includes(searchVal.toLowerCase()) ||
                          dest.tag.toLowerCase().includes(searchVal.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-timeline" style="grid-column: 1 / -1;">
        <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <h4>No Destinations Found</h4>
        <p>Try searching for another place or category.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(dest => {
    const card = document.createElement("div");
    card.className = "dest-card";
    card.setAttribute("data-id", dest.id);
    
    card.innerHTML = `
      <div class="dest-img-container">
        <img class="dest-image" src="${dest.image}" alt="${dest.title}" loading="lazy">
        <span class="dest-tag">${dest.tag}</span>
      </div>
      <div class="dest-info">
        <div class="dest-meta">
          <span class="dest-location">
            <svg class="icon-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${dest.location}
          </span>
          <span class="dest-rating">★ ${dest.rating}</span>
        </div>
        <h3 class="dest-title">${dest.title}</h3>
        <p class="dest-desc">${dest.description.substring(0, 100)}...</p>
        <div class="dest-footer">
          <div>
            <span class="dest-price-label">Est. Cost</span>
            <div class="dest-price">$${dest.costPerDay} <span style="font-size: 12px; font-weight: normal; color: var(--text-muted);">/ day</span></div>
          </div>
          <div class="btn-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}
