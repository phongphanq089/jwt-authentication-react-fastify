import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, type ChangeEmailType } from '~/validate/authentication'
import { useAuthStore } from '~/stores/useAuthStore'
import { useChangeEmail } from '~/hooks/api/auth'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import LoadingButton from '~/components/shared/LoadingButton'
import { URL_REDIRECT_VERIFY_EMAIL } from '~/config/config'

export const UpdateEmailModal = ({
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
  } = useForm<ChangeEmailType>({
    resolver: zodResolver(userSchema.changeEmailSchema),
  })

  const { logout } = useAuthStore()
  const { mutate: mutateChangePass, isPending, error } = useChangeEmail()

  const onSubmit = async (payload: ChangeEmailType) => {
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
          <DialogTitle>Change Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-2'>
          <Input {...register('newEmail')} placeholder='New Email' />
          <Input
            {...register('urlRedirect')}
            value={URL_REDIRECT_VERIFY_EMAIL}
            className='hidden'
          />
          {errors.newEmail && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.newEmail.message}
            </p>
          )}
          <p className='text-sm text-red-500'>
            ⚠️ After changing your email, you will be logged out of the system.
          </p>
          <LoadingButton loading={isPending} type='submit'>
            UPDATE EMAIL
          </LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
