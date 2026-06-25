import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/app/freelancers/[slug]/contact-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProfileBySlug, incrementProfileViews } from "@/lib/directory";
import { AVAILABILITY_LABELS } from "@/lib/profile-utils";
import { getTurnstileSiteKey } from "@/lib/turnstile";
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Globe,
  Link2,
  MapPin,
  Star,
} from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) return { title: "Expert not found" };

  return {
    title: `${profile.fullName} | AI Experts | AI Jobs Market`,
    description:
      profile.headline ??
      `${profile.fullName} — AI expert available for hire in the UK.`,
  };
}

export default async function FreelancerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) notFound();

  await incrementProfileViews(profile.id);

  const turnstileSiteKey = getTurnstileSiteKey();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    description: profile.headline ?? profile.bio,
    url: `https://aijobsmarket.co.uk/freelancers/${profile.slug}`,
    ...(profile.profileImageUrl && { image: profile.profileImageUrl }),
    ...(profile.location && {
      address: { "@type": "PostalAddress", addressLocality: profile.location },
    }),
    knowsAbout: profile.skills.map((s) => s.skill.name),
  };

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/freelancers"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to directory
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {profile.profileImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profileImageUrl}
            alt={profile.fullName}
            className="h-28 w-28 shrink-0 rounded-full object-cover ring-4 ring-border"
          />
        ) : (
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary ring-4 ring-border">
            {initials}
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-secondary">
              {profile.fullName}
            </h1>
            {profile.featured && (
              <Badge variant="featured" className="gap-1">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </Badge>
            )}
          </div>

          {profile.headline && (
            <p className="mt-2 text-lg text-muted">{profile.headline}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            {profile.location && (
              <span className="flex items-center gap-1 text-muted">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
            )}
            {profile.hourlyRate != null && (
              <span className="font-semibold text-slate-800">
                £{profile.hourlyRate}/hr
              </span>
            )}
            {profile.availability && (
              <span
                className={
                  profile.availability === "available"
                    ? "font-medium text-emerald-600"
                    : "text-muted"
                }
              >
                {AVAILABILITY_LABELS[profile.availability] ??
                  profile.availability}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {profile.linkedinUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link2 className="h-4 w-4" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              </Button>
            )}
            {profile.githubUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              </Button>
            )}
            {profile.websiteUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-4 w-4" />
                  Website
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {profile.bio && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-slate-700">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {profile.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(({ skill }) => (
                  <Link
                    key={skill.id}
                    href={`/freelancers?skill=${skill.slug}`}
                  >
                    <Badge variant="secondary" className="hover:bg-primary/10">
                      {skill.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {profile.services.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.services.map(({ service }) => (
                  <Link
                    key={service.id}
                    href={`/freelancers?service=${service.slug}`}
                  >
                    <Badge variant="secondary" className="hover:bg-primary/10">
                      {service.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Contact {profile.fullName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm
            freelancerId={profile.id}
            freelancerName={profile.fullName}
            turnstileSiteKey={turnstileSiteKey}
          />
        </CardContent>
      </Card>
    </div>
  );
}
