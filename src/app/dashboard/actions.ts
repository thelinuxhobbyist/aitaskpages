"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthIdentity, requireUser } from "@/lib/auth";
import {
  createProfile,
  hideProfile,
  restoreProfile,
  updateProfile,
} from "@/lib/profiles";
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
    profileType: formData.get("profileType") ?? "individual",
    fullName: formData.get("fullName"),
    headline: formData.get("headline") ?? "",
    bio: formData.get("bio") ?? "",
    location: formData.get("location") ?? "",
    hourlyRate: formData.get("hourlyRate") ?? "",
    hourlyRateCurrency: formData.get("hourlyRateCurrency") ?? "",
    companySize: formData.get("companySize") ?? "",
    yearEstablished: formData.get("yearEstablished") ?? "",
    availability: formData.get("availability") ?? "",
    linkedinUrl: formData.get("linkedinUrl") ?? "",
    githubUrl: formData.get("githubUrl") ?? "",
    websiteUrl: formData.get("websiteUrl") ?? "",
    externalLinks: formData.get("externalLinks") ?? "",
    profileImageUrl: formData.get("profileImageUrl") ?? "",
    skillIds: formData.getAll("skillIds"),
    serviceIds: formData.getAll("serviceIds"),
    customSkills: formData.getAll("customSkills"),
    customServices: formData.getAll("customServices"),
    workExamples: formData.get("workExamples") ?? "[]",
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

  let slug: string;
  let created = false;

  try {
    if (user.profile) {
      const updated = await updateProfile(user.profile, parsed.data);
      slug = updated.slug;
    } else {
      const profile = await createProfile(user.id, parsed.data);
      slug = profile.slug;
      created = true;
    }

    revalidatePath("/dashboard");
    revalidatePath(`/experts/${slug}`);
    revalidatePath("/search");
  } catch {
    return { error: "Failed to save profile. Please try again." };
  }

  redirect(`/experts/${slug}?${created ? "created=1" : "updated=1"}`);
}

export async function hideProfileAction(): Promise<{ error?: string }> {
  const user = await requireUser();
  if (!user.profile) {
    return { error: "You don't have a profile to remove." };
  }

  try {
    const updated = await hideProfile(user.profile);
    revalidatePath("/dashboard");
    revalidatePath(`/experts/${updated.slug}`);
    revalidatePath("/search");
    return {};
  } catch {
    return { error: "Could not remove your profile. Please try again." };
  }
}

export async function restoreProfileAction(): Promise<{ error?: string }> {
  const user = await requireUser();
  if (!user.profile) {
    return { error: "You don't have a profile to restore." };
  }

  try {
    const updated = await restoreProfile(user.profile);
    revalidatePath("/dashboard");
    revalidatePath(`/experts/${updated.slug}`);
    revalidatePath("/search");
    return {};
  } catch {
    return { error: "Could not restore your profile. Please try again." };
  }
}
