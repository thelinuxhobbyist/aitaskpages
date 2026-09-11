"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
    profileType: formData.get("profileType") ?? "individual",
    fullName: formData.get("fullName"),
    headline: formData.get("headline") ?? "",
    bio: formData.get("bio") ?? "",
    location: formData.get("location") ?? "",
    hourlyRate: formData.get("hourlyRate") ?? "",
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
