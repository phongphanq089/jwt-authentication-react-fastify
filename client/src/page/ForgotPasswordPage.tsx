import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'
import LoadingButton from '~/components/shared/LoadingButton'
import { Input } from '~/components/ui/input'
import { URL_REDIRECT_VERIFY_FORGOT_PASS } from '~/config/config'
import { useForgotPassword } from '~/hooks/api/auth'
import { userSchema, type ForgotPasswordType } from '~/validate/authentication'

const ForgotPasswordPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(userSchema.forgotPassword),
  })

  const { mutate: mutateForgot, error, isPending } = useForgotPassword()

  const onSubmitData = async (payload: ForgotPasswordType) => {
    mutateForgot(payload, {
      onSuccess: (data) => {
        toast.success(data.message)
      },
    })
  }
  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='w-full max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow'>
        <h2 className='text-xl font-bold mb-4 text-center'>Forgot password</h2>

        <form
          onSubmit={handleSubmit(onSubmitData)}
          className='flex flex-col items-center justify-center gap-6'
        >
          <Input type='email' {...register('email')} />
          <Input
            type='text'
            {...register('urlRedirect')}
            value={URL_REDIRECT_VERIFY_FORGOT_PASS}
            className='hidden'
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
          )}
          <LoadingButton loading={isPending} type='submit'>
            SEND EMAIL
          </LoadingButton>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
