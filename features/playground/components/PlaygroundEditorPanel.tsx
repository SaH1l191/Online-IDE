"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, X } from "lucide-react"
import { OpenFile } from "../types"
import PlaygroundEditor from "./PlaygroundEditor"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface PlaygroundEditorPanelProps {
  openFiles: OpenFile[]
  activeFileId: string | null
  isPreviewVisible: boolean
  onFileClose: (fileId: string) => void
  onCloseAllFiles: () => void
  onActiveFileChange: (fileId: string | null) => void
  onContentChange: (fileId: string, content: string) => void
  previewPanel?: React.ReactNode
}

const fileExtensionColors: Record<string, string> = {
  tsx: "text-blue-400",
  ts: "text-blue-300",
  jsx: "text-cyan-400",
  js: "text-yellow-400",
  css: "text-pink-400",
  html: "text-orange-400",
  json: "text-green-400",
  md: "text-gray-400",
  py: "text-green-300",
  rs: "text-orange-300",
  go: "text-cyan-300",
}

export function PlaygroundEditorPanel({
  openFiles,
  activeFileId,
  isPreviewVisible,
  onFileClose,
  onCloseAllFiles,
  onActiveFileChange,
  onContentChange,
  previewPanel,
}: PlaygroundEditorPanelProps) {
  const activeFile = openFiles.find((f) => f.id === activeFileId)

  return (
    <div className="h-[calc(100vh-3rem)]">
      {openFiles.length > 0 ? (
        <div className="h-full flex flex-col">
          {/* File Tabs */}
          <div className="border-b border-border/50 bg-muted/20">
            <Tabs value={activeFileId || ""} onValueChange={onActiveFileChange}>
              <div className="flex items-center justify-between px-2 py-1">
                <ScrollArea className="w-full">
                  <TabsList className="h-8 bg-transparent p-0 flex gap-0.5">
                    {openFiles.map((file) => {
                      const ext = file.fileExtension.toLowerCase()
                      const colorClass = fileExtensionColors[ext] || "text-muted-foreground"
                      const isActive = file.id === activeFileId
                      return (
                        <TabsTrigger
                          key={file.id}
                          value={file.id}
                          className={`relative h-7 px-3 rounded-md group transition-all duration-150
                            ${isActive
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <FileText className={`h-3 w-3 ${isActive ? colorClass : ""}`} />
                            <span className="text-xs font-medium">
                              {file.filename}.{file.fileExtension}
                            </span>
                            {file.hasUnsavedChanges && (
                              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                            )}
                            <span
                              className="ml-1 h-4 w-4 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                onFileClose(file.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </span>
                          </div>
                          {isActive && (
                            <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full" />
                          )}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                  <ScrollBar
                    orientation="horizontal"
                    style={{ height: "6px" }}
                  />
                </ScrollArea>

                {openFiles.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onCloseAllFiles}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Close All
                  </Button>
                )}
              </div>
            </Tabs>
          </div>

          <div className="flex-1">
            <PlaygroundEditor
              activeFile={activeFile}
              content={activeFile?.content || ""}
              onContentChange={(value) =>
                activeFileId && onContentChange(activeFileId, value)
              }
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl" />
            <div className="relative bg-muted/50 rounded-2xl p-6">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">
              No file open
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Select a file from the explorer to start editing
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
