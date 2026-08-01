import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatJobSalary, type JobListing } from "@/lib/jobs";
import { Briefcase, MapPin, Wallet } from "lucide-react";

export function JobPreviewCard({ job }: { job: JobListing }) {
  const salary = formatJobSalary(job);

  return (
    <Link href={`/job.html?id=${job.jobId}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md group-hover:border-primary/30">
        <CardContent className="space-y-3.5 p-5 md:p-6">
          <div>
            <p className="text-lg font-semibold leading-snug tracking-tight text-secondary group-hover:text-primary">
              {job.jobTitle}
            </p>
            <p className="mt-1 text-[0.9375rem] text-muted">{job.employerName}</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.9375rem] text-muted">
            {job.locationName && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.locationName}
              </span>
            )}
            {salary && (
              <span className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4" />
                {salary}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function JobPreviewPlaceholder() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex items-center gap-3 p-5 text-sm text-muted">
        <Briefcase className="h-5 w-5 shrink-0" strokeWidth={1.5} />
        Jobs loading unavailable — browse the full jobs board instead.
      </CardContent>
    </Card>
  );
}
