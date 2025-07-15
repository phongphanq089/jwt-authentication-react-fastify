import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import LoadingButton from '~/components/shared/LoadingButton'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { useChangePassword } from '~/hooks/api/auth'
import { useAuthStore } from '~/stores/useAuthStore'
import { userSchema, type ChangePasswordType } from '~/validate/authentication'

export const UpdatePasswordModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(userSchema.changePasswordSchema),
  })

  const { logout } = useAuthStore()
  const { mutate: mutateChangePass, isPending, error } = useChangePassword()

  const onSubmit = async (payload: ChangePasswordType) => {
    mutateChangePass(payload, {
      onSuccess: () => {
        logout()
        onClose()
      },
    })
  }

  useEffect(() => {
    toast.error(error?.message)
  }, [error])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-2'>
          <Input
            type='password'
            {...register('oldPassword')}
            placeholder='Mật khẩu hiện tại'
          />
          {errors.oldPassword && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.oldPassword.message}
            </p>
          )}
          <Input
            type='password'
            {...register('newPassword')}
            placeholder='Mật khẩu mới'
          />

          {errors.newPassword && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.newPassword.message}
            </p>
          )}
          <p className='text-sm text-red-500'>
            ⚠️ After changing your password, you will be logged out of the
            system.
          </p>

          <LoadingButton loading={isPending} type='submit'>
            Update password
          </LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
