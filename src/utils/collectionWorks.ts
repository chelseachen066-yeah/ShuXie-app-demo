import type { Work } from '../types'

export function resolveCollectionWorkIds(
  collectionId: string,
  workOrder: string[],
  allWorks: Work[],
): string[] {
  const order = workOrder ?? []
  const orderSet = new Set(order)

  const orphans = allWorks
    .filter((work) => work.collectionId === collectionId && !orderSet.has(work.id))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((work) => work.id)

  if (order.length === 0) {
    return orphans
  }

  return orphans.length > 0 ? [...order, ...orphans] : order
}

export function resolveCollectionWorks(
  collectionId: string,
  workOrder: string[],
  allWorks: Work[],
): Work[] {
  const workMap = new Map(allWorks.map((work) => [work.id, work]))

  return resolveCollectionWorkIds(collectionId, workOrder, allWorks)
    .map((workId) => workMap.get(workId))
    .filter((work): work is Work => Boolean(work))
}
