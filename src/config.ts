/** Flip on to log store loads, saves and cross-tab syncs to the console. */
export const debug = false

export const log = (...args: unknown[]) => {
  if (debug) console.log('[startpage]', ...args)
}
