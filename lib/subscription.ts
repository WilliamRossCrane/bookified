import { auth } from "@clerk/nextjs/server";
import {
  CLERK_PLAN_SLUGS,
  getSubscriptionPlanFromHas,
  type PaidPlanSlug,
  type SubscriptionPlanDefinition,
} from "@/lib/subscription-constants";

export interface CurrentUserSubscription {
  userId: string | null;
  plan: SubscriptionPlanDefinition;
}

export const getCurrentUserSubscription =
  async (): Promise<CurrentUserSubscription> => {
    const { userId, has } = await auth();

    return {
      userId,
      plan: getSubscriptionPlanFromHas(has),
    };
  };

export const userHasPlan = async (plan: PaidPlanSlug): Promise<boolean> => {
  const { has } = await auth();
  return has({ plan });
};

export { CLERK_PLAN_SLUGS };
