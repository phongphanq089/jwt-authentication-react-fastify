import {
  userSchema,
  type UserRegisterSchemaType,
} from '~/validate/authentication'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent } from '~/components/ui/card'
import { Link } from 'react-router'

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserRegisterSchemaType>({
    resolver: zodResolver(userSchema.userRegisterSchema),
  })

  const onSubmitData = (data: UserRegisterSchemaType) => {
    console.log(data, 'onSubmit =====>')
  }

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

              <Button type='submit' className='w-full cursor-pointer'>
                Register
              </Button>

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
