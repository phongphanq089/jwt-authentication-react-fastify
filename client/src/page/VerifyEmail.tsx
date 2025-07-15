/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import LoadingButton from '~/components/shared/LoadingButton'
import { Button } from '~/components/ui/button'
import { URL_REDIRECT_VERIFY_EMAIL } from '~/config/config'
import { useResendVerifyAccount, useVerifyAccount } from '~/hooks/api/auth'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const email = searchParams.get('email')

  const token = searchParams.get('token')

  const {
    mutate: mutateVerify,
    isPending,
    isSuccess,
    isError,
    data,
  } = useVerifyAccount()

  const { mutate: mutateResendVerify, isPending: isPendingResend } =
    useResendVerifyAccount()

  const handleResendEmail = () => {
    if (email) {
      mutateResendVerify(
        {
          email,
          urlRedirect: URL_REDIRECT_VERIFY_EMAIL,
        },
        {
          onSuccess: () => {
            toast.success('RESEND EMAIL SUCCESS')
          },
        }
      )
    }
  }

  useEffect(() => {
    if (email && token) {
      mutateVerify({ email, token })
    }
  }, [email, token])

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white rounded-2xl shadow-lg p-8 max-w-md text-center space-y-4'>
        {isPending && (
          <>
            <Loader2 className='w-10 h-10 mx-auto animate-spin text-blue-500' />
            <h2 className='text-lg font-semibold text-gray-700'>
              Verifying your email...
            </h2>
          </>
        )}

        {isSuccess && (
          <>
            <CheckCircle2 className='w-12 h-12 mx-auto text-green-500' />
            <h2 className='text-xl font-bold text-green-600'>
              {data?.result.isActive
                ? 'Email has been verified.'
                : 'Verification successful!'}
            </h2>
            <p className='text-gray-600'>You can continue logging in now.</p>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </>
        )}

        {isError && (
          <>
            <XCircle className='w-12 h-12 mx-auto text-red-500' />
            <h2 className='text-xl font-bold text-red-600'>
              Verification failed!
            </h2>
            <p className='text-gray-600'>The link may be expired or invalid.</p>
            <LoadingButton
              loading={isPendingResend}
              onClick={handleResendEmail}
            >
              Resend Email
            </LoadingButton>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
