"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthIdentity, requireUser } from "@/lib/auth";
import {
  closeRequirement,
  createRequirement,
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
      await updateRequirement(existingId, user.id, parsed.data);
      if (publish) {
        await publishRequirement(existingId, user.id);
      }
      revalidatePath("/dashboard/requirements");
      revalidatePath(`/dashboard/requirements/${existingId}`);
      revalidatePath(`/requirements/${existingId}`);
      revalidatePath("/requirements");
      redirectTo = `/dashboard/requirements/${existingId}`;
    } else {
      const id = await createRequirement(user.id, parsed.data, publish);
      revalidatePath("/dashboard/requirements");
      revalidatePath(`/requirements/${id}`);
      revalidatePath("/requirements");
      redirectTo = `/dashboard/requirements/${id}`;
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
    revalidatePath("/dashboard/requirements");
    revalidatePath(`/dashboard/requirements/${requirementId}`);
    revalidatePath(`/requirements/${requirementId}`);
    revalidatePath("/requirements");
    return {};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not publish.",
    };
  }
}

export async function closeRequirementAction(
  requirementId: number,
  status: "closed" | "filled" = "closed"
): Promise<{ error?: string }> {
  try {
    const user = await requireUser();
    await closeRequirement(requirementId, user.id, status);
    revalidatePath("/dashboard/requirements");
    revalidatePath(`/dashboard/requirements/${requirementId}`);
    revalidatePath(`/requirements/${requirementId}`);
    revalidatePath("/requirements");
    return {};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not close requirement.",
    };
  }
}
