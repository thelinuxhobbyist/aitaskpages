const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

async function loadJob() {
  try {
    const res = await fetch(`https://market-ai-jobs-worker.yama.workers.dev/api/jobs/${jobId}`);
    const job = await res.json();

    document.getElementById("job").innerHTML = `
      <h1>${job.jobTitle}</h1>
      <p><strong>Company:</strong> ${job.employerName}</p>
      <p><strong>Location:</strong> ${job.locationName}</p>
      <p><strong>Salary:</strong> £${job.minimumSalary || "N/A"} - £${job.maximumSalary || "N/A"}</p>
      <p>${job.jobDescription}</p>
      <a href="${job.jobUrl}" target="_blank"><button>Apply on Reed</button></a>
    `;
  } catch (err) {
    console.error("Error fetching job details:", err);
    document.getElementById("job").innerHTML = "<p>Failed to load job details.</p>";
  }
}

loadJob();

