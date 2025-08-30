"use client"
import { usePlayground } from '@/features/playground/hooks/usePlayground';
import { useParams } from 'next/navigation'
import React from 'react'

const Playground = () => {

  const { id } = useParams<{ id: string }>();

  const { playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id)
  console.log("templateData", templateData)
  console.log("playgrond data", playgroundData)

  return (
    <div>
      params :{id}
    </div>
  )
}

export default Playground