import { IconSearch } from '../icons'
import { WORKS_SEARCH_HERO_OVERLAP } from './HeroHeader'

interface WorksSearchBarProps {
  onPress: () => void
}

export function WorksSearchBar({ onPress }: WorksSearchBarProps) {
  return (
    <div className="works-search-section" style={{ marginTop: -WORKS_SEARCH_HERO_OVERLAP }}>
      <button type="button" className="works-search-btn" aria-label="搜索你的作品" onClick={onPress}>
        <IconSearch size={16} color="#9E968D" />
        <span className="works-search-placeholder">搜索你的作品...</span>
      </button>
    </div>
  )
}
