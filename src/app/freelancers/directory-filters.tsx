import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Service, Skill } from "@/db/schema";
import type { DirectoryFilters } from "@/lib/validations/directory";

type Props = {
  skills: Skill[];
  services: Service[];
  locations: string[];
  current: DirectoryFilters;
};

export function DirectoryFilters({
  skills,
  services,
  locations,
  current,
}: Props) {
  return (
    <form
      method="GET"
      action="/freelancers"
      className="rounded-xl border border-border bg-surface p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="q">Search</Label>
          <Input
            id="q"
            name="q"
            placeholder="Name, headline, or keywords…"
            defaultValue={current.q ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill">Skill</Label>
          <select
            id="skill"
            name="skill"
            defaultValue={current.skill ?? ""}
            className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">All skills</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.slug}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <select
            id="service"
            name="service"
            defaultValue={current.service ?? ""}
            className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">All services</option>
            {services.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            list="location-suggestions"
            placeholder="e.g. London"
            defaultValue={current.location ?? ""}
          />
          <datalist id="location-suggestions">
            {locations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minRate">Min rate (£/hr)</Label>
          <Input
            id="minRate"
            name="minRate"
            type="number"
            min={0}
            placeholder="0"
            defaultValue={current.minRate ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxRate">Max rate (£/hr)</Label>
          <Input
            id="maxRate"
            name="maxRate"
            type="number"
            min={0}
            placeholder="500"
            defaultValue={current.maxRate ?? ""}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="submit">Search experts</Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/freelancers">Clear filters</Link>
        </Button>
      </div>
    </form>
  );
}
