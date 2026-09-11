export type JobListing = {
  jobId: string;
  jobTitle: string;
  employerName: string;
  locationName: string;
  minimumSalary?: number | null;
  maximumSalary?: number | null;
};

/** Jobs board API — use AI Task Pages worker only; do not call AI Jobs Market. */
const JOBS_API =
  process.env.JOBS_API_URL?.trim() ||
  "https://aitaskpages-jobs-worker.yama.workers.dev/api/jobs";

/** Latest job listings from the jobs board API. */
export async function getLatestJobs(limit = 6): Promise<JobListing[]> {
  try {
    const res = await fetch(JOBS_API, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const jobs = (await res.json()) as JobListing[];
    return jobs.slice(0, limit);
  } catch {
    return [];
  }
}

export function formatJobSalary(job: JobListing): string | null {
  const min = job.minimumSalary
    ? `£${Math.round(job.minimumSalary / 1000)}k`
    : null;
  const max = job.maximumSalary
    ? `£${Math.round(job.maximumSalary / 1000)}k`
    : null;
  if (min && max) return `${min} – ${max}`;
  if (min) return `From ${min}`;
  if (max) return `Up to ${max}`;
  return null;
}
