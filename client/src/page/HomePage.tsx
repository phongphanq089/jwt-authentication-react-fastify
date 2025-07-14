import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { useAuthStore } from '~/stores/useAuthStore'

const HomePage = () => {
  const navigation = useNavigate()

  const { isAuthenticated, user } = useAuthStore()
  const handleNavigation = () => {
    if (isAuthenticated && user) {
      navigation('/admin')
    }
    navigation('/login')
  }
  return (
    <div className='h-screen flex items-center justify-center '>
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-bold'>WELL COME TO HOME PAGE</h2>
        <Button onClick={handleNavigation}> GO ADMIN </Button>
      </div>
    </div>
  )
}

export default HomePage
