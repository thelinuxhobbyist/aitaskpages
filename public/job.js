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

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

async function loadJob() {
  try {
    const jobContainer = document.getElementById("job");
    jobContainer.innerHTML = '<div class="loading"><i class="material-icons" style="font-size: 3rem;">hourglass_empty</i><p>Loading job details...</p></div>';

    const res = await fetch(`https://market-ai-jobs-worker.yama.workers.dev/api/jobs/${jobId}`);
    const job = await res.json();

    const salaryMin = job.minimumSalary ? `£${job.minimumSalary.toLocaleString()}` : "Not specified";
    const salaryMax = job.maximumSalary ? `£${job.maximumSalary.toLocaleString()}` : "Not specified";

    jobContainer.innerHTML = `
      <div class="job-details">
        <h1>${job.jobTitle}</h1>
        
        <div class="job-details-meta">
          <div class="meta-item">
            <i class="material-icons">business</i>
            <div>
              <strong>Company</strong>
              <span>${job.employerName}</span>
            </div>
          </div>
          <div class="meta-item">
            <i class="material-icons">location_on</i>
            <div>
              <strong>Location</strong>
              <span>${job.locationName}</span>
            </div>
          </div>
          <div class="meta-item">
            <i class="material-icons">paid</i>
            <div>
              <strong>Salary</strong>
              <span>${salaryMin} - ${salaryMax}</span>
            </div>
          </div>
        </div>

        <div class="job-description">
          ${job.jobDescription.replace(/\n/g, '<p></p>')}
        </div>

        <a href="${job.jobUrl}" target="_blank" class="apply-button">
          <i class="material-icons">open_in_new</i>
          Apply on Reed
        </a>
      </div>
    `;
  } catch (err) {
    console.error("Error fetching job details:", err);
    document.getElementById("job").innerHTML = '<div class="error"><i class="material-icons" style="vertical-align: middle;">error</i> Failed to load job details. Please try again later.</div>';
  }
}

loadJob();

