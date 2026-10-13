import { reactive, watch } from 'vue'
import { log } from '@/config'
import {
  DEFAULT_SETTINGS, defaultSections, uid,
  type Link, type Section, type Settings
} from '@/lib/defaults'
import type { Gradient } from '@/lib/gradients'

/**
 * The page's links and options, kept in localStorage so edits survive a
 * reload, and synced between open tabs.
 *
 * One store for the whole app, created on first import: its watchers and the
 * storage listener live as long as the page does, so there is nothing to tear down.
 */
// Storage keys keep the project's old name, so links saved before the rename still load.
const SECTIONS_KEY = 'startpage_sections'
const SETTINGS_KEY = 'startpage_settings'
/** Set once the first-run setup has been finished or skipped. */
const WELCOMED_KEY = 'startpage_welcomed'

/** What each key last held, so a write that changes nothing is skipped - and a sync from another tab isn't echoed back. */
const lastWritten: Record<string, string | null> = {}

const read = (key: string): unknown => {
  try {
    const raw = localStorage.getItem(key)
    lastWritten[key] = raw
    return raw ? JSON.parse(raw) : undefined
  } catch (e) {
    console.warn(`[tabscape] Couldn't read ${key}, using defaults`, e)
    return undefined
  }
}

const write = (key: string, value: unknown) => {
  const json = JSON.stringify(value)
  if (json === lastWritten[key]) return
  try {
    localStorage.setItem(key, json)
    lastWritten[key] = json
    log('saved', key)
  } catch (e) {
    console.warn(`[tabscape] Couldn't save ${key}`, e)
  }
}

const isString = (v: unknown): v is string => typeof v === 'string'

/** Rebuild sections from untrusted JSON (storage or an import), dropping anything malformed. */
const cleanSections = (input: unknown): Section[] | undefined => {
  if (!Array.isArray(input)) return undefined
  return input
    .filter((s): s is Record<string, unknown> => !!s && typeof s === 'object')
    .map(s => {
      const g = s.gradient
      const gradient: Gradient = Array.isArray(g) && isString(g[0]) && isString(g[1])
        ? [g[0], g[1]]
        : ['#bdc3c7', '#ffffff']
      const links: Link[] = Array.isArray(s.links)
        ? s.links
          .filter((l): l is Record<string, unknown> => !!l && typeof l === 'object')
          .map(l => ({
            id: isString(l.id) ? l.id : uid(),
            name: isString(l.name) ? l.name : '',
            url: isString(l.url) ? l.url : ''
          }))
        : []
      return {
        id: isString(s.id) ? s.id : uid(),
        title: isString(s.title) ? s.title : 'Untitled',
        gradient,
        links
      }
    })
}

/** Keep only known settings of the right type, filling the rest from the defaults. */
const cleanSettings = (input: unknown): Settings => {
  const next = { ...DEFAULT_SETTINGS }
  if (!input || typeof input !== 'object') return next
  const raw = input as Record<string, unknown>
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
    if (typeof raw[key] === typeof DEFAULT_SETTINGS[key]) {
      (next as Record<string, unknown>)[key] = raw[key]
    }
  }
  return next
}

const savedSections = cleanSections(read(SECTIONS_KEY))

const hasWelcomeFlag = () => {
  try {
    return localStorage.getItem(WELCOMED_KEY) === '1'
  } catch {
    return false
  }
}

const state = reactive({
  sections: savedSections ?? defaultSections(),
  settings: cleanSettings(read(SETTINGS_KEY)),
  // Anyone who already has links saved has been using the page: don't greet them as new.
  welcomed: !!savedSections || hasWelcomeFlag()
})
log('loaded', state.sections.length, 'sections')

watch(() => state.sections, v => write(SECTIONS_KEY, v), { deep: true })
watch(() => state.settings, v => write(SETTINGS_KEY, v), { deep: true })

const parse = (json: string | null): unknown => {
  try {
    return json ? JSON.parse(json) : undefined
  } catch {
    return undefined
  }
}

// Another tab saved: take its version.
window.addEventListener('storage', e => {
  if (e.key === SECTIONS_KEY) {
    lastWritten[SECTIONS_KEY] = e.newValue
    const next = cleanSections(parse(e.newValue))
    if (next) state.sections = next
    log('synced sections from another tab')
  } else if (e.key === WELCOMED_KEY) {
    state.welcomed = e.newValue === '1'
  } else if (e.key === SETTINGS_KEY) {
    lastWritten[SETTINGS_KEY] = e.newValue
    Object.assign(state.settings, cleanSettings(parse(e.newValue)))
    log('synced settings from another tab')
  }
})

const findSection = (id: string) => state.sections.find(s => s.id === id)

export const useStartpage = () => {
  const addSection = () => {
    const section: Section = { id: uid(), title: 'New section', gradient: ['#8e2de2', '#c471f5'], links: [] }
    state.sections.push(section)
    return section
  }

  const removeSection = (id: string) => {
    state.sections = state.sections.filter(s => s.id !== id)
  }

  /** Swap a section with its neighbour, -1 for left and 1 for right. */
  const shiftSection = (id: string, by: -1 | 1) => {
    const from = state.sections.findIndex(s => s.id === id)
    const to = from + by
    if (from < 0 || to < 0 || to >= state.sections.length) return
    const [section] = state.sections.splice(from, 1)
    state.sections.splice(to, 0, section)
  }

  const addLink = (sectionId: string) => {
    const link: Link = { id: uid(), name: '', url: '' }
    findSection(sectionId)?.links.push(link)
    return link
  }

  const removeLink = (sectionId: string, linkId: string) => {
    const section = findSection(sectionId)
    if (section) section.links = section.links.filter(l => l.id !== linkId)
  }

  /** Move a link into a section, before another link, or to the end when `beforeId` is null. */
  const moveLink = (fromSectionId: string, linkId: string, toSectionId: string, beforeId: string | null) => {
    if (linkId === beforeId) return
    const from = findSection(fromSectionId)
    const to = findSection(toSectionId)
    const index = from?.links.findIndex(l => l.id === linkId) ?? -1
    if (!from || !to || index < 0) return
    const [link] = from.links.splice(index, 1)
    const at = beforeId ? to.links.findIndex(l => l.id === beforeId) : -1
    to.links.splice(at < 0 ? to.links.length : at, 0, link)
  }

  /** Everything as one JSON document, for backing up or moving to another browser. */
  const exportData = () => JSON.stringify({ version: 1, sections: state.sections, settings: state.settings }, null, 2)

  /** Replace everything from an export. Throws if the file isn't one. */
  const importData = (json: string) => {
    const data = JSON.parse(json) as Record<string, unknown>
    const sections = cleanSections(data?.sections)
    if (!sections) throw new Error('No sections in that file')
    state.sections = sections
    if (data.settings) Object.assign(state.settings, cleanSettings(data.settings))
  }

  const resetLinks = () => { state.sections = defaultSections() }

  /** Finish the first-run setup, with the sections it built or the classic set. */
  const completeWelcome = (sections: Section[] = defaultSections()) => {
    state.sections = sections
    state.welcomed = true
    try {
      localStorage.setItem(WELCOMED_KEY, '1')
    } catch (e) {
      console.warn("[tabscape] Couldn't save the setup flag", e)
    }
    log('setup finished with', sections.length, 'sections')
  }
  const resetSettings = () => { Object.assign(state.settings, DEFAULT_SETTINGS) }

  return {
    state,
    addSection, removeSection, shiftSection,
    addLink, removeLink, moveLink,
    exportData, importData, resetLinks, resetSettings,
    completeWelcome
  }
}
