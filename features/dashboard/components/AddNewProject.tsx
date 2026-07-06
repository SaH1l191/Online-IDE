"use client";
import { Button } from "@/components/ui/button"
import { createPlayground } from "@/features/playground/actions";
import TemplateSelectionModal from "@/features/playground/components/TemplateSelectionModal";
import { Plus } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

const AddNewProject = () => {


  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  } | null>(null)





  const handleSubmit = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => {
    setSelectedTemplate(data)
    const res = await createPlayground(data);
    toast("Playground created successfully");
    // Here you would typically handle the creation of a new playground
    // with the selected template data
    console.log("Creating new playground:", data)
    setIsModalOpen(false)
    // router.push(`/playground/${res?.id}`)
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border border-border/50 rounded-xl bg-card cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-card hover:border-primary/30 hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_0_30px_oklch(0.65_0.22_280/15%)]
        gradient-border"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          {/* + icon button */}
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-background group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-colors duration-300"
            size={"icon"}
          >
            <Plus size={30} className="transition-transform duration-300 group-hover:rotate-90" />
          </Button>
          {/* add new text  */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gradient">Add New</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">Create a new playground</p>
          </div>
        </div>

        {/* right side svg */}
        <div className="relative overflow-hidden">
          <Image
            src={"/add-new.svg"}
            alt="Create new playground"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddNewProject