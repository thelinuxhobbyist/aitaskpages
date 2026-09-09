"use client";

import { useActionState, useState } from "react";
import { saveProfile } from "@/app/dashboard/actions";
import { AvatarUpload } from "@/app/dashboard/avatar-upload";
import { CustomSkillsField } from "@/app/dashboard/custom-skills-field";
import { CustomServicesField } from "@/app/dashboard/custom-services-field";
import { ProfileTypePicker } from "@/app/dashboard/profile-type-picker";
import { ExternalLinksField } from "@/app/dashboard/external-links-field";
import { WorkExamplesField } from "@/app/dashboard/work-examples-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileFormState } from "@/lib/validations/profile";
import {
  parseCustomSkills,
  parseCustomServices,
  parseExternalLinks,
  parseWorkExamples,
} from "@/lib/profile-utils";
import {
  parseProfileType,
  PROFILE_TYPE_LABELS,
  type ProfileType,
} from "@/lib/profile-type";
import type { ExpertProfile, Service, Skill } from "@/db/schema";

type ProfileWithRelations = ExpertProfile & {
  skills: { skill: Skill }[];
  services: { service: Service }[];
};

type Props = {
  profile: ProfileWithRelations | null;
  skills: Skill[];
  services: Service[];
};

const initialState: ProfileFormState = {};
const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
] as const;

export function ProfileForm({ profile, skills, services }: Props) {
  const [state, formAction, pending] = useActionState(
    saveProfile,
    initialState
  );
  const [profileType, setProfileType] = useState<ProfileType | null>(
    profile ? parseProfileType(profile.profileType) : null
  );

  const selectedSkillIds = new Set(
    profile?.skills.map((s) => s.skill.id) ?? []
  );
  const selectedServiceIds = new Set(
    profile?.services.map((s) => s.service.id) ?? []
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
      {state.success && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Profile saved successfully.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface-container/50 px-4 py-3">
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
            placeholder="e.g. London, UK"
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

      <fieldset className="space-y-4 rounded-xl border border-border bg-surface-container/20 p-4 sm:p-5">
        <div>
          <legend className="text-sm font-medium text-slate-700">
            Where to find you online
          </legend>
          <p className="mt-1 text-xs text-muted">
            Your presence links — LinkedIn, GitHub, website, and other profiles.
            These show who you are, not individual projects. For project
            showcases, use Examples of work below.
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
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700">
          {isCompany ? "Areas of expertise" : "Skills"}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <label
              key={skill.id}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
            >
              <input
                type="checkbox"
                name="skillIds"
                value={String(skill.id)}
                defaultChecked={selectedSkillIds.has(skill.id)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              {skill.name}
            </label>
          ))}
        </div>
        <CustomSkillsField
          initialSkills={parseCustomSkills(profile?.customSkills)}
        />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700">
          {isCompany ? "Services / capabilities" : "Services"}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <label
              key={service.id}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
            >
              <input
                type="checkbox"
                name="serviceIds"
                value={String(service.id)}
                defaultChecked={selectedServiceIds.has(service.id)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              {service.name}
            </label>
          ))}
        </div>
        <CustomServicesField
          initialServices={parseCustomServices(profile?.customServices)}
        />
      </fieldset>

      <WorkExamplesField
        initialExamples={parseWorkExamples(profile?.workExamples)}
      />

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : profile ? "Update profile" : "Create profile"}
      </Button>
    </form>
  );
}
