import { useEffect, useRef, useState, type FormEvent } from 'react'
import { IconSearch } from '../icons'
import { PhonePortal } from '../PhonePortal'
import { EmptyState } from '../ui/EmptyState'
import { WorksMasonryGrid, type WorkMenuHandlers } from './WorksMasonryGrid'
import type { Collection, Work } from '../../types'

interface SearchOverlayProps {
  visible: boolean
  works: Work[]
  collections: Collection[]
  onClose: () => void
  onWorkPress: (work: Work) => void
  workMenuHandlers: WorkMenuHandlers
}

export function SearchOverlay({
  visible,
  works,
  collections,
  onClose,
  onWorkPress,
  workMenuHandlers,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Work[] | null>(null)
  const [width, setWidth] = useState(390)

  useEffect(() => {
    if (!visible) {
      setQuery('')
      setSearchResults(null)
      return
    }
    const frame = document.querySelector('.phone-frame')
    if (frame instanceof HTMLElement) setWidth(frame.clientWidth)
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => window.clearTimeout(timer)
  }, [visible])

  if (!visible) return null

  const handleQueryChange = (text: string) => {
    setQuery(text)
    if (!text.trim()) setSearchResults(null)
  }

  const handleSearch = (event?: FormEvent) => {
    event?.preventDefault()
    const keyword = (inputRef.current?.value ?? query).trim()
    if (!keyword) return
    setQuery(keyword)
    setSearchResults(works.filter((work) => work.title.includes(keyword)))
  }

  const showEmptyResults = searchResults !== null && searchResults.length === 0
  const showResults = searchResults !== null && searchResults.length > 0

  return (
    <PhonePortal>
      <div className="search-overlay">
        <form className="search-overlay-header" onSubmit={handleSearch}>
          <div className="search-input-wrap">
            <IconSearch size={18} color="#9A9A9A" strokeWidth={1.75} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
              placeholder="搜索你的作品"
            />
          </div>
          <button type="button" className="search-cancel" onClick={onClose}>
            取消
          </button>
        </form>
        <div className="search-overlay-scroll">
          {showEmptyResults ? (
            <div className="search-empty">
              <EmptyState
                icon="feather"
                title="找不到这篇作品，换个关键词试试?"
                ctaText=" "
                onCta={() => {}}
              />
            </div>
          ) : showResults ? (
            <WorksMasonryGrid
              works={searchResults}
              collections={collections}
              onWorkPress={onWorkPress}
              workMenuHandlers={workMenuHandlers}
              width={width}
            />
          ) : null}
        </div>
      </div>
    </PhonePortal>
  )
}
