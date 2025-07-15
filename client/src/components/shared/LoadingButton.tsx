import React from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

interface LoadingButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean
  children: React.ReactNode
}

const LoadingButton = ({ loading, children, ...props }: LoadingButtonProps) => {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {children}
    </Button>
  )
}

export default LoadingButton
