import Image from 'next/image'

import SignInForm from '@/features/auth/components/SignInForm'


const SignInPage = () => {
  return (
    <div className='h-full w-full'>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center z-10">
            <div className="w-full max-w-3/4 flex px-5">
              <SignInForm />
            </div>
          </div>
        </div>
        <div className="relative hidden items-center justify-center lg:flex z-10 bg-gradient-to-br from-primary/10 via-background to-accent/10 text-foreground w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl opacity-40" />
          <Image
            width={500} height={500}
            src="/images/skeleton.png"
            alt="Image"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
          />
          <img src='/images/msg.png' className='top-35 right-60 absolute drop-shadow-lg' width={150} />
        </div>
      </div>
    </div>
  )
}

export default SignInPage