// ========== Multiple API Keys ==========
const API_KEYS = [
  "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",
  "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"
];
let currentKeyIndex = 0;

// Get current API key
function getApiKey() {
  return API_KEYS[currentKeyIndex];
}

// Rotate API key if one fails
function rotateKey() {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return getApiKey();
}

// ========== Typing Effect ==========
function typeWriterEffect(text, element) {
  element.innerHTML = "";
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, 15); // typing speed
    }
  }
  typing();
}

// ========== Generate Notes ==========
async function generateNotes(query) {
  const results = document.getElementById("results");
  results.innerHTML = `<div class="loading"> Generating notes...</div>`;

  let success = false;
  let attempt = 0;

  while (!success && attempt < API_KEYS.length) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getApiKey()}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a world-class academic assistant. Generate clean, concise, professional notes with bullet points, focusing only on the most important concepts." },
            { role: "user", content: `Generate summarized bullet-point notes for: ${query}` }
          ],
          temperature: 0.5
        })
      });

      if (response.status === 401 || response.status === 429) {
        rotateKey(); // Try next API key
        attempt++;
        continue;
      }

      const data = await response.json();
      const notes = data.choices[0].message.content;

      // Style notes in bullet points
      const formatted = notes
        .split("\n")
        .map(line => line.replace(/^[-•\*]\s*/, ""))
        .filter(line => line.trim() !== "")
        .map(line => `<li>${line.trim()}</li>`)
        .join("");

      results.innerHTML = `<ul class="notes-list">${formatted}</ul>`;
      results.classList.add("fade-in");
      success = true;

    } catch (error) {
      results.innerHTML = `<span class="error"> Error: ${error.message}</span>`;
      break;
    }
  }

  if (!success) {
    results.innerHTML = `<span class="error"> Error Occured...</span>`;
  }
}

// ========== Voice Search ==========
document.getElementById("voice-btn").addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert(" Speech recognition not supported in this browser.");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("search-input").value = transcript;
    generateNotes(transcript);
  };
});

// ========== Image Upload (Future Expansion) ==========
document.getElementById("image-btn").addEventListener("click", () => {
  document.getElementById("image-input").click();
});

// ========== Text Search ==========
document.getElementById("search-btn").addEventListener("click", () => {
  const input = document.getElementById("search-input").value.trim();
  if (!input) {
    document.getElementById("results").innerHTML = `<span class="error"> Please enter a topic.</span>`;
    return;
  }
  generateNotes(input);
});

