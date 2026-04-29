"use client";

import { useAuth } from "@clerk/nextjs";
import { getSubscriptionPlanFromHas } from "@/lib/subscription-constants";

export const useSubscriptionPlan = () => {
  const authState = useAuth();
  const plan = getSubscriptionPlanFromHas(
    authState.isLoaded ? authState.has : null,
  );

  return {
    ...authState,
    plan,
  };
};
