import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ContactForm } from "@/app/experts/[slug]/contact-form";
import { ReadMoreBio } from "@/components/expert/read-more-bio";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthIdentity, getOrCreateUser } from "@/lib/auth";
import { getProfileBySlug, incrementProfileViews } from "@/lib/directory";
import { AVAILABILITY_LABELS, parseCustomSkills, parseCustomServices } from "@/lib/profile-utils";
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
    `${profile.fullName} is an independent AI expert on ${SITE_NAME}. Hire for AI consulting, automation, integrations or custom AI projects in the UK.`;

  return createPageMetadata({
    title: `${profile.fullName} — AI expert`,
    description,
    path: `/experts/${profile.slug}`,
  });
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border py-8 first:border-t-0 first:pt-0">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
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
  const customSkills = parseCustomSkills(profile.customSkills);
  const customServices = parseCustomServices(profile.customServices);

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
    knowsAbout: [
      ...profile.skills.map((s) => s.skill.name),
      ...customSkills,
    ],
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };

  return (
    <>
      <section className="border-b border-border bg-surface-container">
        <div className="mx-auto max-w-4xl px-4 pb-8 pt-6">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>

          <header className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar
              src={profile.profileImageUrl}
              alt={profile.fullName}
              className="h-24 w-24 shrink-0 md:h-28 md:w-28"
              textClassName="text-3xl"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
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

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {profile.location && (
                  <span className="flex items-center gap-1 text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
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
                {profile.hourlyRate != null && (
                  <span className="font-semibold text-on-surface">
                    £{profile.hourlyRate}/hr
                  </span>
                )}
              </div>
            </div>
          </header>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="flex flex-wrap gap-2">
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
        </div>

        {profile.bio && (
          <ProfileSection title="About">
            <ReadMoreBio text={profile.bio} />
          </ProfileSection>
        )}

      {(profile.skills.length > 0 || customSkills.length > 0) && (
        <ProfileSection title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map(({ skill }) => (
              <Link key={skill.id} href={`/search?skill=${skill.slug}`}>
                <Badge variant="secondary" className="hover:bg-stone-200">
                  {skill.name}
                </Badge>
              </Link>
            ))}
            {customSkills.map((name) => (
              <Link
                key={name}
                href={`/search?q=${encodeURIComponent(name)}`}
              >
                <Badge variant="secondary" className="hover:bg-stone-200">
                  {name}
                </Badge>
              </Link>
            ))}
          </div>
        </ProfileSection>
      )}

      {profile.services.length > 0 || customServices.length > 0 ? (
        <ProfileSection title="Services">
          <div className="flex flex-wrap gap-1.5">
            {profile.services.map(({ service }) => (
              <Link key={service.id} href={`/search?service=${service.slug}`}>
                <Badge variant="default" className="hover:bg-stone-200">
                  {service.name}
                </Badge>
              </Link>
            ))}
            {customServices.map((name) => (
              <Link
                key={name}
                href={`/search?q=${encodeURIComponent(name)}`}
              >
                <Badge variant="default" className="hover:bg-stone-200">
                  {name}
                </Badge>
              </Link>
            ))}
          </div>
        </ProfileSection>
      ) : null}

        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-secondary">
            {isOwner ? "Your profile" : `Contact ${profile.fullName}`}
          </h2>

          {isOwner ? (
            <div className="mt-4 rounded-xl border border-dashed border-border bg-surface px-5 py-6">
              <p className="text-sm text-muted">
                This is how your profile appears to visitors. Edit your details
                from the dashboard.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">Edit profile</Link>
              </Button>
            </div>
          ) : !identity ? (
            <div className="mt-4 rounded-xl border border-border bg-surface px-5 py-6">
              <p className="text-sm text-muted">
                Sign in to contact this AI expert. Businesses can reach experts
                directly through AI Jobs Market while keeping personal contact
                details private.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link
                    href={`/sign-in?redirect_url=${encodeURIComponent(profilePath)}`}
                  >
                    Sign in
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link
                    href={`/sign-up?redirect_url=${encodeURIComponent(profilePath)}`}
                  >
                    Create account
                  </Link>
                </Button>
              </div>
            </div>
          ) : !identity.emailVerified ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-6">
              <p className="text-sm font-medium text-amber-900">
                Verify your email to contact experts
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Open the account menu in the top-right to verify your email, then
                refresh this page.
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <ContactForm
                expertId={profile.id}
                expertName={profile.fullName}
                turnstileSiteKey={turnstileSiteKey}
              />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
