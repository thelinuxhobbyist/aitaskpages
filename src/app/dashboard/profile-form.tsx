"use client";

import { useActionState, useState } from "react";
import { saveProfile } from "@/app/dashboard/actions";
import { AvatarUpload } from "@/app/dashboard/avatar-upload";
import { ProfileTypePicker } from "@/app/dashboard/profile-type-picker";
import { ExternalLinksField } from "@/app/dashboard/external-links-field";
import { WorkExamplesField } from "@/app/dashboard/work-examples-field";
import { TaxonomyTagField } from "@/app/dashboard/taxonomy-tag-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileFormState } from "@/lib/validations/profile";
import {
  getProfileSkillLabels,
  getProfileServiceLabels,
  parseExternalLinks,
  parseWorkExamples,
} from "@/lib/profile-utils";
import {
  parseProfileType,
  PROFILE_TYPE_LABELS,
  type ProfileType,
} from "@/lib/profile-type";
import {
  MAX_PROFILE_SERVICES,
  MAX_PROFILE_SKILLS,
  MAX_SERVICE_TAG_LENGTH,
  MAX_SKILL_TAG_LENGTH,
  SERVICE_KEYWORDS,
  SKILL_KEYWORDS,
} from "@/lib/taxonomy-map";
import type { ExpertProfile, Service, Skill } from "@/db/schema";

type ProfileWithRelations = ExpertProfile & {
  skills: { skill: Skill }[];
  services: { service: Service }[];
};

type Props = {
  profile: ProfileWithRelations | null;
  skills: Skill[];
  services: Service[];
  initialProfileType?: ProfileType | null;
};

const initialState: ProfileFormState = {};
const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
] as const;

