import Image from 'next/image'
import React from 'react'
import SignInFormClient from '../../../../features/auth/components/SignInComponent'
 

const SignInPage = () => {
  return (
    <div className='h-full w-full'>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center  z-10">
            <div className="w-full max-w-3/4 flex px-5">
              <SignInFormClient />
            </div>
          </div>
        </div>
        <div className="relative hidden items-center justify-center lg:flex z-10 bg-[#FFE6C9] dark:bg-[#1a1a1a] text-foreground w-full h-full">
          <Image
            width={500} height={500}
            src="/images/skeleton.png"
            alt="Image"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
          <img src='/images/msg.png' className='top-35 right-60 absolute ' width={150} />
        </div>
      </div>
    </div>
  )
}

export default SignInPage