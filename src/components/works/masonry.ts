import type { Work } from '../../types'

export const WORKS_LAYOUT = {
  horizontalPadding: 16,
  columnGap: 12,
  rowGap: 12,
} as const

export function getWorkCardWidth(screenWidth: number) {
  const { horizontalPadding, columnGap } = WORKS_LAYOUT
  return (screenWidth - horizontalPadding * 2 - columnGap) / 2
}

export function estimateCardHeight(work: Work) {
  const titleLines = Math.min(2, Math.max(1, Math.ceil(work.title.length / 8)))
  const excerptLines = Math.min(4, Math.max(1, Math.ceil(work.excerpt.length / 12)))
  const collectionBlock = work.collectionId ? 52 : 0
  const tagCount = Math.min(3, work.tags.length)
  const tagBlock = tagCount > 0 ? tagCount * 26 + 6 : 0
  return 24 + titleLines * 24 + excerptLines * 20 + collectionBlock + tagBlock + 24
}

export function buildMasonryColumns(works: Work[], rowGap = 12) {
  const left: Work[] = []
  const right: Work[] = []
  let leftHeight = 0
  let rightHeight = 0

  works.forEach((work) => {
    const height = estimateCardHeight(work)
    if (leftHeight <= rightHeight) {
      left.push(work)
      leftHeight += height + rowGap
    } else {
      right.push(work)
      rightHeight += height + rowGap
    }
  })

  return { left, right }
}
