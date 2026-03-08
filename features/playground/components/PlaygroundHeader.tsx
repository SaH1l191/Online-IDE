"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Save, Settings } from "lucide-react"
import { OpenFile } from "../types"

interface PlaygroundHeaderProps {
  playgroundName?: string
  openFiles: OpenFile[]
  activeFile: OpenFile | null
  hasUnsavedChanges: boolean
  isPreviewVisible: boolean
  onPreviewToggle: () => void
  onSave: () => void
  onSaveAll: () => void
  onCloseAllFiles: () => void
}

export function PlaygroundHeader({
  playgroundName,
  openFiles,
  activeFile,
  hasUnsavedChanges,
  isPreviewVisible,
  onPreviewToggle,
  onSave,
  onSaveAll,
  onCloseAllFiles,
}: PlaygroundHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex flex-1 items-center gap-2">
        <div className="flex flex-col flex-1">
          <h1 className="text-sm font-medium">
            {playgroundName || "Code Playground"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {openFiles.length} file(s) open
            {hasUnsavedChanges && " • Unsaved changes"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={onSave}
                disabled={!activeFile || !activeFile.hasUnsavedChanges}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save (Ctrl+S)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={onSaveAll}
                disabled={!hasUnsavedChanges}
              >
                <Save className="h-4 w-4" /> All
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onPreviewToggle}>
                {isPreviewVisible ? "Hide" : "Show"} Preview
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onCloseAllFiles}>
                Close All Files
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
