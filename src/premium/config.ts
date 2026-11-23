/** Where a coach writes to get a subscription until online payment is connected (e.g. a Telegram link). */
export const CONTACT_URL = (import.meta.env.VITE_CONTACT_URL as string | undefined) || ''
/** Price line shown on the subscription card, e.g. "49 000 so'm / oy". Empty: not shown. */
export const PRICE_TEXT = (import.meta.env.VITE_PRICE_TEXT as string | undefined) || ''
