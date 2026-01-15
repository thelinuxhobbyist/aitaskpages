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

async function loadJobs() {
  try {
    const container = document.getElementById("jobs");
    container.innerHTML = '<div class="loading"><i class="material-icons" style="font-size: 3rem;">hourglass_empty</i><p>Loading jobs...</p></div>';

    const res = await fetch("https://market-ai-jobs-worker.yama.workers.dev/api/jobs");
    const jobs = await res.json();

    container.innerHTML = "";

    // Update job count
    document.getElementById("job-count").textContent = jobs.length;

    if (!jobs.length) {
      container.innerHTML = '<div class="error"><i class="material-icons" style="vertical-align: middle;">info</i> No jobs found. Please try again later.</div>';
      return;
    }

    jobs.forEach(job => {
      const salaryMin = job.minimumSalary ? `£${(job.minimumSalary / 1000).toFixed(0)}k` : "Competitive";
      const salaryMax = job.maximumSalary ? `£${(job.maximumSalary / 1000).toFixed(0)}k` : "Competitive";
      
      const jobCard = document.createElement("div");
      jobCard.className = "job-card";
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
              <i class="material-icons">paid</i>
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
  } catch (err) {
    console.error("Error fetching jobs:", err);
    document.getElementById("jobs").innerHTML = '<div class="error"><i class="material-icons" style="vertical-align: middle;">error</i> Failed to load jobs. Please check your connection and try again.</div>';
  }
}

loadJobs();

