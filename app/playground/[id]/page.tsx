"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { useState } from "react";
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
// import WebContainerPreview from "@/features/webContainers/components/WebContainerPreview";

const MainPlaygroundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const { playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id);
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    updateFileContent,
    updateOpenFile,
    createFile,
    createFolder,
    deleteItem,
    renameItem,
    openFiles,
    templateData: fileExplorerTemplateData,
    setTemplateData,
    setActiveFile,
    setPlaygroundId,
  } = useFileExplorer();

  // Use file explorer's template data for the UI
  const currentTemplateData = fileExplorerTemplateData || templateData;

  const {
    serverUrl,
    isLoading: containerLoading,
    error: containerError,
    instance,
    writeFileSync,
  } = useWebContainer({ templateData: currentTemplateData! });
  console.log("webcontainer details ", {serverUrl,isLoading: containerLoading,error: containerError,instance,writeFileSync});

  const lastSyncedContent = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  const wrappedHandleAddFile = useCallback(
    (newFile: TemplateFile, parentPath: string) => {
      return createFile(parentPath, newFile, writeFileSync, instance);
    },
    [createFile, writeFileSync, instance]
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder: TemplateFolder, parentPath: string) => {
      return createFolder(parentPath, newFolder, writeFileSync, instance);
    },
    [createFolder, writeFileSync, instance]
  );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      const filePath = parentPath
        ? `${parentPath}/${file.filename}.${file.fileExtension}`
        : `${file.filename}.${file.fileExtension}`;
      return deleteItem(filePath);
    },
    [deleteItem]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      const folderPath = parentPath
        ? `${parentPath}/${folder.folderName}`
        : folder.folderName;
      return deleteItem(folderPath);
    },
    [deleteItem]
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => {
      const oldPath = parentPath
        ? `${parentPath}/${file.filename}.${file.fileExtension}`
        : `${file.filename}.${file.fileExtension}`;
      const newPath = parentPath
        ? `${parentPath}/${newFilename}.${newExtension}`
        : `${newFilename}.${newExtension}`;
      return renameItem(oldPath, newPath);
    },
    [renameItem]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      const oldPath = parentPath
        ? `${parentPath}/${folder.folderName}`
        : folder.folderName;
      const newPath = parentPath
        ? `${parentPath}/${newFolderName}`
        : newFolderName;
      return renameItem(oldPath, newPath);
    },
    [renameItem]
  );

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  // calls openFile(file)
  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  const handleSave = useCallback(
    async (fileId?: string) => {
      const targetFileId = fileId || activeFileId;
      if (!targetFileId) return;

      const fileToSave = openFiles.find((f) => f.id === targetFileId);
      if (!fileToSave) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return;

      try {
        const filePath = findFilePath(fileToSave, latestTemplateData);
        if (!filePath) {
          toast.error(
            `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`
          );
          return;
        }

        // Update file content in template data (clone for immutability)
        const updatedTemplateData = JSON.parse(
          JSON.stringify(latestTemplateData)
        );
        const updateFileContentInTemplate = (items: any[]): any[] =>
          items.map((item: any) => {
            if ("folderName" in item) {
              return { ...item, items: updateFileContentInTemplate(item.items) };
            } else if (
              item.filename === fileToSave.filename &&
              item.fileExtension === fileToSave.fileExtension
            ) {
              return { ...item, content: fileToSave.content };
            }
            return item;
          });
        updatedTemplateData.items = updateFileContentInTemplate(
          updatedTemplateData.items
        );

        // Sync with WebContainer
        if (writeFileSync) {
          await writeFileSync(filePath, fileToSave.content);
          lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
          if (instance && instance.fs) {
            await instance.fs.writeFile(filePath, fileToSave.content);
          }
        }

        // Use saveTemplateData to persist changes
        await saveTemplateData(updatedTemplateData);

        // Update open files using the new method
        updateOpenFile(targetFileId, {
          content: fileToSave.content,
          originalContent: fileToSave.content,
          hasUnsavedChanges: false,
        });

        toast.success(
          `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error(
          `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
        throw error;
      }
    },
    [
      activeFileId,
      openFiles,
      writeFileSync,
      instance,
      saveTemplateData,
      setTemplateData,
    ]
  );

  const handleSaveAll = async () => {
    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
      toast.success(`Saved ${unsavedFiles.length} file(s)`);
    } catch (error) {
      toast.error("Failed to save some files");
    }
  };

    //key stroke useEffect Register 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Try Again
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Loading Playground
          </h2>
          <div className="mb-8">
            <LoadingStep
              currentStep={1}
              step={1}
              label="Loading playground data"
            />
            <LoadingStep
              currentStep={2}
              step={2}
              label="Setting up environment"
            />
            <LoadingStep currentStep={3} step={3} label="Ready to code" />
          </div>
        </div>
      </div>
    );
  }

  // No template data
  if (!currentTemplateData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-amber-600 mb-2">
          No template data available
        </h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Template
        </Button>
      </div>
    );
  }

  const previewPanel = 
  // isPreviewVisible ?
  false 
  // ? (
    // <WebContainerPreview
    //   templateData={templateData}
    //   instance={instance}
    //   writeFileSync={writeFileSync}
    //   isLoading={containerLoading}
    //   error={containerError}
    //   serverUrl={serverUrl!}
    //   forceResetup={false}
    // />
  // ) : 
  null;

  return (
    <PlaygroundLayout
      templateData={currentTemplateData}
      playgroundData={playgroundData}
      openFiles={openFiles}
      activeFileId={activeFileId}
      hasUnsavedChanges={hasUnsavedChanges}
      isPreviewVisible={isPreviewVisible}
      onFileSelect={handleFileSelect}
      onAddFile={wrappedHandleAddFile}
      onAddFolder={wrappedHandleAddFolder}
      onDeleteFile={wrappedHandleDeleteFile}
      onDeleteFolder={wrappedHandleDeleteFolder}
      onRenameFile={wrappedHandleRenameFile}
      onRenameFolder={wrappedHandleRenameFolder}
      onSave={handleSave}
      onSaveAll={handleSaveAll}
      onCloseAllFiles={closeAllFiles}
      onFileClose={closeFile}
      onActiveFileChange={setActiveFile}
      onContentChange={updateFileContent}
      onPreviewToggle={() => setIsPreviewVisible(!isPreviewVisible)}
      previewPanel={previewPanel}
    />
  );
};

export default MainPlaygroundPage;
