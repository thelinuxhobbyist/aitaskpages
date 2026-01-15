async function loadJobs() {
  try {
    const res = await fetch("https://market-ai-jobs-worker.yama.workers.dev/api/jobs");
    const jobs = await res.json();

    const list = document.getElementById("jobs");
    list.innerHTML = "";

    if (!jobs.length) {
      list.innerHTML = "<li>No jobs found.</li>";
      return;
    }

    jobs.forEach(job => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="job.html?id=${job.jobId}">
          <span class="title">${job.jobTitle}</span><br>
          <span class="company">${job.employerName}</span> – 
          <span class="location">${job.locationName}</span>
        </a>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    document.getElementById("jobs").innerHTML = "<li>Failed to load jobs.</li>";
  }
}

loadJobs();

