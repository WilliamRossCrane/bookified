export const CLERK_PLAN_SLUGS = {
  standard: "standard",
  pro: "pro",
} as const;

export type PaidPlanSlug =
  (typeof CLERK_PLAN_SLUGS)[keyof typeof CLERK_PLAN_SLUGS];

export type SubscriptionPlanKey = "free" | PaidPlanSlug;

export interface SubscriptionPlanLimits {
  maxBooks: number;
  maxSessionsPerMonth: number | null;
  maxSessionMinutes: number;
  hasSessionHistory: boolean;
}

export interface SubscriptionPlanDefinition {
  key: SubscriptionPlanKey;
  label: string;
  clerkPlanSlug?: PaidPlanSlug;
  limits: SubscriptionPlanLimits;
}

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlanKey,
  SubscriptionPlanDefinition
> = {
  free: {
    key: "free",
    label: "Free",
    limits: {
      maxBooks: 1,
      maxSessionsPerMonth: 5,
      maxSessionMinutes: 5,
      hasSessionHistory: false,
    },
  },
  standard: {
    key: "standard",
    label: "Standard",
    clerkPlanSlug: CLERK_PLAN_SLUGS.standard,
    limits: {
      maxBooks: 10,
      maxSessionsPerMonth: 100,
      maxSessionMinutes: 15,
      hasSessionHistory: true,
    },
  },
  pro: {
    key: "pro",
    label: "Pro",
    clerkPlanSlug: CLERK_PLAN_SLUGS.pro,
    limits: {
      maxBooks: 100,
      maxSessionsPerMonth: null,
      maxSessionMinutes: 60,
      hasSessionHistory: true,
    },
  },
};

type ClerkPlanChecker = ((params: { plan: PaidPlanSlug }) => boolean) | null;

export const resolveSubscriptionPlanKey = (
  has: ClerkPlanChecker,
): SubscriptionPlanKey => {
  if (has?.({ plan: CLERK_PLAN_SLUGS.pro })) {
    return "pro";
  }

  if (has?.({ plan: CLERK_PLAN_SLUGS.standard })) {
    return "standard";
  }

  return "free";
};

export const getSubscriptionPlan = (
  planKey: SubscriptionPlanKey,
): SubscriptionPlanDefinition => SUBSCRIPTION_PLANS[planKey];

export const getSubscriptionPlanFromHas = (
  has: ClerkPlanChecker,
): SubscriptionPlanDefinition =>
  getSubscriptionPlan(resolveSubscriptionPlanKey(has));

export const getCurrentBillingPeriodStart = (date = new Date()): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

export const getNextBillingPeriodStart = (date = new Date()): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
