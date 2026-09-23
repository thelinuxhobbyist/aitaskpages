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
import {
  AVAILABILITY_LABELS,
  getProfileServiceDisplayTags,
  getProfileServiceLabels,
  getProfileSkillDisplayTags,
  getProfileSkillLabels,
  parseExternalLinks,
  parseWorkExamples,
} from "@/lib/profile-utils";
import { ProfileTypeBadge } from "@/components/expert/profile-type-badge";
import { isCompanyProfile, profileTypeLabel } from "@/lib/profile-type";
import { formatHourlyRate } from "@/lib/currency";
import { PageHero } from "@/components/page-hero";
import { SuccessBanner } from "@/components/ui/success-banner";
import {
  absoluteUrl,
  createPageMetadata,
  expertProfileDescription,
  expertProfileTitle,
  SITE_NAME,
} from "@/lib/seo";
import { getTurnstileSiteKey } from "@/lib/turnstile";
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Globe,
  Link2,
  MapPin,
  Users,
} from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function linkHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "External link";
  }
}

function PresenceLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Globe;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-[0.8125rem] font-medium text-on-surface shadow-soft transition-colors hover:bg-surface-container"
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="min-w-0 truncate">{label}</span>
      <ExternalLink className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
    </a>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) return { title: "Expert not found" };

  const company = isCompanyProfile(profile);

  return createPageMetadata({
    title: expertProfileTitle(profile.fullName, {
      company,
      headline: profile.headline,
    }),
    description: expertProfileDescription(profile.fullName, {
      company,
      headline: profile.headline,
      bio: profile.bio,
      skillLabels: getProfileSkillLabels(profile),
    }),
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

export default async function ExpertProfilePage({
  params,
  searchParams,
}: PageProps & {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) notFound();

  await incrementProfileViews(profile.id);

  const identity = await getAuthIdentity();
  const viewer = identity ? await getOrCreateUser() : null;
  const isOwner = !!viewer && viewer.id === profile.userId;
  const notice = await searchParams;
  const showCreated = isOwner && notice.created === "1";
  const showUpdated = isOwner && notice.updated === "1";
  const turnstileSiteKey = getTurnstileSiteKey();
  const profilePath = `/experts/${profile.slug}`;
  const customSkills = getProfileSkillLabels(profile);
  const customServices = getProfileServiceLabels(profile);
  const skillTags = getProfileSkillDisplayTags(profile);
  const serviceTags = getProfileServiceDisplayTags(profile);
  const externalLinks = parseExternalLinks(profile.externalLinks);
  const workExamples = parseWorkExamples(profile.workExamples);
  const company = isCompanyProfile(profile);
  const typeLabel = profileTypeLabel(profile);
  const hasExternalLinks = Boolean(
    profile.githubUrl ||
      profile.websiteUrl ||
      profile.linkedinUrl ||
      externalLinks.length > 0
  );
  const aboutTitle = company ? "About the company" : "About";
  const skillsTitle = company ? "Areas of expertise" : "Skills";
  const servicesTitle = company ? "Services / capabilities" : "Services";
  const contactTitle = isOwner
    ? "Your profile"
    : company
      ? `Connect with ${profile.fullName}`
      : `Contact ${profile.fullName}`;

  const jsonLd = company
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: profile.fullName,
        description: profile.headline ?? profile.bio,
        url: absoluteUrl(`/experts/${profile.slug}`),
        ...(profile.profileImageUrl && { image: profile.profileImageUrl }),
        ...(profile.location && {
          address: {
            "@type": "PostalAddress",
            addressLocality: profile.location,
          },
        }),
        knowsAbout: [...customSkills, ...customServices],
      }
    : {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.fullName,
        description: profile.headline ?? profile.bio,
        url: absoluteUrl(`/experts/${profile.slug}`),
        ...(profile.profileImageUrl && { image: profile.profileImageUrl }),
        ...(profile.location && {
          address: { "@type": "PostalAddress", addressLocality: profile.location },
        }),
        knowsAbout: [...customSkills, ...customServices],
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl("/"),
        },
      };

  return (
    <>
      <PageHero innerClassName="max-w-4xl px-4 py-6 md:py-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>

          {(showCreated || showUpdated) && (
            <div className="mt-6">
              <SuccessBanner
                title={
                  showCreated
                    ? company
                      ? "Your company profile is now live."
                      : "Your profile is now live."
                    : company
                      ? "Your company profile has been updated."
                      : "Your profile has been updated."
                }
              >
                {showCreated ? (
                  <p>
                    Businesses can find you in{" "}
                    <Link
                      href="/search"
                      className="font-medium underline underline-offset-2"
                    >
                      Find AI Expertise
                    </Link>
                    . You can edit your profile any time from the{" "}
                    <Link
                      href="/dashboard"
                      className="font-medium underline underline-offset-2"
                    >
                      dashboard
                    </Link>
                    .
                  </p>
                ) : (
                  <p>
                    This is how you appear to businesses. Edit it from the{" "}
                    <Link
                      href="/dashboard"
                      className="font-medium underline underline-offset-2"
                    >
                      dashboard
                    </Link>
                    .
                  </p>
                )}
              </SuccessBanner>
            </div>
          )}

          <header className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar
              src={profile.profileImageUrl}
              alt={profile.fullName}
              className="h-24 w-24 shrink-0 md:h-28 md:w-28"
              textClassName="text-3xl"
            />

            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
                {profile.fullName}
              </h1>
              <div className="mt-3">
                <ProfileTypeBadge
                  label={typeLabel}
                  className="px-2.5 py-1 text-xs"
                />
              </div>
              {profile.headline?.trim() && (
                <p className="mt-2 text-lg text-muted">{profile.headline.trim()}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {profile.location && (
                  <span className="flex items-center gap-1 text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                )}
                {company && profile.companySize && (
                  <span className="flex items-center gap-1 text-muted">
                    <Users className="h-3.5 w-3.5" />
                    {profile.companySize} team
                  </span>
                )}
                {company && profile.yearEstablished != null && (
                  <span className="text-muted">Est. {profile.yearEstablished}</span>
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
                    {formatHourlyRate(
                      profile.hourlyRate,
                      profile.hourlyRateCurrency
                    )}
                  </span>
                )}
              </div>
            </div>
          </header>
      </PageHero>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {hasExternalLinks && (
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-secondary">
              {company ? "Company online" : "Online"}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.linkedinUrl && (
                <PresenceLink
                  href={profile.linkedinUrl}
                  label="LinkedIn"
                  icon={Link2}
                />
              )}
              {profile.websiteUrl && (
                <PresenceLink
                  href={profile.websiteUrl}
                  label="Website"
                  icon={Globe}
                />
              )}
              {profile.githubUrl && (
                <PresenceLink
                  href={profile.githubUrl}
                  label="GitHub"
                  icon={Code2}
                />
              )}
              {externalLinks.map((url) => (
                <PresenceLink
                  key={url}
                  href={url}
                  label={linkHostname(url)}
                  icon={Globe}
                />
              ))}
            </div>
          </div>
        )}

        {profile.bio && (
          <ProfileSection title={aboutTitle}>
            <ReadMoreBio text={profile.bio} />
          </ProfileSection>
        )}

      {skillTags.length > 0 && (
        <ProfileSection title={skillsTitle}>
          <div className="flex flex-wrap gap-1.5">
            {skillTags.map((tag) => (
              <Link key={tag.name} href={tag.href}>
                <Badge variant="secondary" className="hover:bg-stone-200">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </ProfileSection>
      )}

      {serviceTags.length > 0 ? (
        <ProfileSection title={servicesTitle}>
          <div className="flex flex-wrap gap-1.5">
            {serviceTags.map((tag) => (
              <Link key={tag.name} href={tag.href}>
                <Badge variant="default" className="hover:bg-stone-200">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </ProfileSection>
      ) : null}

      {workExamples.length > 0 && (
        <ProfileSection title="Examples of work">
          <ul className="space-y-5">
            {workExamples.map((example) => (
              <li key={`${example.title}-${example.url}`}>
                <p className="font-medium text-secondary">{example.title}</p>
                {example.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {example.description}
                  </p>
                )}
                <a
                  href={example.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View work →
                </a>
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}

        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-secondary">{contactTitle}</h2>

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
                {company
                  ? "Sign in to connect with this company. Businesses can reach AI professionals and companies directly through AI Task Pages while keeping personal contact details private."
                  : "Sign in to contact this AI expert. Businesses can reach AI professionals and companies directly through AI Task Pages while keeping personal contact details private."}
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
                Verify your email to get in touch
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
