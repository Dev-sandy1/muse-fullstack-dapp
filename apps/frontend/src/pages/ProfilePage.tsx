import { useState, useEffect } from 'react'
import { Settings, Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Grid } from '@/components/layout/Grid'
import { ArtworkCard } from '@/components/artwork/ArtworkCard'
import { LoadingCard } from '@/components/ui/Loading'
import { useOperationLoading } from '@/contexts/LoadingContext'

// Mock data for demonstration
const mockArtworks = Array.from({ length: 6 }, (_, i) => ({
  id: `profile-${i + 1}`,
  title: `AI Artwork #${i + 1}`,
  description: 'Generated with AI Model',
  imageUrl: '',
  price: '0.1',
  currency: 'ETH',
  creator: 'Current User',
  createdAt: new Date().toISOString(),
  category: 'abstract'
}))

export function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'created' | 'favorites'>('created')
  const { isLoading: editLoading, startLoading: startEditLoading, stopLoading: stopEditLoading } = useOperationLoading('editProfile')

  useEffect(() => {
    // Simulate loading profile data
    const loadProfile = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsLoading(false)
    }
    loadProfile()
  }, [])

  const handleArtworkView = (artwork: typeof mockArtworks[0]) => {
    console.log('View artwork:', artwork)
  }

  const handleEditProfile = async () => {
    startEditLoading('Updating profile...', 'spinner')
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Profile updated')
    } finally {
      stopEditLoading()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mobile-section">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <LoadingCard variant="profile" count={1} />
            </div>
            <div className="lg:col-span-3">
              <LoadingCard variant="artwork" count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card padding="lg" className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-secondary-900">Artist Name</h2>
            <p className="text-secondary-600 mb-4">0x1234...5678</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600">Created</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Collected</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Favorites</span>
                <span className="font-medium">89</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button 
                variant="outline" 
                size="md" 
                fullWidth 
                onClick={handleEditProfile}
                disabled={editLoading}
              >
                {editLoading ? 'Updating...' : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <button 
                  className={`flex items-center space-x-2 font-medium ${
                    activeTab === 'created' ? 'text-primary-600' : 'text-secondary-600'
                  }`}
                  onClick={() => setActiveTab('created')}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Created</span>
                </button>
                <button 
                  className={`flex items-center space-x-2 font-medium ${
                    activeTab === 'favorites' ? 'text-primary-600' : 'text-secondary-600'
                  }`}
                  onClick={() => setActiveTab('favorites')}
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </button>
              </div>
              
              <Grid columns={3} gap="md" responsive={false}>
                {mockArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    variant="default"
                    onView={handleArtworkView}
                    showPrice={true}
                    showCreator={false}
                  />
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
