import { createIcons, ShieldCheck, Heart, PlusCircle, User, MapPin, Clock, Filter, AlertTriangle } from 'lucide';

// Initialize Lucide Icons
createIcons({
  icons: {
    ShieldCheck,
    Heart,
    PlusCircle,
    User,
    MapPin,
    Clock,
    Filter,
    AlertTriangle
  }
});

// Mock Data: Initial "Scattered" Community Needs
const initialNeeds = [
  {
    id: 1,
    title: "Medical Supplies Delivery",
    category: "Medical",
    location: "West End",
    urgency: "High",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    description: "Urgent need for transportation of insulin to community clinic.",
    skills: ["Driver", "First Aid"]
  },
  {
    id: 2,
    title: "Food Pantry Stocking",
    category: "Food",
    location: "Downtown",
    urgency: "Medium",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    description: "Help organize weekly donations at the central food bank.",
    skills: ["Manual Labor"]
  },
  {
    id: 3,
    title: "Emergency Shelter Setup",
    category: "Shelter",
    location: "East Side",
    urgency: "Critical",
    timestamp: new Date(Date.now() - 1800000), // 30 mins ago
    description: "Storm damage requires immediate temporary shelter coordination.",
    skills: ["Construction", "Logistics"]
  },
  {
    id: 4,
    title: "Elderly Check-in",
    category: "Social",
    location: "North Park",
    urgency: "Medium",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    description: "Visit seniors to ensure they have heat and water after power outage.",
    skills: ["Social Work", "Friendly"]
  }
];

let currentNeeds = [...initialNeeds];

// Smart Matching Logic
// Priority Score = (UrgencyWeight * 100) + (TimeElapsedInHours * 10)
const URGENCY_WEIGHTS = {
  "Critical": 10,
  "High": 5,
  "Medium": 2,
  "Low": 1
};

function calculatePriority(need) {
  const hoursElapsed = (Date.now() - need.timestamp.getTime()) / (1000 * 60 * 60);
  return (URGENCY_WEIGHTS[need.urgency] * 100) + (hoursElapsed * 10);
}

function sortNeedsByPriority() {
  currentNeeds.sort((a, b) => calculatePriority(b) - calculatePriority(a));
}

// Render Logic
function renderNeeds() {
  const needsList = document.getElementById('needsList');
  if (!needsList) return;

  sortNeedsByPriority();

  needsList.innerHTML = currentNeeds.map(need => `
    <div class="need-item animate-in" id="need-${need.id}">
      <div class="need-info">
        <span class="badge badge-${need.urgency.toLowerCase()}">${need.urgency}</span>
        <h4>${need.title}</h4>
        <div class="need-meta">
          <span><i data-lucide="map-pin" style="width:14px; height:14px; display:inline-block; vertical-align:text-bottom;"></i> ${need.location}</span>
          <span><i data-lucide="clock" style="width:14px; height:14px; display:inline-block; vertical-align:text-bottom;"></i> ${getTimeAgo(need.timestamp)}</span>
        </div>
        <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem;">${need.description}</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
         <button class="btn btn-primary btn-sm" onclick="window.claimNeed(${need.id})">
            Match Me
         </button>
         <span style="font-size: 0.7rem; color: var(--primary); font-weight: 600;">Match Score: ${Math.round(calculatePriority(need))}</span>
      </div>
    </div>
  `).join('');
  
  // Re-run lucide to iconize the new elements
  createIcons({
    icons: { MapPin, Clock }
  });
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

// Modal Logic
const reportModal = document.getElementById('reportModal');
const reportForm = document.getElementById('reportForm');
const reportBtn = document.getElementById('reportBtn');
const closeModalBtn = document.getElementById('closeModal');

if (reportBtn) {
  reportBtn.onclick = () => reportModal.classList.add('active');
}

closeModalBtn.onclick = () => reportModal.classList.remove('active');

window.onclick = (event) => {
  if (event.target == reportModal) {
    reportModal.classList.remove('active');
  }
};

// Form Submission
reportForm.onsubmit = (e) => {
  e.preventDefault();
  
  const newNeed = {
    id: Date.now(),
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    urgency: document.getElementById('urgency').value,
    location: document.getElementById('location').value,
    description: document.getElementById('description').value,
    timestamp: new Date(),
    skills: ["General"]
  };
  
  currentNeeds.unshift(newNeed);
  renderNeeds();
  updateStats();
  
  reportModal.classList.remove('active');
  reportForm.reset();
  
  // Show a success toast (simulated)
  alert("Need reported successfully! Our system is now matching it with local volunteers.");
};

// Interactivity
// Impact Tracking
let impactData = [30, 45, 25, 60, 40, 75, 55];
function renderImpactChart() {
  const chart = document.getElementById('impactChart');
  if (!chart) return;
  
  chart.innerHTML = impactData.map((val, i) => `
    <div class="impact-bar" style="height: ${val}%; left: ${i * 25 + 10}px;"></div>
  `).join('');
}

window.claimNeed = (id) => {
  const index = currentNeeds.findIndex(n => n.id === id);
  if (index !== -1) {
    const need = currentNeeds[index];
    
    // Update Success Feed
    const successFeed = document.getElementById('successFeed');
    const p = document.createElement('p');
    p.style.marginBottom = "0.5rem";
    p.innerHTML = `<strong>You</strong> just matched with "${need.title}"!`;
    successFeed.prepend(p);
    
    // Update Impact Data
    impactData.push(Math.min(100, impactData[impactData.length - 1] + 5));
    if (impactData.length > 15) impactData.shift();
    renderImpactChart();
    
    currentNeeds.splice(index, 1);
    renderNeeds();
    updateStats();
  }
};

function updateStats() {
  document.getElementById('totalNeeds').textContent = currentNeeds.length;
  const stat = document.getElementById('totalNeeds');
  stat.classList.add('pulse');
  setTimeout(() => stat.classList.remove('pulse'), 1000);
}

// Simulate "Gathering Scattered Info"
function discoverNewNeed() {
  const titles = ["Bridge Repair Assistance", "Youth Mentoring Session", "Water Distribution", "Tech Support for Library", "Emergency Medication", "Elderly Grocery Delivery"];
  const locations = ["South Side", "Harbor District", "Old Town", "Suburbs", "Valley View", "Industrial Zone"];
  const urgencies = ["Low", "Medium", "High", "Critical"];
  
  const newNeed = {
    id: Date.now(),
    title: titles[Math.floor(Math.random() * titles.length)],
    category: "General",
    location: locations[Math.floor(Math.random() * locations.length)],
    urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
    timestamp: new Date(),
    description: "Newly discovered community requirement identified via decentralized reporting.",
    skills: ["General"]
  };
  
  currentNeeds.unshift(newNeed);
  renderNeeds();
  updateStats();
}

// Initial Run
renderNeeds();
updateStats();

// Discover a new need every 20 seconds
setInterval(discoverNewNeed, 20000);
