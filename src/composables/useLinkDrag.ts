import { ref } from 'vue'
import { useStartpage } from './useStartpage'

/**
 * Dragging links between rows and sections. Shared across every section, so
 * only one drop marker shows however the pointer moves between them.
 */
const dragging = ref<{ sectionId: string; linkId: string } | null>(null)
/** The row a drop lands before, or `end:<sectionId>` for the end of a list. */
const dropTarget = ref<string | null>(null)

export const endOf = (sectionId: string) => `end:${sectionId}`

export const useLinkDrag = () => {
  const { moveLink } = useStartpage()

  const start = (e: DragEvent, sectionId: string, linkId: string, row: HTMLElement | null) => {
    dragging.value = { sectionId, linkId }
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      // Firefox won't start a drag without data.
      e.dataTransfer.setData('text/plain', linkId)
      if (row) e.dataTransfer.setDragImage(row, 16, 16)
    }
  }

  const over = (e: DragEvent, target: string) => {
    if (!dragging.value) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    dropTarget.value = target
  }

  const drop = (sectionId: string, beforeId: string | null) => {
    if (dragging.value) moveLink(dragging.value.sectionId, dragging.value.linkId, sectionId, beforeId)
    end()
  }

  const end = () => {
    dragging.value = null
    dropTarget.value = null
  }

  return { dragging, dropTarget, start, over, drop, end }
}
