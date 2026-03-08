"use client"

import React from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TemplateFileTree } from "./PlaygroundExplorer"
import { PlaygroundHeader } from "./PlaygroundHeader"
import { PlaygroundEditorPanel } from "./PlaygroundEditorPanel"
import { TemplateFile, TemplateFolder, OpenFile } from "../types"

interface PlaygroundLayoutProps {
  templateData: TemplateFolder
  playgroundData?: any
  openFiles: OpenFile[]
  activeFileId: string | null
  hasUnsavedChanges: boolean
  isPreviewVisible: boolean
  onFileSelect: (file: TemplateFile) => void
  onAddFile: (file: TemplateFile, parentPath: string) => void
  onAddFolder: (folder: TemplateFolder, parentPath: string) => void
  onDeleteFile: (file: TemplateFile, parentPath: string) => void
  onDeleteFolder: (folder: TemplateFolder, parentPath: string) => void
  onRenameFile: (file: TemplateFile, newFilename: string, newExtension: string, parentPath: string) => void
  onRenameFolder: (folder: TemplateFolder, newFolderName: string, parentPath: string) => void
  onSave: () => void
  onSaveAll: () => void
  onCloseAllFiles: () => void
  onFileClose: (fileId: string) => void
  onActiveFileChange: (fileId: string | null) => void
  onContentChange: (fileId: string, content: string) => void
  onPreviewToggle: () => void
  previewPanel?: React.ReactNode
}

export function PlaygroundLayout({
  templateData,
  playgroundData,
  openFiles,
  activeFileId,
  hasUnsavedChanges,
  isPreviewVisible,
  onFileSelect,
  onAddFile,
  onAddFolder,
  onDeleteFile,
  onDeleteFolder,
  onRenameFile,
  onRenameFolder,
  onSave,
  onSaveAll,
  onCloseAllFiles,
  onFileClose,
  onActiveFileChange,
  onContentChange,
  onPreviewToggle,
  previewPanel,
}: PlaygroundLayoutProps) {
  const activeFile = openFiles.find((f) => f.id === activeFileId) || null

  return (
    <>
      <TemplateFileTree
        data={templateData}
        onFileSelect={onFileSelect}
        selectedFile={activeFile || undefined}
        title="File Explorer"
        onAddFile={onAddFile}
        onAddFolder={onAddFolder}
        onDeleteFile={onDeleteFile}
        onDeleteFolder={onDeleteFolder}
        onRenameFile={onRenameFile}
        onRenameFolder={onRenameFolder}
      />

      <SidebarInset>
        <PlaygroundHeader
          playgroundName={playgroundData?.name}
          openFiles={openFiles}
          activeFile={activeFile}
          hasUnsavedChanges={hasUnsavedChanges}
          isPreviewVisible={isPreviewVisible}
          onPreviewToggle={onPreviewToggle}
          onSave={onSave}
          onSaveAll={onSaveAll}
          onCloseAllFiles={onCloseAllFiles}
        />

        <div className="h-[calc(100vh-4rem)]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
              <PlaygroundEditorPanel
                openFiles={openFiles}
                activeFileId={activeFileId}
                isPreviewVisible={isPreviewVisible}
                onFileClose={onFileClose}
                onCloseAllFiles={onCloseAllFiles}
                onActiveFileChange={onActiveFileChange}
                onContentChange={onContentChange}
              />
            </ResizablePanel>

            {isPreviewVisible && previewPanel && (
              <>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>
                  {previewPanel}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
    </>
  )
}
