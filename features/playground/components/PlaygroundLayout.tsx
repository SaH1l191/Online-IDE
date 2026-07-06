"use client"

import React from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { PlaygroundExplorer } from "./PlaygroundExplorer"
import { PlaygroundHeader } from "./PlaygroundHeader"
import { PlaygroundEditorPanel } from "./PlaygroundEditorPanel"
import { useEditorStore } from "../hooks/useEditorStore"
import { useFileExplorer } from "../hooks/useFileExplorer"
import { useWebContainer } from "@/features/web-containers/hooks/useWebContainer"
import { FileSystemHelper } from "../lib/filesystem-helper"

interface PlaygroundLayoutProps {
  playgroundData?: any
  isPreviewVisible: boolean
  onPreviewToggle: () => void
  previewPanel?: React.ReactNode
}

export function PlaygroundLayout({
  playgroundData,
  isPreviewVisible,
  onPreviewToggle,
  previewPanel,
}: PlaygroundLayoutProps) {
  const { openFiles, activeFileId, openFile, closeFile, closeAllFiles, setActiveFile, updateFileContent } = useEditorStore()
  const { templateData, createFile, createFolder, deleteItem, renameItem, saveFile, saveAllFiles } = useFileExplorer()
  const { instance, writeFileSync } = useWebContainer()

  const activeFile = openFiles.find((f) => f.id === activeFileId) || null

  if (!templateData) return null

  return (
    <>
      <PlaygroundExplorer
        data={templateData}
        onFileSelect={openFile}
        selectedFile={activeFile || undefined}
        title="File Explorer"
        onAddFile={(file, parent) => createFile(FileSystemHelper.fileItemPath(file, parent), file, writeFileSync, instance)}
        onAddFolder={(folder, parent) => createFolder(FileSystemHelper.folderPath(folder, parent), folder, instance)}
        onDeleteFile={(file, parent) => deleteItem(FileSystemHelper.fileItemPath(file, parent))}
        onDeleteFolder={(folder, parent) => deleteItem(FileSystemHelper.folderPath(folder, parent))}
        onRenameFile={(file, newName, newExt, parent) =>
          renameItem(FileSystemHelper.fileItemPath(file, parent), FileSystemHelper.buildPath(parent, `${newName}.${newExt}`))}
        onRenameFolder={(folder, newName, parent) =>
          renameItem(FileSystemHelper.folderPath(folder, parent), FileSystemHelper.buildPath(parent, newName))}
      />

      <SidebarInset>
        <PlaygroundHeader
          playgroundName={playgroundData?.name}
          openFiles={openFiles}
          activeFile={activeFile}
          hasUnsavedChanges={openFiles.some(f => f.hasUnsavedChanges)}
          isPreviewVisible={isPreviewVisible}
          onPreviewToggle={onPreviewToggle}
          onSave={() => activeFileId && saveFile(activeFileId)}
          onSaveAll={saveAllFiles}
          onCloseAllFiles={closeAllFiles}
        />

        <div className="h-[calc(100vh-3rem)]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
              <PlaygroundEditorPanel
                openFiles={openFiles}
                activeFileId={activeFileId}
                isPreviewVisible={isPreviewVisible}
                onFileClose={closeFile}
                onCloseAllFiles={closeAllFiles}
                onActiveFileChange={setActiveFile}
                onContentChange={updateFileContent}
              />
            </ResizablePanel>

            {isPreviewVisible && previewPanel && (
              <>
                <ResizableHandle className="w-[3px] hover:w-[5px] transition-all duration-200 bg-border hover:bg-gradient-to-b hover:from-primary hover:to-accent rounded-full data-[resize-handle-active]:bg-gradient-to-b data-[resize-handle-active]:from-primary data-[resize-handle-active]:to-accent" />
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
