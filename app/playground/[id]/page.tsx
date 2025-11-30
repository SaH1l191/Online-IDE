"use client";
import React, { useEffect, useRef } from "react";
import { useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  FolderOpen,
  AlertCircle,
  Save,
  X,
  Settings,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePlayground } from '@/features/playground/hooks/usePlayground';
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { TemplateFileTree } from "@/features/playground/components/PlaygroundExplorer";

import { TemplateFolder } from "@/features/playground/types";
import PlaygroundEditor from "@/features/playground/components/PlaygroundEditor";


interface TemplateFile {
  filename: string;
  fileExtension: string;
  content: string;
}
const Playground = () => {

  const { id } = useParams<{ id: string }>();

  const { playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id)
  console.log("templateData", templateData)
  console.log("playgrond data", playgroundData)

  // const handleSaveAll = async () => {
  // }


  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();


  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  // Initialize zustand templateData from usePlayground only on first load
  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);


  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { },
    onCancel: () => { },
  });
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);
  // const aiSuggestions = 'asd'

  // const handleSave = useCallback(() => {

  // }, [])


  const handleFileSelect = (file: TemplateFile) => {
    console.log('file content', file)
    openFile(file);
  };

  // const wrappedHandleAddFile = useCallback(
  //   (newFile: TemplateFile, parentPath: string) => {
  //     return handleAddFile(
  //       newFile,
  //       parentPath,
  //       // writeFileSync!,
  //       instance,
  //       saveTemplateData
  //     );
  //   },
  //   [handleAddFile, writeFileSync, instance, saveTemplateData]
  // );

  // const wrappedHandleAddFolder = useCallback(
  //   (newFolder: TemplateFolder, parentPath: string) => {
  //     return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
  //   },
  //   [handleAddFolder, instance, saveTemplateData]
  // );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      return handleDeleteFile(file, parentPath, saveTemplateData);
    },
    [handleDeleteFile, saveTemplateData]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      return handleDeleteFolder(folder, parentPath, saveTemplateData);
    },
    [handleDeleteFolder, saveTemplateData]
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => {
      return handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFile, saveTemplateData]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      return handleRenameFolder(
        folder,
        newFolderName,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFolder, saveTemplateData]
  );

  return (
    <TooltipProvider>
      <>

        {/* display files  */}
        <TemplateFileTree
          data={templateData!}
          onFileSelect={handleFileSelect}
          selectedFile={activeFile}
          title="File Explorer"
          // onAddFile={wrappedHandleAddFile}
          // onAddFolder={wrappedHandleAddFolder}
          onDeleteFile={wrappedHandleDeleteFile}
          onDeleteFolder={wrappedHandleDeleteFolder}
          onRenameFile={wrappedHandleRenameFile}
          onRenameFolder={wrappedHandleRenameFolder}
        />
        <SidebarInset>


          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center gap-2">




              {/* playground name & unsaved changes  */}
              <div className="flex flex-col flex-1">
                <h1 className="text-sm font-medium">
                  {playgroundData?.name || "Code Playground"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {/* {openFiles.length} file(s) open
                  {hasUnsavedChanges && " • Unsaved changes"} */}
                </p>
              </div>



              {/* save , settings , utitily top right side  */}
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      // onClick={() => handleSave()}
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
                      // onClick={handleSaveAll}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" /> All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
                </Tooltip>


                {/* isEnabled={aiSuggestions.isEnabled}
                  onToggle={aiSuggestions.toggleEnabled}
                  suggestionLoading={aiSuggestions.isLoading} */}
                <Bot />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={closeAllFiles}>
                      Close All Files
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>


          <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
            {
              openFile.length > 0 ? (
                <div className="h-full flex flex-col">
                  {/* File Tabs */}
                  <div className="border-b bg-muted/30">
                    <Tabs
                      value={activeFileId || ""}
                      onValueChange={setActiveFileId}
                    >
                      <div className="flex items-center justify-between px-4 py-2">
                        <TabsList className="h-8 bg-transparent p-0">
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
                                    e.stopPropagation();
                                    closeFile(file.id);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </span>
                              </div>
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {openFiles.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={closeAllFiles}
                            className="h-6 px-2 text-xs"
                          >
                            Close All
                          </Button>
                        )}
                      </div>
                    </Tabs>
                  </div>


                  <div className="flex-1">
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="h-full"
                    >
                      <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                        <PlaygroundEditor
                          activeFile={activeFile}
                          content={activeFile?.content || ""}
                          onContentChange={(value) =>
                            activeFileId && updateFileContent(activeFileId, value)
                          } />
                      </ResizablePanel>
                    </ResizablePanelGroup>

                  </div>



                  {/* Editor and Preview */}
                  {/* <div className="flex-1">
                    
                      <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                        {/* <PlaygroundEditor
                          activeFile={activeFile}
                          content={activeFile?.content || ""}
                          onContentChange={(value) =>
                            activeFileId && updateFileContent(activeFileId, value)
                          }
                          suggestion={aiSuggestions.suggestion}
                          suggestionLoading={aiSuggestions.isLoading}
                          suggestionPosition={aiSuggestions.position}
                          onAcceptSuggestion={(editor, monaco) =>
                            aiSuggestions.acceptSuggestion(editor, monaco)
                          }
                          onRejectSuggestion={(editor) =>
                            aiSuggestions.rejectSuggestion(editor)
                          }
                          onTriggerSuggestion={(type, editor) =>
                            aiSuggestions.fetchSuggestion(type, editor)
                          }
                        /> 
                  </ResizablePanel> 

                  {/* {isPreviewVisible && ( */}
                  {/* <> */}
                  {/* <ResizableHandle /> */}
                  {/* <ResizablePanel defaultSize={50}> */}
                  {/* <WebContainerPreview */}
                  {/* templateData={templateData} */}
                  {/* instance={instance} */}
                  {/* writeFileSync={writeFileSync} */}
                  {/* isLoading={containerLoading} */}
                  {/* error={containerError} */}
                  {/* serverUrl={serverUrl!} */}
                  {/* forceResetup={false} */}
                  {/* /> */}
                  {/* </ResizablePanel> */}
                  {/* </> */}
                  {/* )} */}
                  {/* </ResizablePanelGroup> */}
                  {/* </div> */}
                </div>
              ) : (
                <div>
                  <FileText className="h-16 w-16 text-gray-300" />
                  <div className="text-center">
                    <p className="text-lg font-medium">No files open</p>
                    <p className="text-sm text-gray-500">
                      Select a file from the sidebar to start editing
                    </p>
                  </div>
                </div>
              )
            }
          </div>



        </SidebarInset>
      </>
    </TooltipProvider>
  )
}

export default Playground