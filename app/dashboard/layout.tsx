import { SidebarProvider } from '@/components/ui/sidebar' 
import { getAllPlaygroundForUser } from '@/features/dashboard/actions'
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSideBar'
import React from 'react'


const IconMapping: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
}



const DashbordLayout = async ({ children }: { children: React.ReactNode }) => {

    const playgroundData = await getAllPlaygroundForUser()

    const formattedPlaygroundData = playgroundData?.map((item) =>({
        id: item.id,
        name: item.title,
        icon: IconMapping[item.template],
        starred:item.StarMark?.[0]?.isMared || false
        
    }))


    return (
        <SidebarProvider> 
            <div className="flex min-h-screen w-full overflow-x-hidden">
                {/* Pass the formatted data with string icon names */}
                <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
                <main className="flex-1">{children}</main>
            </div>
        </SidebarProvider>
    )
}

export default DashbordLayout