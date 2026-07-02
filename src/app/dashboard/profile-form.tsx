"use client";

import { useActionState } from "react";
import { saveProfile } from "@/app/dashboard/actions";
import { AvatarUpload } from "@/app/dashboard/avatar-upload";
import { CustomSkillsField } from "@/app/dashboard/custom-skills-field";
import { CustomServicesField } from "@/app/dashboard/custom-services-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileFormState } from "@/lib/validations/profile";
import { parseCustomSkills, parseCustomServices } from "@/lib/profile-utils";
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

export function ProfileForm({ profile, skills, services }: Props) {
  const [state, formAction, pending] = useActionState(
    saveProfile,
    initialState
  );

  const selectedSkillIds = new Set(
    profile?.skills.map((s) => s.skill.id) ?? []
  );
  const selectedServiceIds = new Set(
    profile?.services.map((s) => s.service.id) ?? []
  );

  return (
    <form action={formAction} className="space-y-6">
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

      <div className="space-y-2">
        <Label>Profile photo</Label>
        <AvatarUpload
          name={profile?.fullName ?? ""}
          defaultUrl={profile?.profileImageUrl}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fullName">Full name *</Label>
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
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            name="headline"
            placeholder="e.g. ML Engineer specialising in LLMs"
            defaultValue={profile?.headline ?? ""}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={5}
            placeholder="Tell businesses about your experience and expertise…"
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

        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn</Label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="text"
            inputMode="url"
            placeholder="linkedin.com/in/…"
            defaultValue={profile?.linkedinUrl ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub</Label>
          <Input
            id="githubUrl"
            name="githubUrl"
            type="text"
            inputMode="url"
            placeholder="github.com/…"
            defaultValue={profile?.githubUrl ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website</Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="text"
            inputMode="url"
            placeholder="mywebsite.com"
            defaultValue={profile?.websiteUrl ?? ""}
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700">Skills</legend>
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
        <legend className="text-sm font-medium text-slate-700">Services</legend>
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

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : profile ? "Update profile" : "Create profile"}
      </Button>
    </form>
  );
}
