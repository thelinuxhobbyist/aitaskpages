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

    if (!jobs.length) {
      container.innerHTML = '<div class="error"><i class="material-icons" style="vertical-align: middle;">info</i> No jobs found. Please try again later.</div>';
      return;
    }

    jobs.forEach(job => {
      const jobCard = document.createElement("a");
      jobCard.href = `job.html?id=${job.jobId}`;
      jobCard.className = "job-card";
      jobCard.innerHTML = `
        <div class="job-title">
          <i class="material-icons">business</i>
          ${job.jobTitle}
        </div>
        <div class="job-company">${job.employerName}</div>
        <div class="job-location">
          <i class="material-icons" style="font-size: 1rem;">location_on</i>
          ${job.locationName}
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

