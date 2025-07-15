/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProfileCard.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { format } from 'date-fns'
import { Button } from '~/components/ui/button'

import type { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { UpdateEmailModal } from './UpdateEmailModal'
import { UpdatePasswordModal } from './UpdatePasswordModal'

interface ProfileProps {
  username: string
  email: string
  avatar: string | null
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  handleLogout: () => Promise<AxiosResponse<any, any> | undefined>
}

export const ProfileCard = ({
  username,
  email,
  avatar,
  role,
  isActive,
  createdAt,
  updatedAt,
  handleLogout,
}: ProfileProps) => {
  const navigate = useNavigate()

  const [showUpdateEmail, setShowUpdateEmail] = useState(false)
  const [showUpdatePassword, setShowUpdatePassword] = useState(false)

  const openUpdateEmailModal = () => setShowUpdateEmail(true)

  const openUpdatePasswordModal = () => setShowUpdatePassword(true)

  return (
    <>
      <Card className='max-w-xl w-full mx-auto p-4 rounded-2xl shadow-md m-4'>
        <CardHeader className='flex items-center gap-4'>
          <Avatar className='w-16 h-16'>
            <AvatarImage src={avatar || undefined} alt={username} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className='text-xl font-bold'>{username}</CardTitle>
            <p className='text-sm text-muted-foreground'>{email}</p>
          </div>
        </CardHeader>

        <CardContent className='space-y-2 mt-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Vai trò:</span>
            <Badge variant='outline'>{role}</Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Trạng thái:</span>
            <Badge className={isActive ? 'bg-green-500' : 'bg-gray-500'}>
              {isActive ? 'Đang hoạt động' : 'Bị khóa'}
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Ngày tạo:</span>
            <span className='text-sm text-muted-foreground'>
              {format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Cập nhật:</span>
            <span className='text-sm text-muted-foreground'>
              {format(new Date(updatedAt), 'dd/MM/yyyy HH:mm')}
            </span>
          </div>
        </CardContent>

        <CardFooter className='flex flex-wrap justify-between items-center gap-4'>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={openUpdateEmailModal}>
              Đổi Email
            </Button>
            <Button variant='outline' onClick={openUpdatePasswordModal}>
              Đổi Mật khẩu
            </Button>
          </div>
          <div className='flex gap-2'>
            <Button onClick={() => navigate('/')}>Home</Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </CardFooter>
      </Card>
      {showUpdateEmail && (
        <UpdateEmailModal
          open={showUpdateEmail}
          onClose={() => setShowUpdateEmail(false)}
        />
      )}
      {showUpdatePassword && (
        <UpdatePasswordModal
          open={showUpdatePassword}
          onClose={() => setShowUpdatePassword(false)}
        />
      )}
    </>
  )
}
