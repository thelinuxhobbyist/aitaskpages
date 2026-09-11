"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CustomSkillsField } from "@/app/dashboard/custom-skills-field";
import { saveRequirementAction } from "@/app/dashboard/requirements/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RequirementWithRelations } from "@/lib/requirements";
import type { FinderTaskDraft } from "@/lib/finder-task-draft";
import { parseCustomSkillsFromDraft } from "@/lib/finder-task-draft";
import type { RequirementFormState } from "@/lib/validations/requirement";
import type { Service, Skill } from "@/db/schema";

type Props = {
  requirement?: RequirementWithRelations | null;
  skills: Skill[];
  services: Service[];
  finderDraft?: FinderTaskDraft | null;
  cancelHref?: string;
};

const initialState: RequirementFormState = {};

export function RequirementForm({
  requirement,
  skills,
  services,
  finderDraft,
  cancelHref = "/dashboard/requirements",
}: Props) {
  const [state, formAction, pending] = useActionState(
    saveRequirementAction,
    initialState
  );

  const isDraft = !requirement || requirement.status === "draft";
  const selectedSkillIds = new Set(
    requirement?.skills.map((s) => s.skill.id) ?? []
  );
  const selectedServiceIds = new Set(
    requirement?.services.map((s) => s.service.id) ?? []
  );
  const initialCustomSkills = finderDraft
    ? parseCustomSkillsFromDraft(finderDraft.customSkills)
    : [];

  return (
    <form action={formAction} className="space-y-6">
      {requirement && (
        <input type="hidden" name="requirementId" value={requirement.id} />
      )}

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <p className="rounded-lg bg-surface px-4 py-3 text-sm text-muted">
        Published tasks appear in the public{" "}
        <Link href="/tasks" className="font-medium text-primary hover:underline">
          tasks directory
        </Link>
        . Your company name is shown on the listing; personal contact details
        are kept private until you choose to connect with an expert.
      </p>

      {finderDraft && (
        <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          Imported from AI Software Finder. Most of your project brief is already
          filled in — review the title and description, add your company name, then
          publish.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="e.g. LLM fine-tuning for customer support chatbot"
          defaultValue={requirement?.title ?? finderDraft?.title ?? ""}
        />
        {state.fieldErrors?.title && (
          <p className="text-sm text-red-600">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          rows={8}
          required
          placeholder="Describe what you need, timeline, technical context, and any constraints…"
          defaultValue={requirement?.description ?? finderDraft?.description ?? ""}
        />
        {state.fieldErrors?.description && (
          <p className="text-sm text-red-600">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company name (shown publicly) *</Label>
        <Input
          id="companyName"
          name="companyName"
          required
          placeholder="e.g. Acme Dental Ltd"
          defaultValue={requirement?.companyName ?? finderDraft?.companyName ?? ""}
        />
        {state.fieldErrors?.companyName && (
          <p className="text-sm text-red-600">
            {state.fieldErrors.companyName[0]}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="budget">Estimated budget (£)</Label>
          <Input
            id="budget"
            name="budget"
            placeholder="e.g. 15000"
            defaultValue={requirement?.budget ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. Remote, or city and country"
            defaultValue={requirement?.location ?? ""}
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="remoteOk"
            name="remoteOk"
            defaultChecked={requirement?.remoteOk ?? finderDraft?.remoteOk ?? false}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <Label htmlFor="remoteOk" className="font-normal">
            Remote work is acceptable
          </Label>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700">
          Required skills
        </legend>
        <p className="text-xs text-muted">
          Matching experts are notified based on skills and services overlap.
        </p>
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
        <CustomSkillsField initialSkills={initialCustomSkills} />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700">
          Services needed
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
      </fieldset>

      <div className="flex flex-wrap gap-3">
        {isDraft && (
          <>
            <Button type="submit" name="publish" value="false" disabled={pending}>
              {pending ? "Saving…" : "Save draft"}
            </Button>
            <Button
              type="submit"
              name="publish"
              value="true"
              disabled={pending}
            >
              {pending ? "Publishing…" : "Publish requirement"}
            </Button>
          </>
        )}
        {!isDraft && (
          <Button type="submit" name="publish" value="false" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        )}
        <Button type="button" variant="ghost" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
