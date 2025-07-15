import { Loader2 } from 'lucide-react'

export const LoadingSpinner = ({ size = 24 }: { size?: number }) => (
  <div className='flex items-center justify-center py-10'>
    <Loader2 className='animate-spin text-gray-500' size={size} />
  </div>
)
