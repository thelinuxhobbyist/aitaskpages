import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/app/experts/[slug]/contact-form";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthIdentity, getOrCreateUser } from "@/lib/auth";
import { getProfileBySlug, incrementProfileViews } from "@/lib/directory";
import { AVAILABILITY_LABELS } from "@/lib/profile-utils";
import { absoluteUrl, createPageMetadata, SITE_NAME } from "@/lib/seo";
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

  const description =
    profile.headline ??
    `${profile.fullName} — AI expert available for hire in the UK on ${SITE_NAME}.`;

  return createPageMetadata({
    title: `${profile.fullName} — AI expert`,
    description,
    path: `/experts/${profile.slug}`,
  });
}

export default async function ExpertProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) notFound();

  await incrementProfileViews(profile.id);

  const identity = await getAuthIdentity();
  const viewer = identity ? await getOrCreateUser() : null;
  const isOwner = !!viewer && viewer.id === profile.userId;
  const turnstileSiteKey = getTurnstileSiteKey();
  const profilePath = `/experts/${profile.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    description: profile.headline ?? profile.bio,
    url: absoluteUrl(`/experts/${profile.slug}`),
    ...(profile.profileImageUrl && { image: profile.profileImageUrl }),
    ...(profile.location && {
      address: { "@type": "PostalAddress", addressLocality: profile.location },
    }),
    knowsAbout: profile.skills.map((s) => s.skill.name),
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to directory
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar
          src={profile.profileImageUrl}
          alt={profile.fullName}
          className="h-28 w-28 ring-4"
          textClassName="text-3xl"
        />

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
                    href={`/search?skill=${skill.slug}`}
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
                    href={`/search?service=${service.slug}`}
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
          <CardTitle className="text-base">
            {isOwner ? "Your profile" : `Contact ${profile.fullName}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isOwner ? (
            <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-8 text-center">
              <p className="text-base font-semibold text-secondary">
                This is how your profile appears to visitors
              </p>
              <p className="mt-2 text-sm text-muted">
                You can&apos;t send an enquiry to yourself. Visitors will see a
                contact form here.
              </p>
              <div className="mt-5 flex justify-center">
                <Button asChild>
                  <Link href="/dashboard">Edit your profile</Link>
                </Button>
              </div>
            </div>
          ) : !identity ? (
            <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-8 text-center">
              <p className="text-base font-semibold text-secondary">
                Sign in to contact {profile.fullName}
              </p>
              <p className="mt-2 text-sm text-muted">
                We ask senders to sign in first. It only takes a moment and
                keeps spam away from our experts.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Button asChild>
                  <Link href={`/sign-in?redirect_url=${encodeURIComponent(profilePath)}`}>
                    Sign in
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/sign-up?redirect_url=${encodeURIComponent(profilePath)}`}>
                    Create an account
                  </Link>
                </Button>
              </div>
            </div>
          ) : !identity.emailVerified ? (
            <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-6 py-8 text-center">
              <p className="text-base font-semibold text-amber-900">
                Verify your email to contact experts
              </p>
              <p className="mt-2 text-sm text-amber-800">
                To keep enquiries genuine, please verify your email address
                before sending a message. Open the account menu in the top-right
                to verify it, then refresh this page.
              </p>
            </div>
          ) : (
            <ContactForm
              expertId={profile.id}
              expertName={profile.fullName}
              turnstileSiteKey={turnstileSiteKey}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
