"use client"
import { Plus } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import RenameFolderDialog from "./dialogs/rename-folder-dialog"
import NewFolderDialog from "./dialogs/new-folder-dialog"
import NewFileDialog from "./dialogs/new-file-dialog"
import RenameFileDialog from "./dialogs/rename-file-dialog"
import { DeleteDialog } from "./dialogs/delete-dialog"
import { useState } from "react"
import { TemplateFile, TemplateFolder } from "../types"
import { useTreeDialogs } from "../hooks/useTreeDialogs"
import { TemplateNode } from "./TemplateNode"

type TemplateItem = TemplateFile | TemplateFolder

interface PlaygroundExplorerProps {
    data: TemplateItem
    onFileSelect: (file: TemplateFile) => void
    selectedFile?: TemplateFile
    title?: string
    onAddFile: (file: TemplateFile, parentPath: string) => void
    onAddFolder: (folder: TemplateFolder, parentPath: string) => void
    onDeleteFile: (file: TemplateFile, parentPath: string) => void
    onDeleteFolder: (folder: TemplateFolder, parentPath: string) => void
    onRenameFile: (file: TemplateFile, newFilename: string, newExtension: string, parentPath: string) => void
    onRenameFolder: (folder: TemplateFolder, newFolderName: string, parentPath: string) => void
}

export function PlaygroundExplorer({
    data,
    onFileSelect,
    selectedFile,
    title = "Files Explorer",
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onDeleteFolder,
    onRenameFile,
    onRenameFolder,
}: PlaygroundExplorerProps) {
    const isRootFolder = data && typeof data === "object" && "folderName" in data
    const [isRootFileDialogOpen, setIsRootFileDialogOpen] = useState(false)
    const [isRootFolderDialogOpen, setIsRootFolderDialogOpen] = useState(false)
    const { dialog, activeNode, openDialog, closeDialog } = useTreeDialogs()

    const items = isRootFolder ? (data as TemplateFolder).items : [data]

    const handleRootCreateFile = (filename: string, extension: string) => {
        onAddFile({ filename, fileExtension: extension, content: "" }, "")
        setIsRootFileDialogOpen(false)
    }

    const handleRootCreateFolder = (folderName: string) => {
        onAddFolder({ folderName, items: [] }, "")
        setIsRootFolderDialogOpen(false)
    }

    const handleDialogSubmit = () => {
        if (!activeNode) return
        const { node, parentPath } = activeNode

        if (dialog === "delete") {
            if ("filename" in node) onDeleteFile(node as TemplateFile, parentPath)
            else onDeleteFolder(node as TemplateFolder, parentPath)
        }
        closeDialog()
    }

    const handleRenameSubmit = (newName: string, newExtension?: string) => {
        if (!activeNode) return
        const { node, parentPath } = activeNode

        if ("filename" in node) {
            onRenameFile(node as TemplateFile, newName, newExtension || "", parentPath)
        } else {
            onRenameFolder(node as TemplateFolder, newName, parentPath)
        }
        closeDialog()
    }

    const handleCreateInFolder = (filename: string, extension: string) => {
        if (!activeNode) return
        onAddFile({ filename, fileExtension: extension, content: "" }, activeNode.parentPath)
        closeDialog()
    }

    const handleCreateFolderInFolder = (folderName: string) => {
        if (!activeNode) return
        onAddFolder({ folderName, items: [] }, activeNode.parentPath)
        closeDialog()
    }

    const activeFile = activeNode && "filename" in (activeNode.node || {}) ? activeNode.node as TemplateFile : null
    const activeFolder = activeNode && "folderName" in (activeNode.node || {}) ? activeNode.node as TemplateFolder : null

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{title}</SidebarGroupLabel>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarGroupAction>
                                <Plus className="h-4 w-4" />
                            </SidebarGroupAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsRootFileDialogOpen(true)}>
                                New File
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsRootFolderDialogOpen(true)}>
                                New Folder
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((child, index) => (
                                <TemplateNode
                                    key={index}
                                    item={child}
                                    onFileSelect={onFileSelect}
                                    selectedFile={selectedFile}
                                    level={0}
                                    path=""
                                    onOpenDialog={openDialog}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />

            <NewFileDialog
                isOpen={isRootFileDialogOpen}
                onClose={() => setIsRootFileDialogOpen(false)}
                onCreateFile={handleRootCreateFile}
            />
            <NewFolderDialog
                isOpen={isRootFolderDialogOpen}
                onClose={() => setIsRootFolderDialogOpen(false)}
                onCreateFolder={handleRootCreateFolder}
            />

            {dialog === "newFile" && activeFolder && (
                <NewFileDialog
                    isOpen={true}
                    onClose={closeDialog}
                    onCreateFile={handleCreateInFolder}
                />
            )}
            {dialog === "newFolder" && activeFolder && (
                <NewFolderDialog
                    isOpen={true}
                    onClose={closeDialog}
                    onCreateFolder={handleCreateFolderInFolder}
                />
            )}
            {dialog === "rename" && activeFile && (
                <RenameFileDialog
                    isOpen={true}
                    onClose={closeDialog}
                    onRename={handleRenameSubmit}
                    currentFilename={activeFile.filename}
                    currentExtension={activeFile.fileExtension}
                />
            )}
            {dialog === "rename" && activeFolder && (
                <RenameFolderDialog
                    isOpen={true}
                    onClose={closeDialog}
                    onRename={handleRenameSubmit}
                    currentFolderName={activeFolder.folderName}
                />
            )}
            {dialog === "delete" && activeFile && (
                <DeleteDialog
                    isOpen={true}
                    setIsOpen={closeDialog}
                    onConfirm={handleDialogSubmit}
                    title="Delete File"
                    description={`Are you sure you want to delete "${activeFile.filename}.${activeFile.fileExtension}"? This action cannot be undone.`}
                    itemName={`${activeFile.filename}.${activeFile.fileExtension}`}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                />
            )}
            {dialog === "delete" && activeFolder && (
                <DeleteDialog
                    isOpen={true}
                    setIsOpen={closeDialog}
                    onConfirm={handleDialogSubmit}
                    title="Delete Folder"
                    description={`Are you sure you want to delete "${activeFolder.folderName}" and all its contents? This action cannot be undone.`}
                    itemName={activeFolder.folderName}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                />
            )}
        </Sidebar>
    )
}
