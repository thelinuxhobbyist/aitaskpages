// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    navToggle.querySelector(".material-icons").textContent = isOpen
      ? "close"
      : "menu";
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.setAttribute("aria-label", "Open menu");
      navToggle.querySelector(".material-icons").textContent = "menu";
    });
  });
}

// Search functionality
let allJobs = [];

// UK postcode to city mapping
const postcodeToCity = {
  'M': 'Manchester',
  'L': 'Liverpool',
  'B': 'Birmingham',
  'LS': 'Leeds',
  'S': 'Sheffield',
  'E': 'London',
  'W': 'London',
  'SW': 'London',
  'SE': 'London',
  'N': 'London',
  'NW': 'London',
  'EC': 'London',
  'WC': 'London',
  'CB': 'Cambridge',
  'OX': 'Oxford',
  'BA': 'Bath',
  'BS': 'Bristol',
  'EH': 'Edinburgh',
  'G': 'Glasgow',
  'CF': 'Cardiff',
  'B': 'Belfast',
  'BT': 'Belfast',
  'CV': 'Coventry',
  'DY': 'Wolverhampton',
  'ST': 'Stoke-on-Trent',
  'NG': 'Nottingham',
  'DE': 'Derby',
  'LE': 'Leicester',
  'PE': 'Peterborough',
  'NR': 'Norwich',
  'IP': 'Ipswich',
  'CO': 'Colchester',
  'CM': 'Chelmsford',
  'CT': 'Canterbury',
  'SO': 'Southampton',
  'RG': 'Reading',
  'GU': 'Guildford',
  'RH': 'Reigate',
  'BN': 'Brighton',
  'PO': 'Portsmouth',
  'SP': 'Salisbury',
  'SN': 'Swindon',
  'GL': 'Gloucester',
  'HR': 'Hereford',
  'LD': 'Llandrindod',
  'SA': 'Swansea',
  'NP': 'Newport'
};

function extractCity(locationName) {
  if (!locationName) return null;
  
  // If it's already a city name, return it
  const cityNames = ['Manchester', 'Leeds', 'London', 'Cambridge', 'Bath', 'Bristol', 'Liverpool', 'Birmingham', 'Sheffield', 'Edinburgh', 'Glasgow', 'Cardiff', 'Oxford', 'Coventry', 'Wolverhampton', 'Stoke-on-Trent', 'Nottingham', 'Derby', 'Leicester', 'Peterborough', 'Norwich', 'Ipswich', 'Colchester', 'Chelmsford', 'Canterbury', 'Southampton', 'Reading', 'Guildford', 'Reigate', 'Brighton', 'Portsmouth', 'Salisbury', 'Swindon', 'Gloucester', 'Hereford', 'Swansea', 'Newport', 'Belfast'];
  if (cityNames.includes(locationName)) {
    return locationName;
  }
  
  // Try to extract city from postcode
  const upperLocation = locationName.toUpperCase();
  for (const [prefix, city] of Object.entries(postcodeToCity)) {
    if (upperLocation.startsWith(prefix)) {
      return city;
    }
  }
  
  // If no match, return the original (might be a city name we don't have in mapping)
  return locationName;
}

function populateFilters() {
  // Extract unique cities and map postcodes to city names
  const citiesSet = new Set();
  allJobs.forEach(job => {
    const city = extractCity(job.locationName);
    if (city) citiesSet.add(city);
  });
  
  const cities = [...citiesSet].sort();
  const citySelect = document.getElementById('city-filter');
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

function applyFilters() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();
  const cityFilter = document.getElementById('city-filter').value;

  let filtered = allJobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.jobTitle.toLowerCase().includes(searchQuery) ||
      job.employerName.toLowerCase().includes(searchQuery);
    
    const jobCity = extractCity(job.locationName);
    const matchesCity = !cityFilter || jobCity === cityFilter;
    
    return matchesSearch && matchesCity;
  });

  renderJobs(filtered);
  document.getElementById('job-count').textContent = filtered.length;
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', applyFilters);

const cityFilter = document.getElementById('city-filter');
cityFilter.addEventListener('change', applyFilters);

function renderJobs(jobs) {
  const container = document.getElementById('jobs');
  container.innerHTML = '';
  
  if (!jobs.length) {
    container.innerHTML = '<div class="error"><i class="material-icons" style="vertical-align: middle;">info</i> No jobs found. Please try again.</div>';
    return;
  }
  
  jobs.forEach(job => {
    const salaryMin = job.minimumSalary ? `£${(job.minimumSalary / 1000).toFixed(0)}k` : 'Competitive';
    const salaryMax = job.maximumSalary ? `£${(job.maximumSalary / 1000).toFixed(0)}k` : 'Competitive';
    
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    jobCard.innerHTML = `
      <div class="job-card-content">
        <div class="job-header">
          <div class="job-icon">
            <i class="material-icons">smart_toy</i>
          </div>
          <div class="job-title-section">
            <div class="job-title">${job.jobTitle}</div>
            <div class="job-company">${job.employerName}</div>
          </div>
        </div>
        <div class="job-meta">
          <div class="job-meta-item">
            <i class="material-icons">location_on</i>
            <span>${job.locationName}</span>
          </div>
          <div class="job-meta-item">
            <i class="material-icons">currency_pound</i>
            <span>${salaryMin} - ${salaryMax}</span>
          </div>
        </div>
      </div>
      <div class="job-actions">
        <a href="job.html?id=${job.jobId}" class="view-details-btn">
          <i class="material-icons">arrow_forward</i>
          View Details
        </a>
      </div>
    `;
    container.appendChild(jobCard);
  });
}

async function loadJobs() {
  try {
    const container = document.getElementById("jobs");
    container.innerHTML = '<div class="loading"><i class="material-icons" style="font-size: 3rem;">hourglass_empty</i><p>Loading jobs...</p></div>';

    const res = await fetch("https://aitaskpages-jobs-worker.yama.workers.dev/api/jobs");
    const jobs = await res.json();

    // Store jobs globally for search functionality
    allJobs = jobs;

    // Update job count
    document.getElementById("job-count").textContent = jobs.length;

    if (!jobs.length) {
      container.innerHTML = '<div class="error"><i class="material-icons" style="vertical-align: middle;">info</i> No jobs found. Please try again later.</div>';
      return;
    }

    populateFilters();
    renderJobs(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    document.getElementById("jobs").innerHTML = '<div class="error"><i class="material-icons" style="vertical-align: middle;">error</i> Failed to load jobs. Please check your connection and try again.</div>';
  }
}

loadJobs();

