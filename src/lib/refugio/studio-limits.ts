/** Quantas histórias publicadas o plano grátis permite. Mude só este número. */
export const FREE_PUBLISHED_STORIES = 2;

/**
 * A porta das histórias exclusivas só fecha se isto for true E a chave do Stripe
 * existir neste servidor. Sem a chave, o botão não cobra e nada tranca.
 */
export const STORY_BILLING_LIVE = true;

export function storyBillingLocks() {
  return STORY_BILLING_LIVE && Boolean(process.env.STRIPE_SECRET_KEY);
}
