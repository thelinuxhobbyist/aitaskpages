"use server";

import { revalidatePath } from "next/cache";
import { getAuthIdentity, requireUser } from "@/lib/auth";
import { createProfile, updateProfile } from "@/lib/profiles";
import {
  profileSchema,
  type ProfileFormState,
} from "@/lib/validations/profile";

export async function saveProfile(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await requireUser();

  const identity = await getAuthIdentity();
  if (!identity?.emailVerified) {
    return {
      error:
        "Please verify your email address before creating or editing your profile.",
    };
  }

  const raw = {
    fullName: formData.get("fullName"),
    headline: formData.get("headline") ?? "",
    bio: formData.get("bio") ?? "",
    location: formData.get("location") ?? "",
    hourlyRate: formData.get("hourlyRate") ?? "",
    availability: formData.get("availability") ?? "",
    linkedinUrl: formData.get("linkedinUrl") ?? "",
    githubUrl: formData.get("githubUrl") ?? "",
    websiteUrl: formData.get("websiteUrl") ?? "",
    profileImageUrl: formData.get("profileImageUrl") ?? "",
    skillIds: formData.getAll("skillIds"),
    serviceIds: formData.getAll("serviceIds"),
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  try {
    if (user.profile) {
      await updateProfile(user.profile, parsed.data);
    } else {
      await createProfile(user.id, parsed.data);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to save profile. Please try again." };
  }
}
