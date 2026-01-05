export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      // 1. Check if the variable is actually there
      if (!env.REED_API_KEY) {
        throw new Error("SECRET_KEY_MISSING_IN_CLOUDFLARE_SETTINGS");
      }

      // 2. Parse query parameters from the request
      const url = new URL(request.url);
      const searchQuery = url.searchParams.get('search') || 'AI';
      const skillLevel = url.searchParams.get('skillLevel');
      const remoteType = url.searchParams.get('remote');
      const salaryRange = url.searchParams.get('salaryRange');

      // 3. Build Reed API URL
      const reedUrl = `https://www.reed.co.uk/api/1.0/search?keywords=${encodeURIComponent(searchQuery)}&locationName=United+Kingdom`;
      
      const response = await fetch(reedUrl, {
        headers: {
          "Authorization": "Basic " + btoa(env.REED_API_KEY + ":")
        }
      });

      // 4. If Reed sends an error (like 401 Unauthorized), catch it here
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`REED_API_SAYS: ${response.status} - ${errorText}`);
      }

      let data = await response.json();

      // Format salary with UK pound sign
      if (data.results) {
        data.results = data.results.map(job => {
          if (job.minimumSalary || job.maximumSalary) {
            const minSalary = job.minimumSalary ? new Intl.NumberFormat('en-GB').format(job.minimumSalary) : '0';
            const maxSalary = job.maximumSalary ? new Intl.NumberFormat('en-GB').format(job.maximumSalary) : '0';
            job.salary = `£${minSalary} - £${maxSalary}`;
          } else {
            job.salary = "Salary Competitive";
          }
          return job;
        });
      }

      // 5. Apply client-side filters if provided
      if (skillLevel || remoteType || salaryRange) {
        data.results = data.results.filter(job => {
          // Skill Level Filter
          if (skillLevel) {
            const jobText = `${job.jobTitle} ${job.jobDescription}`.toLowerCase();
            let detectedLevel = 'mid'; // default

            if (jobText.includes('senior') || jobText.includes('lead') || jobText.includes('principal') || jobText.includes('staff')) {
              detectedLevel = 'senior';
            } else if (jobText.includes('junior') || jobText.includes('graduate') || jobText.includes('entry')) {
              detectedLevel = 'junior';
            } else if (jobText.includes('mid') || jobText.includes('intermediate') || jobText.includes('mid-level')) {
              detectedLevel = 'mid';
            }

            if (detectedLevel !== skillLevel) return false;
          }

          // Remote Type Filter
          if (remoteType) {
            const jobText = `${job.locationName} ${job.jobDescription}`.toLowerCase();
            let detectedRemote = 'office'; // default

            if (jobText.includes('remote')) {
              detectedRemote = 'remote';
            } else if (jobText.includes('hybrid')) {
              detectedRemote = 'hybrid';
            }

            if (detectedRemote !== remoteType) return false;
          }

          // Salary Range Filter
          if (salaryRange) {
            const minSalary = job.minimumSalary || 0;
            
            if (salaryRange === '0-50000' && minSalary > 50000) return false;
            if (salaryRange === '50000-75000' && (minSalary < 50000 || minSalary > 75000)) return false;
            if (salaryRange === '75000-100000' && (minSalary < 75000 || minSalary > 100000)) return false;
            if (salaryRange === '100000+' && minSalary < 100000) return false;
          }

          return true;
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      // This will now show the REAL error in your browser
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
