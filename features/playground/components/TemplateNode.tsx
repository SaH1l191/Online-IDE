"use client"
import * as React from "react"
import { ChevronRight, File, Folder } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
} from "@/components/ui/sidebar"
import { TemplateFile, TemplateFolder } from "../types"
import { NodeContextMenu } from "./NodeContextMenu"

type TemplateItem = TemplateFile | TemplateFolder

interface TemplateNodeProps {
    item: TemplateItem
    onFileSelect: (file: TemplateFile) => void
    selectedFile?: TemplateFile
    level: number
    path: string
    onOpenDialog: (type: "newFile" | "newFolder" | "rename" | "delete", node: TemplateItem, parentPath: string) => void
}

export function TemplateNode({
    item,
    onFileSelect,
    selectedFile,
    level,
    path,
    onOpenDialog,
}: TemplateNodeProps) {
    const isValidItem = item && typeof item === "object"
    const isFolder = isValidItem && "folderName" in item
    const [isOpen, setIsOpen] = React.useState(level < 2)

    if (!isValidItem) return null

    if (!isFolder) {
        const file = item as TemplateFile
        const fileName = `${file.filename}.${file.fileExtension}`
        const isSelected = selectedFile?.filename === file.filename && selectedFile?.fileExtension === file.fileExtension

        return (
            <SidebarMenuItem>
                <div className="flex items-center group">
                    <SidebarMenuButton isActive={isSelected} onClick={() => onFileSelect(file)} className="flex-1">
                        <File className="h-4 w-4 mr-2 shrink-0" />
                        <span>{fileName}</span>
                    </SidebarMenuButton>
                    <NodeContextMenu
                        type="file"
                        onNewFile={() => {}}
                        onNewFolder={() => {}}
                        onRename={() => onOpenDialog("rename", file, path)}
                        onDelete={() => onOpenDialog("delete", file, path)}
                    />
                </div>
            </SidebarMenuItem>
        )
    }

    const folder = item as TemplateFolder
    const currentPath = path ? `${path}/${folder.folderName}` : folder.folderName

    return (
        <SidebarMenuItem>
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="group/collapsible [&[data-state=open]>div>button>svg:first-child]:rotate-90"
            >
                <div className="flex items-center group">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex-1">
                            <ChevronRight className="transition-transform" />
                            <Folder className="h-4 w-4 mr-2 shrink-0" />
                            <span>{folder.folderName}</span>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <NodeContextMenu
                        type="folder"
                        onNewFile={() => onOpenDialog("newFile", folder, currentPath)}
                        onNewFolder={() => onOpenDialog("newFolder", folder, currentPath)}
                        onRename={() => onOpenDialog("rename", folder, path)}
                        onDelete={() => onOpenDialog("delete", folder, path)}
                    />
                </div>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {folder.items.map((childItem, index) => (
                            <TemplateNode
                                key={index}
                                item={childItem}
                                onFileSelect={onFileSelect}
                                selectedFile={selectedFile}
                                level={level + 1}
                                path={currentPath}
                                onOpenDialog={onOpenDialog}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}
