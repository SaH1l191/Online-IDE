import React from 'react'

const Authlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex justify-center items-center h-screen w-screen flex-col '>
      {children}
    </main>
  )
}

export default Authlayout