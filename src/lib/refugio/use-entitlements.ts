import { useEffect } from "react";
import { emptyEntitlements, entitlementsFor, hasVipAccess, type VipPlanKey } from "@/lib/refugio/vip";
import { trpc } from "@/lib/refugio/trpc";
import { useRefugioStore } from "@/lib/refugio/store";
import { readVipSubscription } from "@/lib/refugio/billing";

export function useEntitlements() {
  const storePlan = useRefugioStore((s) => s.plan);
  const email = useRefugioStore((s) => s.email);
  const setPlan = useRefugioStore((s) => s.setPlan);
  const cancelPlan = useRefugioStore((s) => s.cancelPlan);
  const query = trpc.billing.subscriptionStatus.useQuery();

  useEffect(() => {
    if (!email) return;
    readVipSubscription({ data: { email } })
      .then((row) => {
        if (!row) return;
        if (row.status === "canceled" || row.status === "unpaid" || row.status === "incomplete_expired") {
          if (storePlan !== "free") cancelPlan();
          return;
        }
        if ((row.plan === "monthly" || row.plan === "annual") && row.plan !== storePlan) {
          setPlan(row.plan);
        }
      })
      .catch(() => undefined);
  }, [email, storePlan, setPlan, cancelPlan]);
  const stripePlan = (query.data?.plan ?? null) as VipPlanKey | null;
  const stripeStatus = query.data?.status ?? null;
  const stripeActive = hasVipAccess(stripeStatus);
  const plan: VipPlanKey | null = stripeActive
    ? stripePlan
    : storePlan === "monthly" || storePlan === "annual"
      ? storePlan
      : null;
  const status = stripeActive ? stripeStatus : plan ? "active" : null;
  const entitlements = entitlementsFor(plan, status);
  return {
    ...query,
    plan,
    status,
    active: Boolean(plan),
    entitlements,
  };
}
