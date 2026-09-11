"use server";

import { revalidatePath } from "next/cache";
import { getAuthIdentity, requireUser } from "@/lib/auth";
import { expressInterest, getRequirementById } from "@/lib/requirements";
import {
  interestSchema,
  type InterestFormState,
} from "@/lib/validations/requirement";

export async function expressInterestAction(
  _prev: InterestFormState,
  formData: FormData
): Promise<InterestFormState> {
  const user = await requireUser();

  if (!user.profile) {
    return { error: "Create an expert profile before expressing interest." };
  }

  const identity = await getAuthIdentity();
  if (!identity?.emailVerified) {
    return { error: "Verify your email before expressing interest." };
  }

  const parsed = interestSchema.safeParse({
    requirementId: formData.get("requirementId"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const requirement = await getRequirementById(parsed.data.requirementId);
  if (requirement?.clientUserId === user.id) {
    return { error: "You cannot express interest in your own requirement." };
  }

  try {
    await expressInterest({
      requirementId: parsed.data.requirementId,
      expertId: user.profile.id,
      expertUserId: user.id,
    });
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Could not express interest.",
    };
  }

  revalidatePath("/dashboard/opportunities");
  revalidatePath(`/tasks/${parsed.data.requirementId}`);
  return { success: true };
}
