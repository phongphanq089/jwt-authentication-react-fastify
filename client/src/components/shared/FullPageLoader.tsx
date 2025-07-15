import { Loader2 } from 'lucide-react'

export const FullPageLoader = () => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80'>
    <Loader2 className='animate-spin text-black' size={40} />
  </div>
)
