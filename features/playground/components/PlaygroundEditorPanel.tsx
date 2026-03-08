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
    <div className="h-[calc(100vh-4rem)]">
      {openFiles.length > 0 ? (
        <div className="h-full flex flex-col">
          {/* File Tabs */}
          <div className="border-b bg-muted/30">
            <Tabs value={activeFileId || ""} onValueChange={onActiveFileChange}>
              <div className="flex items-center justify-between px-4 py-2">
                {/* <TabsList className="h-8 bg-transparent p-0">
                  {openFiles.map((file) => (
                    <TabsTrigger
                      key={file.id}
                      value={file.id}
                      className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>
                          {file.filename}.{file.fileExtension}
                        </span>
                        {file.hasUnsavedChanges && (
                          <span className="h-2 w-2 rounded-full bg-orange-500" />
                        )}
                        <span
                          className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            onFileClose(file.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList> */}

                {/* edit -1  */}
                <ScrollArea className="w-full">
                  <TabsList className="h-8 bg-transparent p-0 flex gap-1">
                    {openFiles.map((file) => (
                      <TabsTrigger
                        key={file.id}
                        value={file.id}
                        className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          <span>
                            {file.filename}.{file.fileExtension}
                          </span>
                          {file.hasUnsavedChanges && (
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                          )}
                          <span
                            className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              onFileClose(file.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </span>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ScrollBar
                    orientation="horizontal"
                    style={{ height: "8px" }}
                  />
                </ScrollArea>

                {openFiles.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onCloseAllFiles}
                    className="h-6 px-2 text-xs"
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
        <div className="flex flex-col items-center justify-center h-full">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            No file open
          </h3>
          <p className="text-sm text-muted-foreground">
            Select a file from the file explorer to start editing
          </p>
        </div>
      )}
    </div>
  )
}
