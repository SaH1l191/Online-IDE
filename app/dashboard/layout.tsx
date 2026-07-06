import { SidebarProvider } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar'
import { getAllPlayground } from '@/features/playground/actions'
import React from 'react'

const IconMapping: Record<string, string> = {
  REACT: "Zap",
  NEXTJS: "Lightbulb",
  EXPRESS: "Database",
  VUE: "Compass",
  HONO: "FlameIcon",
  ANGULAR: "Terminal",
}

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const playgroundData = await getAllPlayground()

  const formattedPlaygroundData = playgroundData?.map((item) => ({
    id: item.id,
    name: item.title,
    icon: IconMapping[item.template],
    starred: item.StarMark?.[0]?.isMarked || false,
  }))

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-zinc-900 transition-colors duration-500">
        <DashboardSidebar initialPlaygroundData={formattedPlaygroundData || []} />
        <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout