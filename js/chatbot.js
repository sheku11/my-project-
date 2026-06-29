// VOYAGEBOT - MOCK TRAVEL ASSISTANT CHAT ENGINE
import { importPackingList, importTimelineHighlights, setBudgetValues } from "./planner.js";

// Database of specific responses with Action Triggers
const assistantDatabase = {
  mountainPack: {
    reply: `Here is a custom packing checklist for a 5-day mountain trip:
    
    • Thermal Innerwear (Top & Bottom)
    • High-grip Waterproof Hiking Boots
    • Woolen Hiking Socks (3-4 pairs)
    • Fleece Jacket / Thermal Layer
    • Beanie & Touchscreen Gloves
    • Sunglasses & Lip Balm (SPF protection)
    • Trekking Poles
    
    You can import these items directly into your Packer checklist page using the button below.`,
    button: {
      text: "📥 Import Items to Packer",
      action: "import-pack",
      data: ["Thermal Innerwear", "Hiking Boots", "Woolen Socks", "Fleece Jacket", "Beanie & Gloves", "Trekking Poles"]
    }
  },
  kyotoItinerary: {
    reply: `Here is a curated 3-day highlight itinerary for Kyoto, Japan:
    
    • Day 1: Arrive in Kyoto, explore the Gion historic district, and experience a traditional dinner.
    • Day 2: Visit Kinkaku-ji (Golden Pavilion) in the morning, and the Arashiyama Bamboo Grove in the afternoon.
    • Day 3: Morning hike through Fushimi Inari-taisha Shrine gates, then head to Kiyomizu-dera temple.
    
    You can import Day 1 highlights into your Trip Planner timeline using the button below.`,
    button: {
      text: "⛩️ Load Schedule to Day 1 Timeline",
      action: "import-itinerary",
      data: {
        highlights: [
          "Arrive in Kyoto & Hotel Check-in",
          "Explore Gion Historic District",
          "Gion Traditional Dinner Experience",
          "Evening Tea & Tea Ceremony"
        ],
        location: "Kyoto, Japan"
      }
    }
  },
  santoriniBudget: {
    reply: `Here are 4 tips to travel Santorini on a budget:
    
    1. **Stay in Fira or Karterados**: Fira has budget hostels, and Karterados is a 15-minute walk from town and much cheaper than cliffside Oia suites.
    2. **Eat Souvlaki & Gyros**: A delicious local pita wrap costs around $4-$5, saving you a lot compared to formal sit-down dinners.
    3. **Travel in May or October**: The weather is warm, but hotel prices are sliced by up to 50% compared to July/August.
    4. **Use the Local Bus**: The KTEL bus network connects all towns (Fira, Oia, Akrotiri, beaches) for just $2 per ticket.
    
    Apply a recommended budget ($1,500 total) for a budget-friendly Santorini trip below.`,
    button: {
      text: "💶 Apply Santorini Budget to Calculator",
      action: "import-budget",
      data: { flights: 600, stay: 450, dining: 250, activities: 200 }
    }
  },
  safetyTips: {
    reply: `Here are 5 key travel safety tips for travelers:
    
    1. **Share Your Itinerary**: Keep a close friend or family member updated with your daily plans, accommodation details, and flight changes.
    2. **Arrive in Day Light**: Try to book flights/trains that arrive during daylight hours. Finding your hotel in a new city is much safer during the day.
    3. **Use Offline Maps**: Download Google Maps or Maps.me of the destination offline. It prevents you from looking lost and works when mobile data fails.
    4. **Secure Your Documents**: Keep digital copies of your passport/ID on your phone and email. Use hotel safes for paper originals.
    5. **Blend In Locally**: Dress conservatively or matching local standards to avoid drawing attention to yourself as an easy tourist target.`
  }
};

export function initChatbot() {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const chips = document.querySelectorAll(".prompt-chip");

  if (!chatForm) return;

  // Add click events to prompt suggestion chips
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.getAttribute("data-prompt");
      sendUserMessage(prompt);
    });
  });

  // Form submit message sender
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const prompt = chatInput.value.trim();
    if (prompt) {
      sendUserMessage(prompt);
      chatInput.value = "";
    }
  });

  function sendUserMessage(text) {
    // Append User Bubble
    appendBubble(text, "user");

    // Show Typing Indicator
    const typingIndicator = showTypingIndicator();

    // Scroll to bottom
    scrollToBottom();

    // Generate response with delay
    setTimeout(() => {
      // Remove typing indicator
      typingIndicator.remove();

      // Get reply based on keywords
      const botResponse = generateBotReply(text);
      appendBubble(botResponse.reply, "bot", botResponse.button);
      scrollToBottom();
    }, 1200);
  }

  function appendBubble(text, sender, actionBtn = null) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}-bubble`;

    // Timestamp
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    bubble.innerHTML = `
      <div class="bubble-text">${text}</div>
      <div class="bubble-time">${timeStr}</div>
    `;

    // Append action button if present
    if (actionBtn) {
      const btn = document.createElement("button");
      btn.className = "btn btn-primary mt-4 btn-icon";
      btn.style.fontSize = "13px";
      btn.style.padding = "8px 14px";
      btn.innerHTML = actionBtn.text;

      btn.addEventListener("click", () => {
        handleActionClick(actionBtn.action, actionBtn.data, btn);
      });

      bubble.appendChild(btn);
    }

    chatMessages.appendChild(bubble);
  }

  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "chat-bubble bot-bubble";
    indicator.innerHTML = `
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(indicator);
    return indicator;
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateBotReply(inputText) {
    const text = inputText.toLowerCase();

    // Match Specific keywords or custom questions
    if (text.includes("mountain") || text.includes("pack for a 5-day") || text.includes("hiking")) {
      return assistantDatabase.mountainPack;
    }
    if (text.includes("kyoto") || text.includes("japan") || text.includes("itinerary for kyoto")) {
      return assistantDatabase.kyotoItinerary;
    }
    if (text.includes("santorini") || text.includes("greece") || text.includes("budget in santorini")) {
      return assistantDatabase.santoriniBudget;
    }
    if (text.includes("safety") || text.includes("solo") || text.includes("female")) {
      return assistantDatabase.safetyTips;
    }

    // Dynamic Generic Replier
    if (text.includes("hello") || text.includes("hi ") || text.includes("hey")) {
      return {
        reply: `Hello there! I am VoyageBot. How can I assist you with your travels today? 🌍\n\nYou can ask me for packing checklists, itineraries (like Kyoto, Japan), budget travel hacks, or safety guidelines!`
      };
    }

    if (text.includes("weather")) {
      return {
        reply: `Most popular destinations are experiencing perfect traveling weather right now! For example, Kyoto is looking clear and ideal for sightseeing, whereas Santorini is sunny and perfect for caldera hikes. Which destination are you planning to visit?`
      };
    }

    if (text.includes("thank")) {
      return {
        reply: `You're very welcome! If you need any more recommendations, just ask. Safe travels! ✈️`
      };
    }

    // Default Fallback
    return {
      reply: `That sounds like an amazing trip! To help you best, here are a few things I can do for you:
      
      • Plan a packing checklist (try typing: "pack for mountains")
      • Draft a custom daily schedule (try typing: "itinerary for Kyoto")
      • Give you travel budget insights (try typing: "budget in Santorini")
      • Share solo travel security tips (try typing: "safety tips")`
    };
  }

  function handleActionClick(action, data, btnElement) {
    // Perform integration actions
    if (action === "import-pack") {
      importPackingList(data);
      btnElement.textContent = "✓ Imported successfully!";
      btnElement.style.background = "var(--accent)";
      btnElement.disabled = true;

      // Toast notification or guide user
      appendSystemMessage("Items successfully added to your Packer list!");
    } 
    else if (action === "import-itinerary") {
      importTimelineHighlights(data.highlights, data.location);
      btnElement.textContent = "✓ Timeline Loaded!";
      btnElement.style.background = "var(--accent)";
      btnElement.disabled = true;

      appendSystemMessage("Kyoto tour scheduled to your Trip Planner (Day 1)!");
    } 
    else if (action === "import-budget") {
      setBudgetValues(data.flights, data.stay, data.dining, data.activities);
      btnElement.textContent = "✓ Budget Applied!";
      btnElement.style.background = "var(--accent)";
      btnElement.disabled = true;

      appendSystemMessage("Budget limits applied to your Budget Allocator!");
    }
  }

  function appendSystemMessage(msg) {
    const sysBubble = document.createElement("div");
    sysBubble.className = "chat-bubble bot-bubble";
    sysBubble.style.opacity = "0.85";
    sysBubble.innerHTML = `
      <div class="bubble-text" style="background: rgba(20, 184, 166, 0.1); border: 1px dashed var(--accent); color: var(--accent); font-weight: 500; font-size: 13px; text-align: center;">
        ⚙️ System: ${msg}
      </div>
    `;
    chatMessages.appendChild(sysBubble);
    scrollToBottom();
  }
}
