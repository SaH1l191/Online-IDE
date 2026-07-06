import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Image from "next/image"

const AddRepo = () => {
  return (
    <div
      className="group px-6 py-6 flex flex-row justify-between items-center border border-border/50 rounded-xl bg-card cursor-pointer 
      transition-all duration-300 ease-in-out
      hover:bg-card hover:border-accent/30 hover:scale-[1.02]
      shadow-[0_2px_10px_rgba(0,0,0,0.08)]
      hover:shadow-[0_0_30px_oklch(0.78_0.15_195/15%)]
      gradient-border"
    >
      <div className="flex flex-row justify-center items-start gap-4">
        <Button
          variant={"outline"}
          className="flex justify-center items-center bg-background group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:text-accent transition-colors duration-300"
          size={"icon"}
        >
          <ArrowDown size={30} className="transition-transform duration-300 group-hover:translate-y-1" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gradient">
            Open Github Repository
          </h1>

          <p className="text-sm text-muted-foreground max-w-[220px]">
            Work with your repositories in our editor
          </p></div>
      </div>

      <div className="relative overflow-hidden">
        <Image
          src={"/github.svg"}
          alt="Open GitHub repository"
          width={150}
          height={150}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  )
}

export default AddRepo