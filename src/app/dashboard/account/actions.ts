"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { setMarketingPreference } from "@/lib/clerk-sync";

export type MarketingPreferenceState = {
  error?: string;
  success?: boolean;
};

export async function saveMarketingPreference(
  _prev: MarketingPreferenceState,
  formData: FormData
): Promise<MarketingPreferenceState> {
  const user = await requireUser();
  const optedIn = formData.get("marketingOptIn") === "on";

  try {
    await setMarketingPreference(user.id, optedIn);
    revalidatePath("/dashboard/account");
    return { success: true };
  } catch {
    return { error: "Could not save your preference. Please try again." };
  }
}
