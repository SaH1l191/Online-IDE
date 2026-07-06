"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
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
import { Save, Settings, Eye, EyeOff, X } from "lucide-react"
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
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 glass-heavy px-4">
      <SidebarTrigger className="-ml-1 hover:bg-accent/10" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex flex-1 items-center gap-2">
        <div className="flex flex-col flex-1 min-w-0">
          <h1 className="text-sm font-semibold tracking-tight truncate text-foreground">
            {playgroundName || "Code Playground"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {openFiles.length} file{openFiles.length !== 1 ? "s" : ""} open
            {hasUnsavedChanges && (
              <span className="text-warning ml-1">Unsaved changes</span>
            )}
          </p>
        </div>

        <TooltipProvider>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onSave}
                  disabled={!activeFile || !activeFile.hasUnsavedChanges}
                  className="h-7 px-2"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save (Ctrl+S)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onSaveAll}
                  disabled={!hasUnsavedChanges}
                  className="h-7 px-2"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">All</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onPreviewToggle}
                  className="h-7 px-2"
                >
                  {isPreviewVisible ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {isPreviewVisible ? "Hide" : "Show"} Preview
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPreviewVisible ? "Hide" : "Show"} Preview
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 px-2">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass">
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
        </TooltipProvider>
      </div>
    </header>
  )
}
