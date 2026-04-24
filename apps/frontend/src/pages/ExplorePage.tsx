import { useState } from 'react'
import { useArtworks, type Artwork, type ArtworksFilters } from '@/services/artworkService'
import { ArtworkGrid } from '@/components/ArtworkGrid'
import { Search, Filter } from 'lucide-react'
import { PageLoading, LoadingCard } from '@/components/ui/Loading'
import { useOperationLoading } from '@/contexts/LoadingContext'

export function ExplorePage() {
  const [filters, setFilters] = useState<ArtworksFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const { isLoading: searchLoading, startLoading: startSearchLoading, stopLoading: stopSearchLoading } = useOperationLoading('search')

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useArtworks(filters)

  const artworks: Artwork[] = data?.pages.flatMap((page) => page.data) || []

  const handlePurchase = (artwork: Artwork) => {
    console.log('Purchase clicked for:', artwork.title)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      startSearchLoading('Searching artworks...', 'dots')
      try {
        // Simulate search API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setFilters({ ...filters, search: searchTerm })
      } finally {
        stopSearchLoading()
      }
    }
  }

  // Show loading state while searching
  if (searchLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mobile-section pb-2">
          <h1 className="heading-mobile mb-6">Explore Artworks</h1>
        </div>
        <PageLoading message="Searching artworks..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mobile-section pb-2">
        <h1 className="heading-mobile mb-6">Explore Artworks</h1>
        
        <div className="mobile-container mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-500" />
              <input
                type="text"
                placeholder="Search artworks, creators..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={searchLoading}
              />
            </div>
            <button type="submit" className="btn-primary px-4 hidden sm:block" disabled={searchLoading}>
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
            <button type="button" className="btn-outline px-3 sm:hidden" aria-label="Filters" disabled={searchLoading}>
              <Filter className="h-4 w-4" />
            </button>
          </form>
          
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
            {['All', 'Trending', 'New', 'Photography', '3D Render'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  setFilters(category === 'All' ? {} : { category })
                  setSearchTerm('')
                }}
                disabled={searchLoading}
                className={`btn-outline whitespace-nowrap px-4 py-1.5 rounded-full text-sm ${
                  (filters.category === category || (!filters.category && category === 'All'))
                    ? 'bg-secondary-900 text-white border-secondary-900'
                    : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mobile-section pt-0">
        {isLoading && !artworks.length ? (
          <LoadingCard variant="artwork" count={8} className="grid-mobile xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" />
        ) : (
          <ArtworkGrid
            artworks={artworks}
            isLoading={isLoading}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => {
              if (hasNextPage) fetchNextPage()
            }}
            onPurchase={handlePurchase}
            onClearFilters={handleClearFilters}
            hasFilters={Object.keys(filters).length > 0}
          />
        )}
      </div>
    </div>
  )
}
