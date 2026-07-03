"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingStep from "@/components/ui/loader";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { useWebContainer } from "@/features/webContainers/hooks/useWebContainer";
import { TemplateFile, TemplateFolder } from "@/features/playground/types";
import { findFilePath } from "@/features/playground/lib/index";
import { PlaygroundLayout } from "@/features/playground/components/PlaygroundLayout";
import WebContainerPreview from "@/features/webContainers/components/WebContainerPreview";

const MainPlaygroundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const { playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id);

  const {
    activeFileId, openFiles,
    templateData: explorerTemplateData,
    setTemplateData, setPlaygroundId, setActiveFile,
    openFile, closeFile, closeAllFiles,
    updateFileContent, updateOpenFile,
    createFile, createFolder, deleteItem, renameItem,
  } = useFileExplorer();

  // explorerTemplateData is the live copy (edits applied); templateData is the DB copy.
  // Use the live copy for rendering, but fall back to DB copy on first load.
  const currentTemplateData = explorerTemplateData ?? templateData;

  // FIX: pass currentTemplateData (not templateData) so the container gets data immediately
  // after the explorer hydrates it — this is what was preventing auto-boot.
  const { isLoading: containerLoading, error: containerError, instance, writeFileSync } =
    useWebContainer();
    // useWebContainer({ templateData: currentTemplateData! });
    
    //set template data + playground id when they load
  useEffect(() => { setPlaygroundId(id); }, [id]);
  useEffect(() => { 
    if (templateData && !openFiles.length) setTemplateData(templateData);
  }, [templateData]);

  const handleSave = useCallback(async (fileId?: string) => {
    const targetId = fileId ?? activeFileId;
    if (!targetId) return;

    const file = openFiles.find(f => f.id === targetId);
    const latestTemplate = useFileExplorer.getState().templateData;
    if (!file || !latestTemplate) return;

    const filePath = findFilePath(file, latestTemplate);
    if (!filePath) {
      toast.error(`Could not find path for: ${file.filename}.${file.fileExtension}`);
      return;
    }

    try {
      const updatedTemplate = patchFileContent(latestTemplate, file);
      await saveTemplateData(updatedTemplate);

      //  currentTemplateData changes-) → WebContainerPreview's useEffect([templateData]) fires → syncs to container
      setTemplateData(updatedTemplate);

      updateOpenFile(targetId, {
        content: file.content,
        originalContent: file.content,
        hasUnsavedChanges: false,
      });

      toast.success(`Saved ${file.filename}.${file.fileExtension}`);
    } catch (err) {
      toast.error(`Failed to save ${file.filename}.${file.fileExtension}`);
    }
  }, [activeFileId, openFiles, saveTemplateData, setTemplateData]);

  const handleSaveAll = useCallback(async () => {
    const unsaved = openFiles.filter(f => f.hasUnsavedChanges);
    if (!unsaved.length) { toast.info("No unsaved changes"); return; }
    await Promise.all(unsaved.map(f => handleSave(f.id)));
    toast.success(`Saved ${unsaved.length} file(s)`);
  }, [openFiles, handleSave]);

  // Ctrl+S shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.ctrlKey && e.key === "s") { e.preventDefault(); handleSave(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  const buildPath = (parentPath: string, name: string) => parentPath ? `${parentPath}/${name}` : name;
  const fileItemPath = (f: TemplateFile, parent: string) => buildPath(parent, `${f.filename}.${f.fileExtension}`);
  const folderPath = (fo: TemplateFolder, parent: string) => buildPath(parent, fo.folderName);

  //Something went wrong.......
  if (error) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <Button onClick={() => window.location.reload()} variant="destructive">Try Again</Button>
    </div>
  );

  //setting up environment.......
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-6 text-center">Loading Playground</h2>
        <LoadingStep currentStep={1} step={1} label="Loading playground data" />
        <LoadingStep currentStep={2} step={2} label="Setting up environment" />
        <LoadingStep currentStep={3} step={3} label="Ready to code" />
      </div>
    </div>
  );

  // No template data (shouldn't happen, but just in case).......
  if (!currentTemplateData) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
      <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
      <h2 className="text-xl font-semibold text-amber-600 mb-2">No template data available</h2>
      <Button onClick={() => window.location.reload()} variant="outline">Reload Template</Button>
    </div>
  );

  return (
    <PlaygroundLayout
      templateData={currentTemplateData}
      playgroundData={playgroundData}
      openFiles={openFiles}
      activeFileId={activeFileId}
      hasUnsavedChanges={openFiles.some(f => f.hasUnsavedChanges)}
      isPreviewVisible={isPreviewVisible}
      onFileSelect={openFile}
      onAddFile={(file, parent) => createFile(fileItemPath(file, parent), file, writeFileSync, instance)}
      onAddFolder={(folder, parent) => createFolder(folderPath(folder, parent), folder, instance)}
      onDeleteFile={(file, parent) => deleteItem(fileItemPath(file, parent))}
      onDeleteFolder={(folder, parent) => deleteItem(folderPath(folder, parent))}
      onRenameFile={(file, newName, newExt, parent) =>
        renameItem(fileItemPath(file, parent), buildPath(parent, `${newName}.${newExt}`))}
      onRenameFolder={(folder, newName, parent) =>
        renameItem(folderPath(folder, parent), buildPath(parent, newName))}
      onSave={handleSave}
      onSaveAll={handleSaveAll}
      onCloseAllFiles={closeAllFiles}
      onFileClose={closeFile}
      onActiveFileChange={setActiveFile}
      onContentChange={updateFileContent}
      onPreviewToggle={() => setIsPreviewVisible(v => !v)} 
      previewPanel={isPreviewVisible ? (
        <WebContainerPreview
          templateData={currentTemplateData}
          isLoading={containerLoading}
          error={containerError}
          instance={instance}
          writeFileSync={writeFileSync}
          forceResetup={false}
        />
      ) : null}
    />
  );
};

export default MainPlaygroundPage;

function patchFileContent(template: TemplateFolder, file: { filename: string; fileExtension: string; content: string }): TemplateFolder {
  const patch = (items: any[]): any[] =>
    items.map(item =>
      "folderName" in item
        ? { ...item, items: patch(item.items) }
        : item.filename === file.filename && item.fileExtension === file.fileExtension
          ? { ...item, content: file.content }
          : item
    );
  return { ...template, items: patch(template.items) };
}

// app/playground/[id]/page.tsx (orchestrator - 179 lines)
//   ├── usePlayground()      → fetches data from DB
//   ├── useFileExplorer()    → Zustand store (214 lines)
//   ├── useWebContainer()    → boot + mount + install + start
//   │
//   ├── PlaygroundLayout     → passes 18 props
//   │   ├── PlaygroundSidebar
//   │   │   ├── PlaygroundExplorer → recursive tree (458 lines)
//   │   │   └── File operations
//   │   ├── PlaygroundEditorPanel
//   │   │   ├── PlaygroundEditor → Monaco + AI autocomplete
//   │   │   └── Tabs
//   │   └── WebContainerPreview
//   │       ├── Terminal → xterm.js
//   │       └── Preview iframe
//   │
//   └── Services
//       ├── FileSystemService → saves to DB + syncs to container
//       └── FileSystemHelper  → tree manipulation utilities