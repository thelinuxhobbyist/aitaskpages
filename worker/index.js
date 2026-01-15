// Helper to filter only AI-related jobs
function isAiJob(job) {
  const title = job.jobTitle.toLowerCase();
  const keywords = ["ai", "ml", "machine learning", "data scientist", "nlp", "llm"];
  return keywords.some(k => title.includes(k));
}

// Helper to add CORS headers
function withCors(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "*");
  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    // 1️⃣ List AI jobs (UK)
    if (url.pathname === "/api/jobs") {
      const reedResponse = await fetch(
        "https://www.reed.co.uk/api/1.0/search?keywords=ai&locationName=UK&resultsToReturn=100",
        {
          headers: {
            "Authorization": "Basic " + btoa(env.MARKET_AI_JOBS_REED_API_KEY + ":")
          }
        }
      );

      const data = await reedResponse.json();

      // Filter only AI-related jobs
      const aiJobs = data.results.filter(isAiJob);

      return withCors(new Response(JSON.stringify(aiJobs), {
        headers: { "Content-Type": "application/json" }
      }));
    }

    // 2️⃣ Job details by ID
    if (url.pathname.startsWith("/api/jobs/")) {
      const jobId = url.pathname.split("/").pop();

      const reedResponse = await fetch(
        `https://www.reed.co.uk/api/1.0/jobs/${jobId}`,
        {
          headers: {
            "Authorization": "Basic " + btoa(env.MARKET_AI_JOBS_REED_API_KEY + ":")
          }
        }
      );

      const data = await reedResponse.json();

      return withCors(new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      }));
    }

    // Default: 404
    return new Response("Not Found", { status: 404 });
  }
};

