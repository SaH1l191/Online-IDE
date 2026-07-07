import { useState } from "react"
import { TemplateFile, TemplateFolder } from "../types"

type TemplateItem = TemplateFile | TemplateFolder

type DialogType = "newFile" | "newFolder" | "rename" | "delete" | null

interface ActiveNode {
  node: TemplateItem
  parentPath: string
}

export function useTreeDialogs() {
  const [isOpen, setIsOpen] = useState(false)
  const [dialog, setDialog] = useState<DialogType>(null)
  const [activeNode, setActiveNode] = useState<ActiveNode | null>(null)

  const openDialog = (type: DialogType, node: TemplateItem, parentPath: string) => {
    setDialog(type)
    setActiveNode({ node, parentPath })
  }

  const closeDialog = () => {
    setDialog(null)
    setActiveNode(null)
  }

  return { isOpen, setIsOpen, dialog, activeNode, openDialog, closeDialog }
}