export function ProfileForm({
  profile,
  skills,
  services,
  initialProfileType = null,
}: Props) {
  const [state, formAction, pending] = useActionState(
    saveProfile,
    initialState
  );
  const [profileType, setProfileType] = useState<ProfileType | null>(
    profile
      ? parseProfileType(profile.profileType)
      : initialProfileType
  );

  if (!profileType) {
    return (
      <ProfileTypePicker
        onSelect={setProfileType}
        onCancel={
          profile
            ? () => setProfileType(parseProfileType(profile.profileType))
            : undefined
        }
      />
    );
  }

  const isCompany = profileType === "company";

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="profileType" value={profileType} />

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-sm text-on-surface">
          Profile type:{" "}
          <span className="font-semibold">
            {PROFILE_TYPE_LABELS[profileType]}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setProfileType(null)}
          className="text-sm font-medium text-primary hover:underline"
        >
          Change
        </button>
      </div>

      <div className="space-y-2">
        <Label>{isCompany ? "Company logo" : "Profile photo"}</Label>
        <AvatarUpload
          name={profile?.fullName ?? ""}
          defaultUrl={profile?.profileImageUrl}
          variant={isCompany ? "logo" : "photo"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fullName">
            {isCompany ? "Company name *" : "Full name *"}
          </Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={profile?.fullName ?? ""}
            required
          />
          {state.fieldErrors?.fullName && (
            <p className="text-sm text-red-600">{state.fieldErrors.fullName[0]}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="headline">
            {isCompany ? "Tagline / headline" : "Headline"}
          </Label>
          <Input
            id="headline"
            name="headline"
            placeholder={
              isCompany
                ? "e.g. AI Consultancy & Automation"
                : "e.g. ML Engineer specialising in LLMs"
            }
            defaultValue={profile?.headline ?? ""}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bio">{isCompany ? "About the company" : "Bio"}</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={5}
            placeholder={
              isCompany
                ? "Tell businesses about your team and the AI expertise you provide…"
                : "Tell businesses about your experience and expertise…"
            }
            defaultValue={profile?.bio ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. Remote, or city and country"
            defaultValue={profile?.location ?? ""}
          />
        </div>

        {isCompany && (
          <div className="space-y-2">
            <Label htmlFor="companySize">Company size</Label>
            <select
              id="companySize"
              name="companySize"
              defaultValue={profile?.companySize ?? ""}
              className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Select…</option>
              {COMPANY_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {isCompany && (
          <div className="space-y-2">
            <Label htmlFor="yearEstablished">Year established</Label>
            <Input
              id="yearEstablished"
              name="yearEstablished"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              placeholder="2019"
              defaultValue={profile?.yearEstablished ?? ""}
            />
          </div>
        )}

        {!isCompany && (
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly rate (£)</Label>
            <Input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              min={0}
              placeholder="150"
              defaultValue={profile?.hourlyRate ?? ""}
            />
          </div>
        )}

        {!isCompany && (
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <select
              id="availability"
              name="availability"
              defaultValue={profile?.availability ?? ""}
              className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Select…</option>
              <option value="available">Available now</option>
              <option value="limited">Limited availability</option>
              <option value="unavailable">Not available</option>
            </select>
          </div>
        )}
      </div>

      <fieldset className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <div>
          <legend className="text-sm font-medium text-slate-700">
            {isCompany
              ? "Where to find this company online"
              : "Where to find you online"}
          </legend>
          <p className="mt-1 text-xs text-muted">
            {isCompany
              ? "Company presence links — LinkedIn page, GitHub organisation, website, and other official profiles. These show where the company lives online, not individual case studies. For project showcases, use Examples of work below."
              : "Your presence links — LinkedIn, GitHub, website, and other profiles. These show who you are, not individual projects. For project showcases, use Examples of work below."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">
              {isCompany ? "Company LinkedIn" : "LinkedIn profile"}
            </Label>
            <Input
              id="linkedinUrl"
              name="linkedinUrl"
              type="text"
              inputMode="url"
              placeholder={
                isCompany ? "linkedin.com/company/…" : "linkedin.com/in/…"
              }
              defaultValue={profile?.linkedinUrl ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">
              {isCompany ? "GitHub organisation" : "GitHub profile"}
            </Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              type="text"
              inputMode="url"
              placeholder={
                isCompany ? "github.com/your-org" : "github.com/…"
              }
              defaultValue={profile?.githubUrl ?? ""}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="websiteUrl">
              {isCompany ? "Company website" : "Personal or portfolio website"}
            </Label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              type="text"
              inputMode="url"
              placeholder="example.com"
              defaultValue={profile?.websiteUrl ?? ""}
            />
          </div>

          <div className="sm:col-span-2">
            <ExternalLinksField
              initialLinks={parseExternalLinks(profile?.externalLinks)}
              isCompany={isCompany}
            />
          </div>
        </div>
      </fieldset>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-slate-700">Expertise</h3>

        <TaxonomyTagField
          name="customSkills"
          label={
            isCompany
              ? "What expertise does this company offer?"
              : "What expertise do you offer?"
          }
          description="Add skills, technologies or areas of expertise. You can pick from suggestions or type your own."
          placeholder="e.g. Python, RAG, AI agents"
          itemNoun="skill"
          catalog={skills}
          keywords={SKILL_KEYWORDS}
          maxItems={MAX_PROFILE_SKILLS}
          maxLength={MAX_SKILL_TAG_LENGTH}
          initialItems={profile ? getProfileSkillLabels(profile) : []}
        />

        <TaxonomyTagField
          name="customServices"
          label={
            isCompany
              ? "What kind of help does this company provide?"
              : "What kind of help do you provide?"
          }
          description="Describe the services, projects or outcomes you can help with. Suggestions are available, but your own wording is fine."
          placeholder="e.g. AI integration, chatbot development"
          itemNoun="service"
          catalog={services}
          keywords={SERVICE_KEYWORDS}
          maxItems={MAX_PROFILE_SERVICES}
          maxLength={MAX_SERVICE_TAG_LENGTH}
          initialItems={profile ? getProfileServiceLabels(profile) : []}
        />
      </section>

      <WorkExamplesField
        initialExamples={parseWorkExamples(profile?.workExamples)}
        isCompany={isCompany}
      />

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : profile ? "Update profile" : "Create profile"}
      </Button>
    </form>
  );
}
