/** Flip on to log store loads, saves and cross-tab syncs to the console. */
export const debug = false

/** The Chrome Web Store page, once Tabscape is approved. Empty shows "coming soon" on the website. */
export const STORE_URL = ''

export const log = (...args: unknown[]) => {
  if (debug) console.log('[tabscape]', ...args)
}
