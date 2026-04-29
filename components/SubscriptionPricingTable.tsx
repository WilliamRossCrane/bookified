"use client";

import { Show, SignInButton } from "@clerk/nextjs";
import {
  CheckoutButton,
  SubscriptionDetailsButton,
  usePlans,
} from "@clerk/nextjs/experimental";
import { Button } from "@/components/ui/button";
import { useSubscriptionPlan } from "@/hooks/useSubscriptionPlan";
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanKey,
} from "@/lib/subscription-constants";

const PLAN_ORDER: SubscriptionPlanKey[] = ["free", "standard", "pro"];

const formatPrice = (
  planKey: SubscriptionPlanKey,
  monthlyPrice?: { amountFormatted: string; currencySymbol: string } | null,
) => {
  if (planKey === "free") {
    return "$0";
  }

  return monthlyPrice
    ? `${monthlyPrice.currencySymbol}${monthlyPrice.amountFormatted}`
    : "Custom";
};

const formatDescription = (planKey: SubscriptionPlanKey) => {
  if (planKey === "free") {
    return "Always free";
  }

  return "Billed monthly";
};

const SubscriptionPricingTable = () => {
  const { plan: currentPlan, isSignedIn } = useSubscriptionPlan();
  const { data: plans, isLoading, error } = usePlans({
    for: "user",
    pageSize: 10,
  });

  const paidPlansBySlug = new Map(
    (plans ?? []).map((plan) => [plan.slug, plan] as const),
  );

  return (
    <div className="subscription-shell">
      <section className="subscription-hero">
        <span className="subscription-eyebrow">Bookified Billing</span>
        <h1 className="page-title-xl">Choose Your Plan</h1>
        <p className="subtitle max-w-3xl">
          Upgrade to unlock more books, longer voice sessions, and a larger
          monthly conversation allowance.
        </p>

        {isSignedIn && (
          <div className="subscription-plan-summary">
            <span className="subscription-plan-summary-label">
              Current plan
            </span>
            <span className="subscription-plan-summary-value">
              {currentPlan.label}
            </span>
          </div>
        )}
      </section>

      {error && (
        <div className="subscription-loading-card">
          We couldn&apos;t load billing plans right now. Please try again in a
          moment.
        </div>
      )}

      <div className="subscription-cards-grid">
        {PLAN_ORDER.map((planKey) => {
          const planDefinition = SUBSCRIPTION_PLANS[planKey];
          const paidPlan = planDefinition.clerkPlanSlug
            ? paidPlansBySlug.get(planDefinition.clerkPlanSlug)
            : null;
          const isCurrentPlan = currentPlan.key === planKey;
          const isPaidPlan = planKey !== "free";
          const isCheckoutReady = isPaidPlan && Boolean(paidPlan?.id);
          const paidPlanId = paidPlan?.id;

          return (
            <article
              key={planKey}
              className={`subscription-card ${isCurrentPlan ? "subscription-card-active" : ""}`}
            >
              <div className="subscription-card-header">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="subscription-card-title">
                      {planDefinition.label}
                    </h2>
                    <p className="subscription-card-price">
                      {formatPrice(planKey, paidPlan?.fee)}
                      {planKey !== "free" && (
                        <span className="subscription-card-price-suffix">
                          /month
                        </span>
                      )}
                    </p>
                    <p className="subscription-card-description">
                      {formatDescription(planKey)}
                    </p>
                  </div>

                  {isCurrentPlan && (
                    <span className="subscription-card-badge">Active</span>
                  )}
                </div>
              </div>

              <div className="subscription-card-content">
                <ul className="subscription-feature-list">
                  <li>
                    Up to {planDefinition.limits.maxBooks} book
                    {planDefinition.limits.maxBooks === 1 ? "" : "s"}
                  </li>
                  <li>
                    {planDefinition.limits.maxSessionsPerMonth === null
                      ? "Unlimited"
                      : planDefinition.limits.maxSessionsPerMonth}{" "}
                    voice sessions per month
                  </li>
                  <li>
                    {planDefinition.limits.maxSessionMinutes}-minute sessions
                  </li>
                  <li>
                    {planDefinition.limits.hasSessionHistory
                      ? "Session history included"
                      : "No session history"}
                  </li>
                </ul>
              </div>

              <div className="subscription-card-footer">
                {isCurrentPlan ? (
                  <button
                    type="button"
                    disabled
                    className="subscription-card-button subscription-card-button-disabled"
                  >
                    Current plan
                  </button>
                ) : isCheckoutReady ? (
                  <Show when="signed-in">
                    <CheckoutButton
                      planId={paidPlanId!}
                      planPeriod="month"
                      newSubscriptionRedirectUrl="/subscriptions"
                    >
                      <button
                        type="button"
                        className="subscription-card-button"
                      >
                        Switch to this plan
                      </button>
                    </CheckoutButton>
                  </Show>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="subscription-card-button subscription-card-button-disabled"
                  >
                    {isLoading ? "Loading..." : "Unavailable"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <Show
        when="signed-in"
        fallback={
          <div className="subscription-sign-in-card">
            <p className="subtitle">
              Sign in to upgrade and manage your subscription with Clerk.
            </p>
            <SignInButton mode="modal">
              <Button className="library-cta-primary px-6 py-3 text-base">
                Sign in to continue
              </Button>
            </SignInButton>
          </div>
        }
      >
        <div className="subscription-actions">
          <SubscriptionDetailsButton>
            <button type="button" className="subscription-secondary-button">
              Manage subscription
            </button>
          </SubscriptionDetailsButton>
        </div>
      </Show>
    </div>
  );
};

export default SubscriptionPricingTable;
