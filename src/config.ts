/** Flip on to log store loads, saves and cross-tab syncs to the console. */
export const debug = false

/** Tabscape's store pages, once each is approved. An empty one shows as "coming soon" on the website. */
export const CHROME_STORE_URL = ''
export const FIREFOX_STORE_URL = ''

/** Where people get help and suggest features. */
export const DISCORD_URL = 'https://discord.gg/T5bF56tvyj'

export const log = (...args: unknown[]) => {
  if (debug) console.log('[tabscape]', ...args)
}
