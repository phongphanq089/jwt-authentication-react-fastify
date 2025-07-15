import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import LoadingButton from '~/components/shared/LoadingButton'
import { Input } from '~/components/ui/input'
import { URL_REDIRECT_VERIFY_FORGOT_PASS } from '~/config/config'
import {
  useResendForgotPassword,
  useUpdateForgotPassword,
} from '~/hooks/api/auth'
import { userSchema, type UpdatePasswordType } from '~/validate/authentication'

const VerifyEmailForgotPassPage = () => {
  const navigate = useNavigate()

  const [searchParam] = useSearchParams()

  const email = searchParam.get('email')

  const token = searchParam.get('token')

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UpdatePasswordType>({
    resolver: zodResolver(userSchema.updatePassword),
  })

  const { mutate: mutateForgot, error, isPending } = useUpdateForgotPassword()

  const { mutate: mutateResendMail } = useResendForgotPassword()

  const onSubmitData = async (payload: UpdatePasswordType) => {
    mutateForgot(payload, {
      onSuccess: (data) => {
        toast.success(data.message)
        navigate('/login')
      },
    })
  }

  const handleResendEmail = () => {
    if (email) {
      mutateResendMail(
        {
          email,
          urlRedirect: URL_REDIRECT_VERIFY_FORGOT_PASS,
        },
        {
          onSuccess: () => {
            toast.success(`RESEND EMAIL SUCCESS : ${email} `)
          },
        }
      )
    }
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
          <Input type='password' {...register('password')} />
          <Input
            type='text'
            {...register('email')}
            value={email ? email : ''}
            className='hidden'
          />
          <Input
            type='text'
            {...register('token')}
            value={token ? token : ''}
            className='hidden'
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
          )}
          <LoadingButton loading={isPending} type='submit'>
            UPDATE
          </LoadingButton>

          <p
            className='font-bold text-lg underline cursor-pointer'
            onClick={handleResendEmail}
          >
            Resend email
          </p>
        </form>
      </div>
    </div>
  )
}

export default VerifyEmailForgotPassPage
