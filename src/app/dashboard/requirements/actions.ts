"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthIdentity, requireUser } from "@/lib/auth";
import {
  closeRequirement,
  createRequirement,
  deleteRequirement,
  getRequirementById,
  publishRequirement,
  updateRequirement,
} from "@/lib/requirements";
import {
  parseRequirementFormData,
  type RequirementFormState,
} from "@/lib/validations/requirement";

function parseRequirementForm(formData: FormData) {
  return parseRequirementFormData(formData);
}

async function requireVerifiedUser() {
  const user = await requireUser();
  const identity = await getAuthIdentity();
  if (!identity?.emailVerified) {
    throw new Error("Verify your email before posting requirements.");
  }
  return user;
}

function revalidateRequirement(id: number) {
  revalidatePath("/dashboard/requirements");
  revalidatePath(`/dashboard/requirements/${id}`);
  revalidatePath(`/tasks/${id}`);
  revalidatePath("/tasks");
}

export async function saveRequirementAction(
  _prev: RequirementFormState,
  formData: FormData
): Promise<RequirementFormState> {
  let user;
  try {
    user = await requireVerifiedUser();
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Something went wrong. Try again.",
    };
  }

  const parsed = parseRequirementForm(formData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const existingId = Number(formData.get("requirementId"));
  const publish = formData.get("publish") === "true";
  let redirectTo: string;

  try {
    if (existingId) {
      const existing = await getRequirementById(existingId);
      await updateRequirement(existingId, user.id, parsed.data);
      if (publish) {
        await publishRequirement(existingId, user.id);
        redirectTo = `/tasks/${existingId}?live=1`;
      } else if (existing?.status === "open") {
        redirectTo = `/tasks/${existingId}?live=1`;
      } else {
        redirectTo = "/dashboard/requirements?saved=1";
      }
      revalidateRequirement(existingId);
    } else {
      const id = await createRequirement(user.id, parsed.data, publish);
      revalidateRequirement(id);
      redirectTo = publish
        ? `/tasks/${id}?live=1`
        : "/dashboard/requirements?saved=1";
    }
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Something went wrong. Try again.",
    };
  }

  redirect(redirectTo);
}

export async function publishRequirementAction(
  requirementId: number
): Promise<{ error?: string }> {
  try {
    const user = await requireVerifiedUser();
    await publishRequirement(requirementId, user.id);
    revalidateRequirement(requirementId);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not publish.",
    };
  }

  redirect(`/tasks/${requirementId}?live=1`);
}

export async function closeRequirementAction(
  requirementId: number,
  status: "closed" | "filled" = "closed"
): Promise<{ error?: string }> {
  try {
    const user = await requireUser();
    await closeRequirement(requirementId, user.id, status);
    revalidateRequirement(requirementId);
    return {};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not close requirement.",
    };
  }
}

export async function deleteRequirementAction(
  requirementId: number
): Promise<{ error?: string }> {
  try {
    const user = await requireUser();
    await deleteRequirement(requirementId, user.id);
    revalidatePath("/dashboard/requirements");
    revalidatePath(`/dashboard/requirements/${requirementId}`);
    revalidatePath(`/tasks/${requirementId}`);
    revalidatePath("/tasks");
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Could not delete requirement.",
    };
  }

  redirect("/dashboard/requirements?deleted=1");
}
