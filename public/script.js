// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Close menu when a link is clicked
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// Search functionality
let allJobs = [];

function populateFilters() {
  // Extract unique cities
  const cities = [...new Set(allJobs.map(job => job.locationName))].sort();
  const citySelect = document.getElementById('city-filter');
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });

  // Extract unique roles (job titles)
  const roles = [...new Set(allJobs.map(job => job.jobTitle))].sort();
  const roleSelect = document.getElementById('role-filter');
  roles.forEach(role => {
    const option = document.createElement('option');
    option.value = role;
    option.textContent = role;
    roleSelect.appendChild(option);
  });

  // Extract unique programming languages from job descriptions
  const languages = new Set();
  allJobs.forEach(job => {
    const description = (job.jobDescription || '').toLowerCase();
    const commonLanguages = ['python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'rust', 'sql', 'r', 'scala', 'kotlin'];
    commonLanguages.forEach(lang => {
      if (description.includes(lang)) {
        languages.add(lang.charAt(0).toUpperCase() + lang.slice(1));
      }
    });
  });
  
  const languageSelect = document.getElementById('language-filter');
  [...languages].sort().forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    languageSelect.appendChild(option);
  });
}

function detectLevel(job) {
  const description = (job.jobDescription || '').toLowerCase();
  const title = (job.jobTitle || '').toLowerCase();
  const combined = description + ' ' + title;
  
  if (combined.includes('senior') || combined.includes('lead') || combined.includes('principal') || combined.includes('architect')) {
    return 'senior';
  } else if (combined.includes('junior') || combined.includes('graduate') || combined.includes('entry')) {
    return 'junior';
  } else {
    return 'mid';
  }
}

function applyFilters() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();
  const cityFilter = document.getElementById('city-filter').value;
  const roleFilter = document.getElementById('role-filter').value;
  const languageFilter = document.getElementById('language-filter').value;
  const levelFilter = document.getElementById('level-filter').value;

  let filtered = allJobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.jobTitle.toLowerCase().includes(searchQuery) ||
      job.employerName.toLowerCase().includes(searchQuery);
    
    const matchesCity = !cityFilter || job.locationName === cityFilter;
    
    const matchesRole = !roleFilter || job.jobTitle === roleFilter;
    
    const matchesLanguage = !languageFilter || 
      (job.jobDescription || '').toLowerCase().includes(languageFilter.toLowerCase());
    
    const matchesLevel = !levelFilter || detectLevel(job) === levelFilter;
    
    return matchesSearch && matchesCity && matchesRole && matchesLanguage && matchesLevel;
  });

  renderJobs(filtered);
  document.getElementById('job-count').textContent = filtered.length;
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', applyFilters);

const cityFilter = document.getElementById('city-filter');
cityFilter.addEventListener('change', applyFilters);

const roleFilter = document.getElementById('role-filter');
roleFilter.addEventListener('change', applyFilters);

const languageFilter = document.getElementById('language-filter');
languageFilter.addEventListener('change', applyFilters);

const levelFilter = document.getElementById('level-filter');
levelFilter.addEventListener('change', applyFilters);

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

    const res = await fetch("https://market-ai-jobs-worker.yama.workers.dev/api/jobs");
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

