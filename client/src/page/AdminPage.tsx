/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProfileCard } from '~/components/modules/authentication/ProfileCard'
import { FullPageLoader } from '~/components/shared/FullPageLoader'
import { useGetUser } from '~/hooks/api/auth'

import { useAuthStore } from '~/stores/useAuthStore'

const AdminPage = () => {
  const { data, isLoading } = useGetUser()

  const { logout } = useAuthStore()

  if (isLoading) return <FullPageLoader />

  return (
    <div className='flex items-center justify-center h-screen'>
      <ProfileCard {...data.result} handleLogout={logout} />
    </div>
  )
}

export default AdminPage
