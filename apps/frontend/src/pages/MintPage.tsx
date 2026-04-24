import { useState } from 'react'
import { MintStepper } from '@/components/MintStepper'
import { AppError } from '@/utils/errorHandler'
import { ErrorDisplay } from '@/components/ErrorDisplay'
import { MintingLoading } from '@/components/ui/Loading'
import { useOperationLoading } from '@/contexts/LoadingContext'

export function MintPage() {
  const [error, setError] = useState<AppError | null>(null)
  const { isLoading: mintLoading, currentLoading: mintLoadingState } = useOperationLoading('minting')

  const handleMintComplete = (data: { metadata: any; fileData: any }) => {
    console.log('Minting completed:', data)
    // Handle successful minting - redirect or show success message
    // For now, just log the data
  }

  return (
    <div>
      {error && (
        <ErrorDisplay
          error={error}
          onDismiss={() => setError(null)}
          showRetry={error.isRecoverable}
        />
      )}
      
      {mintLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MintingLoading 
            currentStage={mintLoadingState?.message?.includes('Generating') ? 'generating' : 
                        mintLoadingState?.message?.includes('Minting') ? 'minting' : 'confirming'}
            progress={mintLoadingState?.progress || 0}
          />
        </div>
      )}
      
      <MintStepper onComplete={handleMintComplete} />
    </div>
  )
}
