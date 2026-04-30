"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const downgradeCurrentUserToFree = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const client = await clerkClient();
    const subscription = await client.billing.getUserBillingSubscription(userId);
    const activePaidItem = subscription.subscriptionItems.find(
      (item) => item.plan?.hasBaseFee && item.canceledAt === null,
    );

    if (!activePaidItem) {
      return {
        success: false,
        error: "No active paid subscription was found.",
      };
    }

    await client.billing.cancelSubscriptionItem(activePaidItem.id, {
      endNow: true,
    });

    revalidatePath("/subscriptions");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error downgrading subscription to free", error);

    return {
      success: false,
      error: "We couldn't downgrade your subscription right now.",
    };
  }
};
