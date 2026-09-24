"use client";

import Link from "next/link";
import { TaxonomyTagField } from "@/app/dashboard/taxonomy-tag-field";
import { saveRequirementAction } from "@/app/dashboard/requirements/actions";
import { FormErrorBanner } from "@/components/form-error-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RequirementWithRelations } from "@/lib/requirements";
import type { FinderTaskDraft } from "@/lib/finder-task-draft";
import {
  isPlatformBoilerplateDescription,
  parseCustomServicesFromDraft,
  parseCustomSkillsFromDraft,
} from "@/lib/finder-task-draft";
import { parseCustomServices, parseCustomSkills } from "@/lib/profile-utils";
import {
  EMPTY_KEYWORD_MAP,
  MAX_TECHNOLOGIES,
  MAX_TOPIC_LENGTH,
  TECHNOLOGY_TOPICS,
} from "@/lib/expertise-topics";
import {
  MAX_SERVICE_TAG_LENGTH,
  MAX_SKILL_TAG_LENGTH,
  MAX_TASK_SERVICES,
  MAX_TASK_SKILLS,
  SERVICE_KEYWORDS,
  SKILL_KEYWORDS,
} from "@/lib/taxonomy-map";
import { useFriendlyActionState } from "@/lib/use-friendly-action-state";
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

function initialSkillTags(
  requirement?: RequirementWithRelations | null,
  finderDraft?: FinderTaskDraft | null
): string[] {
  const stored = parseCustomSkills(requirement?.customSkills);
  if (stored.length > 0) return stored;
  if (requirement?.skills.length) {
    return requirement.skills.map((s) => s.skill.name);
  }
  return parseCustomSkillsFromDraft(finderDraft?.customSkills);
}

function initialServiceTags(
  requirement?: RequirementWithRelations | null,
  finderDraft?: FinderTaskDraft | null
): string[] {
  const stored = parseCustomServices(requirement?.customServices);
  if (stored.length > 0) return stored;
  if (requirement?.services.length) {
    return requirement.services.map((s) => s.service.name);
  }
  return parseCustomServicesFromDraft(finderDraft?.customServices);
}

function initialDescription(
  requirement?: RequirementWithRelations | null,
  finderDraft?: FinderTaskDraft | null
): string {
  if (requirement?.description) return requirement.description;
  const draft = finderDraft?.description ?? "";
  if (isPlatformBoilerplateDescription(draft)) return "";
  return draft;
}

export function RequirementForm({
  requirement,
  skills,
  services,
  finderDraft,
  cancelHref = "/dashboard/requirements",
}: Props) {
  const [state, formAction, pending] = useFriendlyActionState(
    saveRequirementAction,
    initialState,
    "We couldn't save your task. Please try again."
  );

  const isDraft = !requirement || requirement.status === "draft";

  return (
    <form action={formAction} className="space-y-8">
      {requirement && (
        <input type="hidden" name="requirementId" value={requirement.id} />
      )}

      {state.error && <FormErrorBanner message={state.error} />}

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

      <section className="space-y-4">
        {requirement && (
          <h3 className="text-sm font-medium text-slate-700">Task details</h3>
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
          <p className="text-xs text-muted">
            Tell us what you&apos;re trying to achieve, what you already have, and
            what kind of help you&apos;re looking for.
          </p>
          <Textarea
            id="description"
            name="description"
            rows={8}
            required
            placeholder="Focus on the actual requirement — not a company or platform overview."
            defaultValue={initialDescription(requirement, finderDraft)}
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
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-slate-700">Practical details</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="budget">Estimated budget</Label>
            <Input
              id="budget"
              name="budget"
              placeholder="e.g. £4,000, $6,000, or to discuss"
              defaultValue={requirement?.budget ?? ""}
            />
            <p className="text-xs text-muted">
              Include a currency if you have a figure in mind. This is a guide,
              not a quote or a job post.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              name="industry"
              placeholder="e.g. Dental / Healthcare"
              defaultValue={requirement?.industry ?? ""}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="problem">AI problem / use case</Label>
            <Textarea
              id="problem"
              name="problem"
              rows={3}
              placeholder="e.g. High volume of incoming calls, and the team is spending too long on routine booking."
              defaultValue={requirement?.problem ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Input
              id="timeline"
              name="timeline"
              placeholder="e.g. Pilot in the next 6–8 weeks"
              defaultValue={requirement?.timeline ?? ""}
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
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-slate-700">Expertise</h3>

        <TaxonomyTagField
          name="technologies"
          label="Technologies / integrations"
          description="Platforms or systems the work needs to connect with. Optional."
          placeholder="e.g. Twilio, practice management software"
          itemNoun="technology"
          catalog={TECHNOLOGY_TOPICS}
          keywords={EMPTY_KEYWORD_MAP}
          maxItems={MAX_TECHNOLOGIES}
          maxLength={MAX_TOPIC_LENGTH}
          initialItems={parseCustomSkills(requirement?.technologies)}
        />

        <TaxonomyTagField
          name="customSkills"
          label="What expertise do you need?"
          description="Add skills, technologies or areas of expertise relevant to your task."
          placeholder="e.g. Python, RAG, AI agents"
          itemNoun="skill"
          catalog={skills}
          keywords={SKILL_KEYWORDS}
          maxItems={MAX_TASK_SKILLS}
          maxLength={MAX_SKILL_TAG_LENGTH}
          initialItems={initialSkillTags(requirement, finderDraft)}
        />

        <TaxonomyTagField
          name="customServices"
          label="What kind of help are you looking for?"
          description="Describe the service, project or outcome you need help with."
          placeholder="e.g. Build an internal chatbot"
          itemNoun="service"
          catalog={services}
          keywords={SERVICE_KEYWORDS}
          maxItems={MAX_TASK_SERVICES}
          maxLength={MAX_SERVICE_TAG_LENGTH}
          initialItems={initialServiceTags(requirement, finderDraft)}
        />
      </section>

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
              {pending ? "Publishing…" : "Publish task"}
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
