/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  userSchema,
  type UserRegisterSchemaType,
} from '~/validate/authentication'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '~/lib/utils'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent } from '~/components/ui/card'
import { Link } from 'react-router'
import { useRegister } from '~/hooks/api/auth'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Terminal } from 'lucide-react'
import LoadingButton from '~/components/shared/LoadingButton'
import { URL_REDIRECT_VERIFY_EMAIL } from '~/config/config'

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<UserRegisterSchemaType>({
    resolver: zodResolver(userSchema.userRegisterSchema),
  })

  const [emailVerify, setEmailVerify] = useState(false)

  const [nameEmail, setNameEmail] = useState('')

  const { mutate: registerData, error, isPending } = useRegister()

  const onSubmitData = async (payload: UserRegisterSchemaType) => {
    const dataPayload = {
      ...payload,
      urlRedirect: URL_REDIRECT_VERIFY_EMAIL,
    }
    registerData(dataPayload, {
      onSuccess: (data) => {
        toast.success(data.message)
        setNameEmail(data.result.email)
        setEmailVerify(true)
        reset()
      },
    })
  }
  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8' onSubmit={handleSubmit(onSubmitData)}>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Create your account</h1>
                <p className='text-muted-foreground text-balance'>
                  Start your journey with us
                </p>
              </div>
              {emailVerify && (
                <Alert className='my-4 bg-yellow-300/40'>
                  <Terminal className='h-4 w-4' />

                  <AlertDescription>
                    An email has been sent to{' '}
                    <span className='font-bold'>{nameEmail}</span> {''}
                    Please check and verify your account before logging in!
                  </AlertDescription>
                </Alert>
              )}
              <div className='grid gap-3'>
                <Label htmlFor='username'>Username</Label>
                <Input {...register('username')} placeholder='yourname' />
                {errors.username && (
                  <p className='text-red-500 text-sm'>
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  type='email'
                  {...register('email')}
                  placeholder='m@example.com'
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='password'>Password</Label>
                <Input type='password' {...register('password')} />
                {errors.password && (
                  <p className='text-red-500 text-sm'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <LoadingButton
                loading={isPending}
                type='submit'
                className='w-full cursor-pointer'
              >
                {' '}
                Register
              </LoadingButton>

              <div className='text-center text-sm'>
                Already have an account?{' '}
                <Link to='/login' className='underline underline-offset-4'>
                  Login
                </Link>
              </div>
            </div>
          </form>

          <div className='bg-muted relative hidden md:block'>
            <img
              src='public/placeholder.svg'
              alt='Image'
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>

      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking register, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  )
}
